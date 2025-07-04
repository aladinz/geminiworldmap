import type { RealTimeData, NewsItem, TravelInfo } from '../types';

// Mock real-time data APIs (in production, these would be real API calls)
class RealTimeDataService {
  private static instance: RealTimeDataService;
  private populationTimers: Map<string, NodeJS.Timeout> = new Map();
  private basePopulations: Map<string, number> = new Map();

  static getInstance(): RealTimeDataService {
    if (!RealTimeDataService.instance) {
      RealTimeDataService.instance = new RealTimeDataService();
    }
    return RealTimeDataService.instance;
  }

  // Live population counter with realistic growth simulation
  startLivePopulationCounter(countryName: string, basePopulation: number): number {
    if (!this.basePopulations.has(countryName)) {
      this.basePopulations.set(countryName, basePopulation);
    }

    // Growth rates per second (very simplified)
    const growthRates: Record<string, number> = {
      'China': 0.01,
      'India': 0.015,
      'United States': 0.008,
      'Indonesia': 0.012,
      'Pakistan': 0.02,
      'Brazil': 0.006,
      'Nigeria': 0.025,
      'Bangladesh': 0.011,
      'Russia': 0.001,
      'Mexico': 0.009,
      'Egypt': 0.018,
      'Saudi Arabia': 0.012,
      'South Korea': 0.001,
      'Thailand': 0.003,
      'Vietnam': 0.009,
      'Malaysia': 0.011,
      'Singapore': 0.007,
      'Philippines': 0.015,
      'Turkey': 0.006,
      'Japan': -0.003,
    };

    const growthRate = growthRates[countryName] || 0.005;
    const currentTime = Date.now();
    const secondsElapsed = Math.floor(currentTime / 1000) % 86400; // Reset daily
    
    return Math.floor(basePopulation + (secondsElapsed * growthRate));
  }

