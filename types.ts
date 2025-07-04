
export interface NewsItem {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: string;
}

export interface TravelInfo {
  visaRequired: boolean;
  visaType?: string;
  safetyRating: number; // 1-5 scale
  bestTimeToVisit: string;
  averageCost: string;
  currency: string;
  exchangeRate?: number;
  weatherInfo?: {
    temperature: number;
    condition: string;
    humidity: number;
  };
}

export interface RealTimeData {
  livePopulation: number;
  populationGrowthRate: number;
  lastUpdated: string;
  news: NewsItem[];
  travelInfo: TravelInfo;
}

export interface CountryData {
  name: string;
  capital: string;
  population: number;
  facts: string[];
  isLiveData?: boolean;
  realTimeData?: RealTimeData;
}
