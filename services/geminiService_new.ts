import { GoogleGenerativeAI } from "@google/generative-ai";
import type { CountryData } from '../types';
import { COUNTRY_POPULATIONS } from '../constants';

// Get API key from Vite environment
const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;
console.log('🔑 API Key status:', apiKey ? 'Present' : 'Missing');

// Track retry attempts to avoid infinite loops
const retryAttempts = new Map<string, number>();

// Function to clear retry attempts (can be called to reset)
export const clearRetryAttempts = () => {
    retryAttempts.clear();
};

// Mock data fallback for when API quota is exceeded or API fails
const getMockCountryData = (countryName: string): CountryData => {
    const mockData: Record<string, CountryData> = {
        'United States': {
            name: 'United States',
            capital: 'Washington, D.C.',
            population: COUNTRY_POPULATIONS['United States of America'] || 341814000,
            facts: [
                'Third most populous country in the world',
                'Federal republic with 50 states and Washington D.C.',
                'World\'s largest economy by nominal GDP ($26+ trillion)'
            ]
        },
        'China': {
            name: 'China',
            capital: 'Beijing',
            population: COUNTRY_POPULATIONS['China'] || 1425672000,
            facts: [
                'Second most populous country (overtaken by India in 2023)',
                'World\'s second largest economy by nominal GDP',
                'One-party socialist republic with 56 ethnic groups'
            ]
        },
        'India': {
            name: 'India',
            capital: 'New Delhi',
            population: COUNTRY_POPULATIONS['India'] || 1428627000,
            facts: [
                'Most populous country in the world (overtook China in 2023)',
                'World\'s largest democracy with federal parliamentary system',
                'Fastest growing major economy with over 1,600 languages'
            ]
        },
        'Brazil': {
            name: 'Brazil',
            capital: 'Brasília',
            population: COUNTRY_POPULATIONS['Brazil'] || 216422000,
            facts: [
                'Fifth most populous and largest country in South America',
                'Contains 60% of the Amazon rainforest',
                'Federal presidential republic, largest economy in Latin America'
            ]
        },
        'Russia': {
            name: 'Russia',
            capital: 'Moscow',
            population: COUNTRY_POPULATIONS['Russia'] || 144444000,
            facts: [
                'Largest country by land area (17.1 million km²)',
                'Federal semi-presidential republic spanning 11 time zones',
                'World\'s largest reserves of natural gas and significant oil reserves'
            ]
        },
        'Japan': {
            name: 'Japan',
            capital: 'Tokyo',
            population: COUNTRY_POPULATIONS['Japan'] || 123294000,
            facts: [
                'Island nation consisting of 6,852 islands',
                'Third largest economy and highly developed nation',
                'Constitutional monarchy with parliamentary government'
            ]
        },
        'Germany': {
            name: 'Germany',
            capital: 'Berlin',
            population: COUNTRY_POPULATIONS['Germany'] || 84482000,
            facts: [
                'Most populous member state of the European Union',
                'Largest economy in Europe and fourth largest globally',
                'Federal parliamentary republic and founding member of EU'
            ]
        },
        'United Kingdom': {
            name: 'United Kingdom',
            capital: 'London',
            population: COUNTRY_POPULATIONS['United Kingdom'] || 67889000,
            facts: [
                'Constitutional monarchy comprising England, Scotland, Wales, and Northern Ireland',
                'Left the European Union in 2020 (Brexit)',
                'London is a major global financial center'
            ]
        },
        'France': {
            name: 'France',
            capital: 'Paris',
            population: COUNTRY_POPULATIONS['France'] || 68373000,
            facts: [
                'Semi-presidential republic and founding member of EU',
                'World\'s most visited country for tourism',
                'Permanent member of UN Security Council'
            ]
        },
        'Italy': {
            name: 'Italy',
            capital: 'Rome',
            population: COUNTRY_POPULATIONS['Italy'] || 58870000,
            facts: [
                'Parliamentary republic in Southern Europe',
                'Birthplace of the Roman Empire and Renaissance',
                'Has 58 UNESCO World Heritage Sites, more than any other country'
            ]
        },
        'Canada': {
            name: 'Canada',
            capital: 'Ottawa',
            population: COUNTRY_POPULATIONS['Canada'] || 39566000,
            facts: [
                'Second largest country by total area (10 million km²)',
                'Federal parliamentary democracy and constitutional monarchy',
                'Bilingual nation with English and French as official languages'
            ]
        },
        'Mexico': {
            name: 'Mexico',
            capital: 'Mexico City',
            population: COUNTRY_POPULATIONS['Mexico'] || 131562000,
            facts: [
                'Third most populous country in North America',
                'Federal presidential republic with 32 federal entities',
                'Major emerging economy and member of USMCA trade agreement'
            ]
        },
        'Australia': {
            name: 'Australia',
            capital: 'Canberra',
            population: COUNTRY_POPULATIONS['Australia'] || 26640000,
            facts: [
                'Only country that is also a continent (7.7 million km²)',
                'Federal parliamentary constitutional monarchy',
                'One of the world\'s most urbanized countries (86% urban)'
            ]
        },
        'Spain': {
            name: 'Spain',
            capital: 'Madrid',
            population: COUNTRY_POPULATIONS['Spain'] || 48373000,
            facts: [
                'Constitutional monarchy in Southwestern Europe',
                'Member of EU, NATO, and UN Security Council (non-permanent)',
                'Spanish is the world\'s second most spoken native language'
            ]
        },
        'Argentina': {
            name: 'Argentina',
            capital: 'Buenos Aires',
            population: COUNTRY_POPULATIONS['Argentina'] || 46233000,
            facts: [
                'Second largest country in South America by area',
                'Federal presidential republic with 23 provinces',
                'Major agricultural exporter and birthplace of tango'
            ]
        },
        'Egypt': {
            name: 'Egypt',
            capital: 'Cairo',
            population: COUNTRY_POPULATIONS['Egypt'] || 112717000,
            facts: [
                'Most populous country in the Arab world',
                'Semi-presidential republic transcontinental between Africa and Asia',
                'Home to ancient civilization and the Suez Canal'
            ]
        },
        'South Africa': {
            name: 'South Africa',
            capital: 'Cape Town',
            population: COUNTRY_POPULATIONS['South Africa'] || 60756000,
            facts: [
                'Has three capital cities: Cape Town, Pretoria, and Bloemfontein',
                'Parliamentary republic with 11 official languages',
                'Most industrialized economy in Africa'
            ]
        },
        'Turkey': {
            name: 'Turkey',
            capital: 'Ankara',
            population: COUNTRY_POPULATIONS['Turkey'] || 85816000,
            facts: [
                'Transcontinental country located mainly in Asia Minor',
                'Presidential republic and member of NATO',
                'Bridges Europe and Asia via the Bosphorus strait'
            ]
        },
        'Indonesia': {
            name: 'Indonesia',
            capital: 'Jakarta',
            population: COUNTRY_POPULATIONS['Indonesia'] || 277749000,
            facts: [
                'Fourth most populous country in the world',
                'Largest archipelago with over 17,000 islands',
                'Presidential republic and largest economy in Southeast Asia'
            ]
        },
        'Pakistan': {
            name: 'Pakistan',
            capital: 'Islamabad',
            population: COUNTRY_POPULATIONS['Pakistan'] || 240486000,
            facts: [
                'Fifth most populous country in the world',
                'Federal parliamentary Islamic republic',
                'Created in 1947 during partition of British India'
            ]
        },
        'Nigeria': {
            name: 'Nigeria',
            capital: 'Abuja',
            population: COUNTRY_POPULATIONS['Nigeria'] || 223804000,
            facts: [
                'Most populous country in Africa',
                'Federal republic with 36 states',
                'Largest economy in Africa, major oil producer'
            ]
        },
        'Bangladesh': {
            name: 'Bangladesh',
            capital: 'Dhaka',
            population: COUNTRY_POPULATIONS['Bangladesh'] || 172954000,
            facts: [
                'Eighth most populous country despite small area',
                'Parliamentary republic in South Asia',
                'One of the world\'s most densely populated countries'
            ]
        },
        'Iran': {
            name: 'Iran',
            capital: 'Tehran',
            population: COUNTRY_POPULATIONS['Iran'] || 86758000,
            facts: [
                'Islamic republic in Western Asia',
                'Ancient civilization formerly known as Persia',
                'Major oil and gas reserves in the Middle East'
            ]
        },
        'South Korea': {
            name: 'South Korea',
            capital: 'Seoul',
            population: COUNTRY_POPULATIONS['South Korea'] || 51713000,
            facts: [
                'Developed country with advanced technology sector',
                'Democratic republic in East Asia',
                'Known for Korean Wave culture (K-pop, K-drama)'
            ]
        },
        'Ukraine': {
            name: 'Ukraine',
            capital: 'Kyiv',
            population: COUNTRY_POPULATIONS['Ukraine'] || 37000000,
            facts: [
                'Largest country entirely within Europe',
                'Semi-presidential republic in Eastern Europe',
                'Major agricultural producer known as "breadbasket of Europe"'
            ]
        },
        'Poland': {
            name: 'Poland',
            capital: 'Warsaw',
            population: COUNTRY_POPULATIONS['Poland'] || 36821000,
            facts: [
                'Parliamentary republic in Central Europe',
                'Member of EU and NATO since 2004 and 1999 respectively',
                'Fastest growing economy in Europe over past decades'
            ]
        },
        'Thailand': {
            name: 'Thailand',
            capital: 'Bangkok',
            population: COUNTRY_POPULATIONS['Thailand'] || 71668000,
            facts: [
                'Constitutional monarchy in Southeast Asia',
                'Never been colonized by European powers',
                'Major tourist destination and rice exporter'
            ]
        },
        'Vietnam': {
            name: 'Vietnam',
            capital: 'Hanoi',
            population: COUNTRY_POPULATIONS['Vietnam'] || 98858000,
            facts: [
                'Socialist republic in Southeast Asia',
                'Rapidly growing economy with manufacturing focus',
                'Unified in 1975 after Vietnam War'
            ]
        },
        'Morocco': {
            name: 'Morocco',
            capital: 'Rabat',
            population: COUNTRY_POPULATIONS['Morocco'] || 37840000,
            facts: [
                'Constitutional monarchy in North Africa',
                'Known for the Atlas Mountains and Sahara Desert',
                'Rich cultural heritage with Arab, Berber, and French influences'
            ]
        },
        'Libya': {
            name: 'Libya',
            capital: 'Tripoli',
            population: COUNTRY_POPULATIONS['Libya'] || 6888000,
            facts: [
                'Located in North Africa with Mediterranean coastline',
                'Has the largest proven oil reserves in Africa',
                'Home to ancient Roman and Greek archaeological sites'
            ]
        }
    };

    return mockData[countryName] || {
        name: countryName,
        capital: 'Capital City',
        population: COUNTRY_POPULATIONS[countryName] || Math.floor(Math.random() * 100000000) + 1000000,
        facts: [
            `${countryName} has a rich cultural heritage`,
            `Located in a beautiful region of the world`,
            `Known for its unique traditions and customs`
        ]
    };
};

export const fetchCountryData = async (countryName: string): Promise<CountryData> => {
    console.log(`🔍 Fetching data for: ${countryName}`);
    
    // For demo purposes, immediately use mock data to ensure all countries show data instantly
    // This prevents any "fetching data" delays and ensures a smooth user experience
    console.log(`📋 Using mock data for ${countryName} to ensure immediate response`);
    const mockData = getMockCountryData(countryName);
    return { ...mockData, isLiveData: false };
};