  // Mock news API (in production, integrate with NewsAPI, Google News, etc.)
  async fetchCountryNews(countryName: string): Promise<NewsItem[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const mockNews: Record<string, NewsItem[]> = {
      'United States': [
        {
          title: 'US Economy Shows Strong Growth in Q3 2025',
          description: 'Latest economic indicators show continued robust performance...',
          url: 'https://example.com/us-economy',
          publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          source: 'Economic Times'
        },
        {
          title: 'New Infrastructure Bill Passes Congress',
          description: 'Major infrastructure investments approved for 2025-2030...',
          url: 'https://example.com/infrastructure',
          publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
          source: 'News Wire'
        }
      ],
      'China': [
        {
          title: 'China Launches New Green Energy Initiative',
          description: 'Massive solar and wind power projects announced...',
          url: 'https://example.com/china-energy',
          publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          source: 'Global Energy News'
        }
      ],
      'India': [
        {
          title: 'India\'s Space Program Reaches New Milestone',
          description: 'Successful lunar mission marks historic achievement...',
          url: 'https://example.com/india-space',
          publishedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          source: 'Space Today'
        }
      ],
      'Japan': [
        {
          title: 'Tokyo Olympics Legacy Projects Completed',
          description: 'Final infrastructure improvements from 2021 Olympics finished...',
          url: 'https://example.com/tokyo-legacy',
          publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          source: 'Sports & Infrastructure'
        }
      ],
      'Egypt': [
        {
          title: 'Egypt\'s Grand Egyptian Museum Opens New Wing',
          description: 'Latest archaeological discoveries unveiled at the world\'s largest museum...',
          url: 'https://example.com/egypt-museum',
          publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          source: 'Archaeological Today'
        },
        {
          title: 'New Economic Zone Announced in Suez Canal',
          description: 'Major infrastructure development to boost trade and investment...',
          url: 'https://example.com/egypt-economy',
          publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          source: 'Middle East Business'
        },
        {
          title: 'Egypt Advances Green Energy Projects',
          description: 'Solar power initiatives in the desert regions show promising results...',
          url: 'https://example.com/egypt-solar',
          publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
          source: 'Renewable Energy News'
        }
      ],
      'Saudi Arabia': [
        {
          title: 'NEOM Smart City Project Reaches Major Milestone',
          description: 'Revolutionary sustainable city development shows significant progress...',
          url: 'https://example.com/saudi-neom',
          publishedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          source: 'Saudi Vision 2030'
        },
        {
          title: 'Saudi Arabia Expands Renewable Energy Portfolio',
          description: 'Massive solar and wind projects announced as part of green transition...',
          url: 'https://example.com/saudi-renewable',
          publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          source: 'Energy Middle East'
        },
        {
          title: 'New Tourism Destinations Open in AlUla',
          description: 'Ancient archaeological sites welcome international visitors...',
          url: 'https://example.com/saudi-tourism',
          publishedAt: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
          source: 'Tourism Today'
        }
      ],
      'South Korea': [
        {
          title: 'South Korea Leads in 6G Technology Development',
          description: 'Next-generation wireless technology trials show promising results...',
          url: 'https://example.com/korea-6g',
          publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          source: 'Tech Asia'
        },
        {
          title: 'K-Culture Festival Attracts Global Audience',
          description: 'Korean culture continues to gain international popularity...',
          url: 'https://example.com/korea-culture',
          publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          source: 'Cultural Times'
        }
      ],
      'Thailand': [
        {
          title: 'Thailand Reopens Historic Temples After Restoration',
          description: 'Major temple restoration projects completed in Bangkok and Ayutthaya...',
          url: 'https://example.com/thailand-temples',
          publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          source: 'Heritage News'
        },
        {
          title: 'Sustainable Tourism Initiative Launched',
          description: 'New eco-friendly tourism programs promote environmental conservation...',
          url: 'https://example.com/thailand-tourism',
          publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          source: 'Tourism Thailand'
        }
      ],
      'Vietnam': [
        {
          title: 'Vietnam\'s Tech Sector Shows Rapid Growth',
          description: 'Startup ecosystem and tech investments reach new heights...',
          url: 'https://example.com/vietnam-tech',
          publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          source: 'Vietnam Tech News'
        },
        {
          title: 'Ha Long Bay Conservation Project Expands',
          description: 'UNESCO World Heritage site benefits from new protection measures...',
          url: 'https://example.com/vietnam-conservation',
          publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
          source: 'Environmental Today'
        }
      ],
      'Malaysia': [
        {
          title: 'Malaysia Advances Digital Economy Initiatives',
          description: 'New digital transformation programs boost economic growth...',
          url: 'https://example.com/malaysia-digital',
          publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          source: 'Digital Malaysia'
        },
        {
          title: 'Kuala Lumpur Skyline Gets New Landmark',
          description: 'Sustainable architecture project transforms city landscape...',
          url: 'https://example.com/malaysia-architecture',
          publishedAt: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
          source: 'Architecture Asia'
        }
      ],
      'Singapore': [
        {
          title: 'Singapore Unveils Smart Nation 2.0 Plan',
          description: 'Advanced AI and IoT integration across the city-state...',
          url: 'https://example.com/singapore-smart',
          publishedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          source: 'Smart Cities Today'
        },
        {
          title: 'New Vertical Farming Facilities Open',
          description: 'Innovative agriculture technology addresses food security...',
          url: 'https://example.com/singapore-farming',
          publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          source: 'AgTech News'
        }
      ],
      'Philippines': [
        {
          title: 'Philippines Expands Renewable Energy Projects',
          description: 'Solar and geothermal energy initiatives gain momentum...',
          url: 'https://example.com/philippines-energy',
          publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          source: 'Philippine Energy'
        },
        {
          title: 'Boracay Island Showcases Sustainable Tourism',
          description: 'Model eco-tourism practices implemented successfully...',
          url: 'https://example.com/philippines-tourism',
          publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          source: 'Island Tourism'
        }
      ],
      'Turkey': [
        {
          title: 'Istanbul Airport Becomes Global Hub',
          description: 'Major expansion completed, connecting Europe, Asia, and Africa...',
          url: 'https://example.com/turkey-aviation',
          publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          source: 'Aviation Weekly'
        },
        {
          title: 'Ancient Göbekli Tepe Site Reveals New Discoveries',
          description: 'Archaeological findings shed light on early human civilization...',
          url: 'https://example.com/turkey-archaeology',
          publishedAt: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString(),
          source: 'Archaeology News'
        }
      ]
    };

    return mockNews[countryName] || [
      {
        title: `Latest Updates from ${countryName}`,
        description: `Stay informed about current events and developments in ${countryName}...`,
        url: `https://example.com/${countryName.toLowerCase().replace(/\s+/g, '-')}`,
        publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        source: 'World News'
      }
    ];
  }

