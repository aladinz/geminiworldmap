import React, { useState, useEffect } from 'react';
import { machineLearningService, type Recommendation, type UserPreferences } from '../services/machineLearningService';

interface MLRecommendationsProps {
  onCountrySelect: (countryName: string) => void;
  currentCountry?: string;
  isVisible: boolean;
  onToggle: () => void;
}

export const MLRecommendations: React.FC<MLRecommendationsProps> = ({
  onCountrySelect,
  currentCountry,
  isVisible,
  onToggle,
}) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [showPreferences, setShowPreferences] = useState(false);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    updateRecommendations();
    setUserPreferences(machineLearningService.getUserPreferences());
    setStats(machineLearningService.getInteractionStats());
  }, [currentCountry]);

  const updateRecommendations = () => {
    const excludeCountries = currentCountry ? [currentCountry] : [];
    const newRecommendations = machineLearningService.generateRecommendations(excludeCountries, 5);
    setRecommendations(newRecommendations);
  };

  const handleCountryRate = (country: string, rating: number) => {
    machineLearningService.trackInteraction({
      countryName: country,
      action: 'rate',
      timestamp: Date.now(),
      rating,
    });
    updateRecommendations();
  };

  const handlePreferenceUpdate = (key: keyof UserPreferences, value: any) => {
    machineLearningService.updateUserPreference(key, value);
    setUserPreferences(machineLearningService.getUserPreferences());
    updateRecommendations();
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.7) return 'text-green-400';
    if (confidence >= 0.4) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'bg-green-600';
    if (score >= 0.6) return 'bg-yellow-600';
    return 'bg-blue-600';
  };

  if (!isVisible) {
    return (
      <button
        onClick={onToggle}
        className="fixed top-1/2 left-4 transform -translate-y-1/2 bg-purple-600 hover:bg-purple-500 text-white p-3 rounded-full shadow-lg z-50 smooth-transition"
        title="Open AI Recommendations"
      >
        🤖
      </button>
    );
  }

  return (
    <div className="fixed left-4 top-20 w-80 bg-gray-800 border border-purple-500 rounded-lg shadow-xl z-50 max-h-96 overflow-hidden">
      {/* Header */}
      <div className="bg-purple-600 p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">🤖</span>
          <h3 className="font-bold text-white">AI Recommendations</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPreferences(!showPreferences)}
            className="text-white hover:text-purple-200 text-sm smooth-transition"
            title="Settings"
          >
            ⚙️
          </button>
          <button
            onClick={onToggle}
            className="text-white hover:text-purple-200 smooth-transition"
            title="Close"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="max-h-80 overflow-y-auto">
        {/* User Stats */}
        {stats && (
          <div className="p-3 bg-gray-900 border-b border-gray-700">
            <div className="text-xs text-gray-400 grid grid-cols-2 gap-2">
              <div>Countries explored: <span className="text-purple-400 font-semibold">{stats.countriesExplored}</span></div>
              <div>Interactions: <span className="text-purple-400 font-semibold">{stats.totalInteractions}</span></div>
              {stats.averageRating > 0 && (
                <div className="col-span-2">
                  Avg. rating: <span className="text-purple-400 font-semibold">{stats.averageRating.toFixed(1)}/5</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Preferences Panel */}
        {showPreferences && userPreferences && (
          <div className="p-3 bg-gray-900 border-b border-gray-700 space-y-3">
            <h4 className="text-white font-semibold text-sm">Customize Preferences</h4>
            
            <div>
              <label className="text-xs text-gray-400">Budget Range</label>
              <select
                value={userPreferences.budgetRange}
                onChange={(e) => handlePreferenceUpdate('budgetRange', e.target.value)}
                className="w-full mt-1 bg-gray-700 text-white text-xs p-1 rounded"
              >
                <option value="low">Low ($20-60/day)</option>
                <option value="medium">Medium ($60-150/day)</option>
                <option value="high">High ($150+/day)</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-400">Safety Preference</label>
              <select
                value={userPreferences.preferredSafetyRating}
                onChange={(e) => handlePreferenceUpdate('preferredSafetyRating', parseInt(e.target.value))}
                className="w-full mt-1 bg-gray-700 text-white text-xs p-1 rounded"
              >
                <option value={5}>Very Safe (5/5)</option>
                <option value={4}>Safe (4/5)</option>
                <option value={3}>Moderate (3/5)</option>
                <option value={2}>Caution (2/5)</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-400">Travel Style</label>
              <select
                value={userPreferences.travelStyle}
                onChange={(e) => handlePreferenceUpdate('travelStyle', e.target.value)}
                className="w-full mt-1 bg-gray-700 text-white text-xs p-1 rounded"
              >
                <option value="cultural">Cultural & Historical</option>
                <option value="adventure">Adventure & Nature</option>
                <option value="business">Business & Urban</option>
                <option value="relaxation">Beach & Relaxation</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-400">Visa Preference</label>
              <select
                value={userPreferences.visaPreference}
                onChange={(e) => handlePreferenceUpdate('visaPreference', e.target.value)}
                className="w-full mt-1 bg-gray-700 text-white text-xs p-1 rounded"
              >
                <option value="visa-free">Visa-free only</option>
                <option value="easy-visa">Easy visa process</option>
                <option value="any">Any visa requirement</option>
              </select>
            </div>
          </div>
        )}

        {/* Recommendations List */}
        <div className="p-3">
          {recommendations.length === 0 ? (
            <div className="text-center text-gray-400 py-4">
              <div className="text-2xl mb-2">🎯</div>
              <p className="text-sm">Start exploring countries to get personalized recommendations!</p>
            </div>
          ) : (
            <div className="space-y-3">
              <h4 className="text-white font-semibold text-sm flex items-center gap-2">
                For You
                <span className="text-xs text-purple-400">({recommendations.length})</span>
              </h4>
              
              {recommendations.map((rec, index) => (
                <div
                  key={rec.country}
                  className="bg-gray-700 rounded-lg p-3 hover:bg-gray-600 smooth-transition cursor-pointer border-l-4 border-purple-500"
                  onClick={() => onCountrySelect(rec.country)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="text-white font-medium text-sm">{rec.country}</h5>
                    <div className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${getScoreColor(rec.score)}`} title={`Score: ${(rec.score * 100).toFixed(0)}%`}></div>
                      <span className={`text-xs ${getConfidenceColor(rec.confidence)}`}>
                        {(rec.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1 mb-2">
                    {rec.reasoning.slice(0, 2).map((reason, i) => (
                      <div key={i} className="text-xs text-gray-300 flex items-start gap-1">
                        <span className="text-purple-400 mt-0.5">•</span>
                        <span>{reason}</span>
                      </div>
                    ))}
                  </div>

                  {/* Rating buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCountryRate(rec.country, rating);
                          }}
                          className="text-xs hover:text-yellow-400 smooth-transition"
                          title={`Rate ${rating}/5`}
                        >
                          ⭐
                        </button>
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">#{index + 1}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-2 bg-gray-900 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              Powered by ML • Updated {new Date().toLocaleTimeString()}
            </span>
            <button
              onClick={() => {
                machineLearningService.resetUserData();
                updateRecommendations();
                setUserPreferences(null);
                setStats(machineLearningService.getInteractionStats());
              }}
              className="text-xs text-red-400 hover:text-red-300 smooth-transition"
              title="Reset all data"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface SmartInsightsProps {
  countryName: string;
  onClose: () => void;
  onCountrySelect?: (countryName: string) => void;
}

export const SmartInsights: React.FC<SmartInsightsProps> = ({ countryName, onClose, onCountrySelect }) => {
  const [insights, setInsights] = useState<string[]>([]);
  const [similarCountries, setSimilarCountries] = useState<string[]>([]);

  useEffect(() => {
    generateInsights();
  }, [countryName]);

  const generateInsights = () => {
    // Use the ML service to generate personalized insights
    const { insights: personalizedInsights, similarCountries: similar } = 
      machineLearningService.generateSmartInsights(countryName);
    
    setInsights(personalizedInsights);
    setSimilarCountries(similar);
  };

  return (
    <div className="bg-purple-900 bg-opacity-90 rounded-lg p-3 mt-2 border border-purple-500">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-purple-200 font-semibold text-sm flex items-center gap-2">
          <span>🧠</span>
          Smart Insights
        </h4>
        <button
          onClick={onClose}
          className="text-purple-300 hover:text-purple-100 text-xs smooth-transition"
        >
          ✕
        </button>
      </div>

      <div className="space-y-2">
        {insights.map((insight, index) => (
          <div key={index} className="text-purple-100 text-xs flex items-start gap-2">
            <span className="text-purple-400 mt-0.5">💡</span>
            <span>{insight}</span>
          </div>
        ))}

        {similarCountries.length > 0 && (
          <div className="mt-3 pt-2 border-t border-purple-700">
            <div className="text-purple-200 text-xs mb-1">Similar destinations:</div>
            <div className="flex gap-1 flex-wrap">
              {similarCountries.map((country) => (
                <span
                  key={country}
                  onClick={() => onCountrySelect?.(country)}
                  className="bg-purple-700 text-purple-100 px-2 py-1 rounded text-xs hover:bg-purple-600 smooth-transition cursor-pointer"
                  title={`Click to explore ${country}`}
                >
                  {country}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
