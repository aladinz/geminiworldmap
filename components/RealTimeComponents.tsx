import React, { useState, useEffect } from 'react';
import type { RealTimeData, NewsItem, TravelInfo } from '../types';

interface LivePopulationCounterProps {
  basePopulation: number;
  growthRate: number;
  countryName: string;
}

export const LivePopulationCounter: React.FC<LivePopulationCounterProps> = ({ 
  basePopulation, 
  growthRate, 
  countryName 
}) => {
  const [currentPopulation, setCurrentPopulation] = useState(basePopulation);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPopulation(prev => {
        // Simulate real-time growth (very simplified)
        const growthPerSecond = (prev * (growthRate / 100)) / (365 * 24 * 3600);
        return Math.floor(prev + growthPerSecond);
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [growthRate]);

  const formatPopulation = (num: number) => new Intl.NumberFormat('en-US').format(num);

  return (
    <div className="bg-green-900 bg-opacity-50 rounded p-2 mb-2">
      <div className="flex items-center justify-between">
        <span className="text-green-300 font-semibold text-sm">🔴 Live Population</span>
        <span className="text-green-400 text-xs animate-pulse">● LIVE</span>
      </div>
      <div className="text-green-100 font-bold text-lg font-mono">
        {formatPopulation(currentPopulation)}
      </div>
      <div className="text-green-300 text-xs">
        Growth: +{growthRate}% annually
      </div>
    </div>
  );
};

interface NewsTickerProps {
  news: NewsItem[];
}

export const NewsTicker: React.FC<NewsTickerProps> = ({ news }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (news.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % news.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [news.length]);

  if (!news.length) return null;

  const currentNews = news[currentIndex];
  const timeAgo = getTimeAgo(currentNews.publishedAt);

  return (
    <div className="bg-blue-900 bg-opacity-50 rounded p-2 mb-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-blue-300 font-semibold text-sm">📰 Latest News</span>
        <span className="text-blue-400 text-xs">{timeAgo}</span>
      </div>
      <div className="text-blue-100 text-sm font-medium line-clamp-2 mb-1">
        {currentNews.title}
      </div>
      <div className="text-blue-200 text-xs opacity-80 line-clamp-2 mb-1">
        {currentNews.description}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-blue-300 text-xs">{currentNews.source}</span>
        {news.length > 1 && (
          <div className="flex gap-1">
            {news.map((_, index) => (
              <div
                key={index}
                className={`w-1.5 h-1.5 rounded-full ${
                  index === currentIndex ? 'bg-blue-400' : 'bg-blue-600'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface TravelInfoPanelProps {
  travelInfo: TravelInfo;
  countryName: string;
}

export const TravelInfoPanel: React.FC<TravelInfoPanelProps> = ({ travelInfo, countryName }) => {
  const getSafetyColor = (rating: number) => {
    if (rating >= 4) return 'text-green-400';
    if (rating >= 3) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getSafetyText = (rating: number) => {
    if (rating >= 4) return 'Very Safe';
    if (rating >= 3) return 'Moderately Safe';
    return 'Exercise Caution';
  };

  return (
    <div className="bg-purple-900 bg-opacity-50 rounded p-2">
      <div className="flex items-center justify-between mb-2">
        <span className="text-purple-300 font-semibold text-sm">✈️ Travel Info</span>
        <span className="text-purple-400 text-xs">Updated Now</span>
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <span className="text-purple-300">Visa:</span>
          <div className="text-purple-100">
            {travelInfo.visaRequired ? (
              <>
                <span className="text-red-300">Required</span>
                {travelInfo.visaType && (
                  <div className="text-purple-200 text-xs">{travelInfo.visaType}</div>
                )}
              </>
            ) : (
              <span className="text-green-300">Not Required</span>
            )}
          </div>
        </div>
        
        <div>
          <span className="text-purple-300">Safety:</span>
          <div className={`${getSafetyColor(travelInfo.safetyRating)} font-medium`}>
            {'★'.repeat(travelInfo.safetyRating)}{'☆'.repeat(5-travelInfo.safetyRating)}
          </div>
          <div className="text-purple-200 text-xs">
            {getSafetyText(travelInfo.safetyRating)}
          </div>
        </div>
        
        <div>
          <span className="text-purple-300">Currency:</span>
          <div className="text-purple-100">
            {travelInfo.currency}
            {travelInfo.exchangeRate && (
              <div className="text-purple-200 text-xs">
                1 USD = {travelInfo.exchangeRate.toFixed(2)} {travelInfo.currency}
              </div>
            )}
          </div>
        </div>
        
        <div>
          <span className="text-purple-300">Cost:</span>
          <div className="text-purple-100">{travelInfo.averageCost}</div>
        </div>
      </div>
      
      {travelInfo.weatherInfo && (
        <div className="mt-2 pt-2 border-t border-purple-700">
          <div className="flex items-center justify-between">
            <span className="text-purple-300 text-xs">Current Weather:</span>
            <span className="text-purple-100 text-xs">
              {travelInfo.weatherInfo.temperature}°C, {travelInfo.weatherInfo.condition}
            </span>
          </div>
        </div>
      )}
      
      <div className="mt-1">
        <span className="text-purple-300 text-xs">Best Time:</span>
        <div className="text-purple-100 text-xs">{travelInfo.bestTimeToVisit}</div>
      </div>
    </div>
  );
};

// Helper function to calculate time ago
function getTimeAgo(dateString: string): string {
  const now = new Date();
  const past = new Date(dateString);
  const diffMs = now.getTime() - past.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor(diffMs / (1000 * 60));

  if (diffHours >= 24) {
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  } else if (diffHours >= 1) {
    return `${diffHours}h ago`;
  } else {
    return `${diffMins}m ago`;
  }
}