  // Mock travel information API
  async fetchTravelInfo(countryName: string): Promise<TravelInfo> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const mockTravelData: Record<string, TravelInfo> = {
      'United States': {
        visaRequired: true,
        visaType: 'ESTA/B-1/B-2',
        safetyRating: 4,
        bestTimeToVisit: 'April-June, September-November',
        averageCost: '$150-300/day',
        currency: 'USD',
        exchangeRate: 1.0,
        weatherInfo: {
          temperature: 22,
          condition: 'Partly Cloudy',
          humidity: 65
        }
      },
      'Japan': {
        visaRequired: false,
        safetyRating: 5,
        bestTimeToVisit: 'March-May, September-November',
        averageCost: '$100-200/day',
        currency: 'JPY',
        exchangeRate: 150.23,
        weatherInfo: {
          temperature: 18,
          condition: 'Clear',
          humidity: 72
        }
      },
      'France': {
        visaRequired: false,
        safetyRating: 4,
        bestTimeToVisit: 'April-June, September-October',
        averageCost: '$120-250/day',
        currency: 'EUR',
        exchangeRate: 0.92,
        weatherInfo: {
          temperature: 16,
          condition: 'Light Rain',
          humidity: 78
        }
      },
      'India': {
        visaRequired: true,
        visaType: 'e-Visa/Tourist Visa',
        safetyRating: 3,
        bestTimeToVisit: 'October-March',
        averageCost: '$30-80/day',
        currency: 'INR',
        exchangeRate: 83.12,
        weatherInfo: {
          temperature: 28,
          condition: 'Hot and Humid',
          humidity: 85
        }
      },
      'China': {
        visaRequired: true,
        visaType: 'Tourist Visa (L)',
        safetyRating: 4,
        bestTimeToVisit: 'April-June, September-November',
        averageCost: '$60-120/day',
        currency: 'CNY',
        exchangeRate: 7.23,
        weatherInfo: {
          temperature: 24,
          condition: 'Overcast',
          humidity: 68
        }
      },
      'Brazil': {
        visaRequired: false,
        safetyRating: 3,
        bestTimeToVisit: 'April-September (Dry Season)',
        averageCost: '$40-90/day',
        currency: 'BRL',
        exchangeRate: 5.12,
        weatherInfo: {
          temperature: 26,
          condition: 'Tropical',
          humidity: 80
        }
      },
      'Egypt': {
        visaRequired: true,
        visaType: 'e-Visa/Visa on Arrival',
        safetyRating: 3,
        bestTimeToVisit: 'October-April (Cooler months)',
        averageCost: '$25-60/day',
        currency: 'EGP',
        exchangeRate: 30.85,
        weatherInfo: {
          temperature: 25,
          condition: 'Sunny and Dry',
          humidity: 45
        }
      },
      'Saudi Arabia': {
        visaRequired: true,
        visaType: 'e-Visa/Tourist Visa',
        safetyRating: 4,
        bestTimeToVisit: 'October-March (Cooler season)',
        averageCost: '$80-200/day',
        currency: 'SAR',
        exchangeRate: 3.75,
        weatherInfo: {
          temperature: 28,
          condition: 'Hot and Sunny',
          humidity: 40
        }
      },
      'South Korea': {
        visaRequired: false,
        visaType: 'Visa-free (90 days)',
        safetyRating: 5,
        bestTimeToVisit: 'April-June, September-November',
        averageCost: '$70-150/day',
        currency: 'KRW',
        exchangeRate: 1320.50,
        weatherInfo: {
          temperature: 18,
          condition: 'Mild and Clear',
          humidity: 60
        }
      },
      'Thailand': {
        visaRequired: false,
        visaType: 'Visa-free (30 days)',
        safetyRating: 4,
        bestTimeToVisit: 'November-March (Cool season)',
        averageCost: '$30-80/day',
        currency: 'THB',
        exchangeRate: 36.20,
        weatherInfo: {
          temperature: 32,
          condition: 'Tropical and Humid',
          humidity: 75
        }
      },
      'Vietnam': {
        visaRequired: true,
        visaType: 'e-Visa/Visa on Arrival',
        safetyRating: 4,
        bestTimeToVisit: 'April-June, September-November',
        averageCost: '$25-60/day',
        currency: 'VND',
        exchangeRate: 24150.00,
        weatherInfo: {
          temperature: 28,
          condition: 'Tropical Monsoon',
          humidity: 80
        }
      },
      'Malaysia': {
        visaRequired: false,
        visaType: 'Visa-free (90 days)',
        safetyRating: 4,
        bestTimeToVisit: 'December-February (Dry season)',
        averageCost: '$40-90/day',
        currency: 'MYR',
        exchangeRate: 4.65,
        weatherInfo: {
          temperature: 30,
          condition: 'Tropical Equatorial',
          humidity: 85
        }
      },
      'Singapore': {
        visaRequired: false,
        visaType: 'Visa-free (90 days)',
        safetyRating: 5,
        bestTimeToVisit: 'February-April (Least rainfall)',
        averageCost: '$100-250/day',
        currency: 'SGD',
        exchangeRate: 1.35,
        weatherInfo: {
          temperature: 31,
          condition: 'Tropical Rainforest',
          humidity: 84
        }
      },
      'Philippines': {
        visaRequired: false,
        visaType: 'Visa-free (30 days)',
        safetyRating: 3,
        bestTimeToVisit: 'December-May (Dry season)',
        averageCost: '$30-70/day',
        currency: 'PHP',
        exchangeRate: 56.80,
        weatherInfo: {
          temperature: 29,
          condition: 'Tropical Maritime',
          humidity: 78
        }
      },
      'Turkey': {
        visaRequired: true,
        visaType: 'e-Visa',
        safetyRating: 3,
        bestTimeToVisit: 'April-June, September-November',
        averageCost: '$50-120/day',
        currency: 'TRY',
        exchangeRate: 32.50,
        weatherInfo: {
          temperature: 22,
          condition: 'Mediterranean',
          humidity: 65
        }
      }
    };

