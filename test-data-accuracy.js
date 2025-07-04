// Test script to check data accuracy
import { fetchCountryData } from './services/geminiService.js';

const testCountries = [
    'United States',
    'China', 
    'India',
    'Brazil',
    'Russia',
    'Japan',
    'Germany',
    'United Kingdom',
    'France',
    'Italy'
];

// Correct data for comparison (as of 2025)
const correctData = {
    'United States': {
        capital: 'Washington, D.C.',
        population: 335000000, // Approximate 2025
        facts: ['Federal republic with 50 states', 'Largest economy by GDP', 'Third most populous country']
    },
    'China': {
        capital: 'Beijing',
        population: 1425000000, // Approximate 2025  
        facts: ['Most populous country', 'Second largest economy', 'One-party socialist republic']
    },
    'India': {
        capital: 'New Delhi',
        population: 1428000000, // Approximate 2025, now most populous
        facts: ['Most populous country as of 2023', 'Largest democracy', 'Federal parliamentary republic']
    },
    'Brazil': {
        capital: 'Brasília',
        population: 216000000, // Approximate 2025
        facts: ['Largest country in South America', 'Contains most of Amazon rainforest', 'Federal republic']
    },
    'Russia': {
        capital: 'Moscow', 
        population: 144000000, // Approximate 2025
        facts: ['Largest country by land area', 'Federal semi-presidential republic', 'Spans 11 time zones']
    },
    'Japan': {
        capital: 'Tokyo',
        population: 123000000, // Approximate 2025 (declining)
        facts: ['Island nation with 4 main islands', 'Third largest economy', 'Constitutional monarchy']
    },
    'Germany': {
        capital: 'Berlin',
        population: 84000000, // Approximate 2025
        facts: ['Largest economy in Europe', 'Federal parliamentary republic', 'Member of EU and NATO']
    },
    'United Kingdom': {
        capital: 'London',
        population: 67000000, // Approximate 2025
        facts: ['Constitutional monarchy', 'Comprises England, Scotland, Wales, N. Ireland', 'Left EU in 2020']
    },
    'France': {
        capital: 'Paris',
        population: 68000000, // Approximate 2025
        facts: ['Semi-presidential republic', 'Member of EU and NATO', 'Major cultural and tourist destination']
    },
    'Italy': {
        capital: 'Rome',
        population: 59000000, // Approximate 2025
        facts: ['Parliamentary republic', 'Member of EU and NATO', 'Birthplace of Roman Empire and Renaissance']
    }
};

async function testDataAccuracy() {
    console.log('🧪 Testing data accuracy for major countries...\n');
    
    for (const country of testCountries) {
        try {
            console.log(`Testing ${country}...`);
            const data = await fetchCountryData(country);
            const correct = correctData[country];
            
            console.log(`Returned data for ${country}:`);
            console.log(`  Capital: ${data.capital} (Expected: ${correct.capital})`);
            console.log(`  Population: ${data.population.toLocaleString()} (Expected: ~${correct.population.toLocaleString()})`);
            console.log(`  Live Data: ${data.isLiveData !== false ? 'YES' : 'NO'}`);
            console.log(`  Facts: ${data.facts.join('; ')}`);
            
            // Check accuracy
            const capitalCorrect = data.capital === correct.capital;
            const populationReasonable = Math.abs(data.population - correct.population) < (correct.population * 0.1); // Within 10%
            
            console.log(`  ✅ Capital: ${capitalCorrect ? 'CORRECT' : 'INCORRECT'}`);
            console.log(`  ✅ Population: ${populationReasonable ? 'REASONABLE' : 'NEEDS UPDATE'}`);
            console.log('  ---\n');
            
        } catch (error) {
            console.error(`❌ Error testing ${country}:`, error.message);
        }
    }
}

testDataAccuracy().catch(console.error);