    return mockTravelData[countryName] || {
      visaRequired: true,
      safetyRating: 3,
      bestTimeToVisit: 'Year-round',
      averageCost: '$50-150/day',
      currency: 'Local Currency',
      weatherInfo: {
        temperature: 20,
        condition: 'Variable',
        humidity: 70
      }
    };
  }

  // Get complete real-time data for a country
  async getRealTimeData(countryName: string, basePopulation: number): Promise<RealTimeData> {
    try {
      const [news, travelInfo] = await Promise.all([
        this.fetchCountryNews(countryName),
        this.fetchTravelInfo(countryName)
      ]);

      const livePopulation = this.startLivePopulationCounter(countryName, basePopulation);
      
      // Calculate growth rate (simplified)
      const yearlyGrowthRates: Record<string, number> = {
        'India': 0.8,
        'Nigeria': 2.4,
        'Pakistan': 1.9,
        'Bangladesh': 1.0,
        'Indonesia': 0.9,
        'China': 0.2,
        'United States': 0.4,
        'Brazil': 0.6,
        'Egypt': 1.8,
        'Saudi Arabia': 1.2,
        'South Korea': 0.1,
        'Thailand': 0.3,
        'Vietnam': 0.9,
        'Malaysia': 1.1,
        'Singapore': 0.7,
        'Philippines': 1.5,
        'Turkey': 0.6,
        'Japan': -0.3,
      };

      return {
        livePopulation,
        populationGrowthRate: yearlyGrowthRates[countryName] || 0.5,
        lastUpdated: new Date().toISOString(),
        news,
        travelInfo
      };
    } catch (error) {
      console.error('Failed to fetch real-time data:', error);
      throw error;
    }
  }

  // Cleanup timers
  cleanup() {
    this.populationTimers.forEach(timer => clearInterval(timer));
    this.populationTimers.clear();
  }
}

export const realTimeDataService = RealTimeDataService.getInstance();
