import React, { useState, useMemo, useRef, useCallback } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { scaleLog } from 'd3-scale';
import { COUNTRY_POPULATIONS, GEO_URL, normalizeCountryName } from '../constants';
import { fetchCountryData, clearRetryAttempts } from '../services/geminiService';
import { machineLearningService } from '../services/machineLearningService';
import type { CountryData } from '../types';
import { Loader } from './Loader';
import { Legend } from './Legend';
import { LivePopulationCounter, NewsTicker, TravelInfoPanel } from './RealTimeComponents';
import { MLRecommendations, SmartInsights } from './MLRecommendations';

type CachedCountryData = CountryData | 'loading' | 'error';

/**
 * Enhanced tooltip component with pin functionality
 */
const CountryTooltip: React.FC<{ 
    activeCountry: string | null; 
    pinnedCountry: string | null;
    cache: Record<string, CachedCountryData>;
    onPin: (country: string | null) => void;
    highlightedCountry: string | null;
    onCountrySelect: (countryName: string) => void;
}> = ({ activeCountry, pinnedCountry, cache, onPin, highlightedCountry, onCountrySelect }) => {
    const formatPopulation = (num: number) => new Intl.NumberFormat('en-US').format(num);

    // Show pinned country if exists, otherwise show active country
    const displayCountry = pinnedCountry || activeCountry || highlightedCountry;
    const isPinned = pinnedCountry !== null;

    if (!displayCountry) {
        return null;
    }

    const cachedItem = cache[displayCountry];

    const renderContent = () => {
        if (!cachedItem || cachedItem === 'loading') {
            return (
                <div className="data-loading rounded p-4 text-center">
                    <Loader />
                </div>
            );
        }

        if (cachedItem === 'error') {
            return (
                <div className="text-red-400 text-center fade-in">
                    Could not load data for<br /><strong>{displayCountry}</strong>.
                </div>
            );
        }

        const data = cachedItem as CountryData;
        const isLive = data.isLiveData !== false;
        
        // Use accurate population from constants
        const normalizedCountryName = normalizeCountryName(displayCountry);
        const accuratePopulation = COUNTRY_POPULATIONS[normalizedCountryName] || COUNTRY_POPULATIONS[displayCountry] || data.population;
        
        return (
            <div className="text-left text-white fade-in max-h-96 overflow-y-auto tooltip-content">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-base text-cyan-300">{data.name}</h3>
                    <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded smooth-transition ${isLive ? 'bg-green-600 text-white' : 'bg-orange-600 text-white'}`}>
                            {isLive ? '🟢 Live' : '📋 Demo'}
                        </span>
                        <button
                            onClick={() => onPin(isPinned ? null : displayCountry)}
                            className={`text-xs px-2 py-1 rounded btn-hover smooth-transition ${
                                isPinned 
                                    ? 'bg-yellow-600 hover:bg-yellow-500 text-white' 
                                    : 'bg-gray-600 hover:bg-gray-500 text-white'
                            }`}
                            title={isPinned ? 'Unpin tooltip' : 'Pin tooltip'}
                        >
                            {isPinned ? '📌 Pinned' : '📍 Pin'}
                        </button>
                    </div>
                </div>

                {/* Real-time data components */}
                {data.realTimeData && (
                    <div className="mb-3 space-y-2">
                        <LivePopulationCounter
                            basePopulation={accuratePopulation}
                            growthRate={data.realTimeData.populationGrowthRate}
                            countryName={data.name}
                        />
                        {data.realTimeData.news && data.realTimeData.news.length > 0 && (
                            <NewsTicker news={data.realTimeData.news} />
                        )}
                        {data.realTimeData.travelInfo && (
                            <TravelInfoPanel 
                                travelInfo={data.realTimeData.travelInfo}
                                countryName={data.name}
                            />
                        )}
                    </div>
                )}

                {/* Basic country information */}
                <div className="space-y-1">
                    <p><strong>Capital:</strong> {data.capital}</p>
                    {!data.realTimeData && (
                        <p><strong>Population:</strong> {formatPopulation(accuratePopulation)}</p>
                    )}
                </div>

                <div className="mt-3 pt-2 border-t border-gray-600">
                    <p className="font-semibold mb-1">Key Facts:</p>
                    <ul className="list-disc list-inside text-gray-300 text-sm">
                        {data.facts.map((fact, i) => <li key={i}>{fact}</li>)}
                    </ul>
                </div>

                {/* Smart Insights */}
                <SmartInsights 
                    countryName={data.name} 
                    onClose={() => {}} 
                    onCountrySelect={onCountrySelect}
                />
            </div>
        );
    };

    return (
        <div className={`absolute top-4 right-4 bg-gray-800 border rounded-lg p-4 max-w-md z-50 shadow-xl smooth-transition tooltip-animated ${
            isPinned 
                ? 'border-yellow-500 pointer-events-auto' 
                : 'border-gray-600 pointer-events-none'
        }`}>
            {renderContent()}
        </div>
    );
};


/**
 * Search bar component for finding countries
 */
const SearchBar: React.FC<{
    onSearch: (countryName: string) => void;
    onClear: () => void;
    highlightedCountry: string | null;
}> = ({ onSearch, onClear, highlightedCountry }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);

    // Get all country names for suggestions
    const allCountries = useMemo(() => {
        return Object.keys(COUNTRY_POPULATIONS).sort();
    }, []);

    const handleInputChange = (value: string) => {
        setSearchTerm(value);
        
        if (value.length > 0) {
            const filtered = allCountries.filter(country =>
                country.toLowerCase().includes(value.toLowerCase())
            ).slice(0, 5); // Show max 5 suggestions
            setSuggestions(filtered);
        } else {
            setSuggestions([]);
        }
    };

    const handleSearch = (country: string) => {
        setSearchTerm(country);
        setSuggestions([]);
        onSearch(country);
    };

    const handleClear = () => {
        setSearchTerm('');
        setSuggestions([]);
        onClear();
    };

    return (
        <div className="absolute top-4 left-4 z-50 fade-in">
            <div className="relative">
                <div className="flex items-center bg-gray-800 border border-gray-600 rounded-lg overflow-hidden smooth-transition hover:border-blue-500">
                    <input
                        type="text"
                        placeholder="Search countries..."
                        value={searchTerm}
                        onChange={(e) => handleInputChange(e.target.value)}
                        className="px-3 py-2 bg-transparent text-white placeholder-gray-400 outline-none w-48 search-focus smooth-transition"
                    />
                    {searchTerm && (
                        <button
                            onClick={handleClear}
                            className="px-2 py-2 text-gray-400 hover:text-white smooth-transition btn-hover"
                            title="Clear search"
                        >
                            ✕
                        </button>
                    )}
                    <button
                        onClick={() => searchTerm && handleSearch(searchTerm)}
                        className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white smooth-transition btn-hover"
                        title="Search"
                    >
                        🔍
                    </button>
                </div>
                
                {/* Search suggestions with animations */}
                {suggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-xl max-h-40 overflow-y-auto fade-in">
                        {suggestions.map((country, index) => (
                            <button
                                key={country}
                                onClick={() => handleSearch(country)}
                                className="w-full px-3 py-2 text-left text-white hover:bg-gray-700 smooth-transition border-b border-gray-700 last:border-b-0 btn-hover"
                                style={{ animationDelay: `${index * 0.05}s` }}
                            >
                                {country}
                            </button>
                        ))}
                    </div>
                )}
            </div>
            
            {highlightedCountry && (
                <div className="mt-2 px-3 py-1 bg-yellow-600 text-white text-sm rounded-lg fade-in smooth-transition">
                    Highlighting: {highlightedCountry}
                </div>
            )}
        </div>
    );
};

/**
 * Zoom controls component
 */
const ZoomControls: React.FC<{
    zoom: number;
    onZoomIn: () => void;
    onZoomOut: () => void;
    onReset: () => void;
}> = ({ zoom, onZoomIn, onZoomOut, onReset }) => {
    return (
        <div className="absolute bottom-4 right-4 z-50 flex flex-col gap-2 fade-in">
            <button
                onClick={onZoomIn}
                disabled={zoom >= 8}
                className="w-10 h-10 bg-gray-800 border border-gray-600 rounded-lg text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed smooth-transition btn-hover flex items-center justify-center font-bold text-lg"
                title="Zoom in"
            >
                +
            </button>
            <button
                onClick={onZoomOut}
                disabled={zoom <= 1}
                className="w-10 h-10 bg-gray-800 border border-gray-600 rounded-lg text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed smooth-transition btn-hover flex items-center justify-center font-bold text-lg"
                title="Zoom out"
            >
                −
            </button>
            <button
                onClick={onReset}
                className="w-10 h-10 bg-gray-800 border border-gray-600 rounded-lg text-white hover:bg-gray-700 smooth-transition btn-hover flex items-center justify-center text-xs zoom-bounce"
                title="Reset zoom"
            >
                ⌂
            </button>
            <div className="text-white text-xs text-center bg-gray-800 border border-gray-600 rounded px-2 py-1 smooth-transition">
                {zoom.toFixed(1)}x
            </div>
        </div>
    );
};

const populationValues = Object.values(COUNTRY_POPULATIONS);
const minPopulation = Math.min(...populationValues);
const maxPopulation = Math.max(...populationValues);

// Enhanced map component with zoom and highlighting
const MemoizedMap = React.memo(({ 
  colorScale, 
  onMouseEnter, 
  onMouseLeave,
  onClick,
  highlightedCountry,
  pinnedCountry,
  zoom,
  center
}: { 
  colorScale: any;
  onMouseEnter: (countryName: string) => void;
  onMouseLeave: () => void;
  onClick: (countryName: string) => void;
  highlightedCountry: string | null;
  pinnedCountry: string | null;
  zoom: number;
  center: [number, number];
}) => {
  console.log('🗺️ MemoizedMap rendering with zoom:', zoom);
  
  return (
    <ComposableMap
      width={800}
      height={600}
      style={{ 
        width: "100%", 
        height: "auto",
        cursor: 'pointer',
        pointerEvents: 'auto',
        transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <ZoomableGroup 
        zoom={zoom} 
        center={center}
        transitionDuration={500}
        style={{
          transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <Geographies geography={GEO_URL}>
        {({ geographies }: any) => {
          console.log('🗺️ Geographies loaded:', geographies?.length || 0, 'countries');
          
          if (!geographies || geographies.length === 0) {
            console.error('❌ No geography data loaded!');
            return <text x="200" y="200" fill="white" fontSize="20">NO GEOGRAPHY DATA LOADED</text>;
          }

          // Count successful mappings
          let mappedCount = 0;
          let unmappedCountries: string[] = [];

          const result = geographies.map((geo: any, index: number) => {
            const rawCountryName = geo.properties?.NAME || geo.properties?.name || `Country_${index}`;
            const countryName = normalizeCountryName(rawCountryName);
            const population = COUNTRY_POPULATIONS[countryName];
            
            if (population) {
              mappedCount++;
            } else {
              unmappedCountries.push(rawCountryName);
            }

            // Determine fill color based on state
            let fillColor = population ? colorScale(population) : '#444444';
            let additionalClasses = '';
            
            // High-population countries get pulse animation (>100M people)
            const isHighPopulation = population && population > 100000000;
            
            if (highlightedCountry && countryName === highlightedCountry) {
              fillColor = '#ffd700'; // Gold for highlighted country
              additionalClasses = 'country-highlighted';
            } else if (pinnedCountry && countryName === pinnedCountry) {
              fillColor = '#ff6b35'; // Orange for pinned country
              additionalClasses = 'country-pinned';
            } else if (isHighPopulation) {
              additionalClasses = 'country-high-population';
            }

            // Enhanced hover color
            const getHoverColor = () => {
              if (highlightedCountry === countryName) return '#ffed4e';
              if (pinnedCountry === countryName) return '#ff8c5a';
              return '#00ffff';
            };
            
            return (
              <Geography
                key={geo.rsmKey || index}
                geography={geo}
                className={additionalClasses}
                onMouseEnter={() => {
                  onMouseEnter(countryName);
                }}
                onMouseLeave={() => {
                  onMouseLeave();
                }}
                onClick={() => {
                  console.log('🖱️ Clicked country:', countryName);
                  onClick(countryName);
                }}
                style={{
                  default: {
                    fill: fillColor,
                    stroke: '#000000',
                    strokeWidth: 0.5,
                    outline: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    filter: isHighPopulation ? 'drop-shadow(0 0 3px currentColor)' : 'none',
                  },
                  hover: {
                    fill: getHoverColor(),
                    stroke: '#ffffff',
                    strokeWidth: 1.5,
                    cursor: 'pointer',
                    filter: 'drop-shadow(0 0 8px currentColor)',
                    transition: 'all 0.2s ease',
                  },
                  pressed: {
                    fill: '#ff00ff',
                    transform: 'scale(0.95)',
                    transition: 'all 0.1s ease',
                  },
                }}
              />
            );
          });

          console.log(`📊 Mapping success: ${mappedCount}/${geographies.length} countries mapped`);
          if (unmappedCountries.length > 0) {
            console.log('❌ Unmapped countries:', unmappedCountries.sort());
          }

          return result;
        }}
      </Geographies>
      </ZoomableGroup>
    </ComposableMap>
  );
});
MemoizedMap.displayName = 'MemoizedMap';

// Enhanced WorldMap component with zoom, search, pin functionality, and ML recommendations
const WorldMapComponent = () => {
  const [cache, setCache] = useState<Record<string, CachedCountryData>>({});
  const [activeCountry, setActiveCountry] = useState<string | null>(null);
  const [pinnedCountry, setPinnedCountry] = useState<string | null>(null);
  const [highlightedCountry, setHighlightedCountry] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState<[number, number]>([0, 0]);
  const [showMLRecommendations, setShowMLRecommendations] = useState(false);
  const [hoverStartTime, setHoverStartTime] = useState<number | null>(null);
  const currentHoverTarget = useRef<string | null>(null);

  const colorScale = useMemo(() => scaleLog<string>()
    .domain([minPopulation, maxPopulation])
    .range(['#e0f2fe', '#0891b2', '#164e63']), []); // Better contrast: light cyan to dark cyan

  // Function to clear cache and retry API calls
  const clearCacheAndRetry = () => {
    console.log('🔄 Clearing cache and retry attempts...');
    setCache({});
    clearRetryAttempts();
  };

  // Search functionality
  const handleSearch = useCallback((countryName: string) => {
    console.log('🔍 Searching for:', countryName);
    
    // Track ML interaction
    machineLearningService.trackInteraction({
      countryName,
      action: 'search',
      timestamp: Date.now(),
    });
    
    setHighlightedCountry(countryName);
    
    // Find country center (simplified - you could add more precise coordinates)
    const countryCoordinates: Record<string, [number, number]> = {
      'United States': [-95, 37],
      'Canada': [-106, 56],
      'Mexico': [-102, 23],
      'Brazil': [-55, -10],
      'Argentina': [-64, -34],
      'United Kingdom': [-3, 54],
      'France': [2, 46],
      'Germany': [10, 51],
      'Spain': [-4, 40],
      'Italy': [13, 42],
      'Russia': [105, 64],
      'China': [104, 35],
      'India': [78, 20],
      'Japan': [138, 36],
      'Australia': [133, -27],
      'South Africa': [22, -31],
      'Egypt': [30, 26],
      'Morocco': [-7, 32],
      'Libya': [17, 25],
      'Saudi Arabia': [45, 24],
      'South Korea': [128, 36],
      'Thailand': [101, 16],
      'Vietnam': [109, 14],
      'Malaysia': [102, 4],
      'Singapore': [104, 1],
      'Philippines': [122, 13],
      'Turkey': [35, 39],
      // Add more coordinates as needed
    };

    const coords = countryCoordinates[countryName];
    if (coords) {
      setCenter(coords);
      setZoom(3);
    }

    // Ensure country data is loaded
    if (!cache[countryName]) {
      handleMouseEnter(countryName);
    }
  }, [cache]);

  const handleClearSearch = useCallback(() => {
    setHighlightedCountry(null);
    setZoom(1);
    setCenter([0, 0]);
  }, []);

  // Pin functionality with ML tracking
  const handlePin = useCallback((country: string | null) => {
    if (country) {
      machineLearningService.trackInteraction({
        countryName: country,
        action: 'pin',
        timestamp: Date.now(),
      });
    }
    
    setPinnedCountry(country);
    if (country && !cache[country]) {
      handleMouseEnter(country);
    }
  }, [cache]);

  // Zoom functionality with smooth animations
  const handleZoomIn = useCallback(() => {
    setZoom(prev => {
      const newZoom = Math.min(prev * 1.5, 8);
      // Add bounce effect
      setTimeout(() => {
        const mapElement = document.querySelector('.map-container svg');
        if (mapElement) {
          mapElement.classList.add('zoom-bounce');
          setTimeout(() => mapElement.classList.remove('zoom-bounce'), 600);
        }
      }, 0);
      return newZoom;
    });
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => {
      const newZoom = Math.max(prev / 1.5, 1);
      // Add bounce effect
      setTimeout(() => {
        const mapElement = document.querySelector('.map-container svg');
        if (mapElement) {
          mapElement.classList.add('zoom-bounce');
          setTimeout(() => mapElement.classList.remove('zoom-bounce'), 600);
        }
      }, 0);
      return newZoom;
    });
  }, []);

  const handleZoomReset = useCallback(() => {
    setZoom(1);
    setCenter([0, 0]);
    setHighlightedCountry(null);
    // Add bounce effect
    setTimeout(() => {
      const mapElement = document.querySelector('.map-container svg');
      if (mapElement) {
        mapElement.classList.add('zoom-bounce');
        setTimeout(() => mapElement.classList.remove('zoom-bounce'), 600);
      }
    }, 0);
  }, []);

  // Click functionality
  const handleCountryClick = useCallback((countryName: string) => {
    console.log('🖱️ Clicked country:', countryName);
    
    // Toggle pin state
    if (pinnedCountry === countryName) {
      setPinnedCountry(null);
    } else {
      setPinnedCountry(countryName);
      if (!cache[countryName]) {
        handleMouseEnter(countryName);
      }
    }
  }, [pinnedCountry, cache]);

  const handleMouseEnter = useCallback((countryName: string) => {
    currentHoverTarget.current = countryName;
    setHoverStartTime(Date.now());
    
    // Track ML interaction
    machineLearningService.trackInteraction({
      countryName,
      action: 'hover',
      timestamp: Date.now(),
    });
    
    // Don't change active country if tooltip is pinned to another country
    if (!pinnedCountry) {
      setActiveCountry(countryName);
    }

    if (!cache[countryName]) {
      console.log('📡 Fetching data for:', countryName);
      setCache(prev => ({ ...prev, [countryName]: 'loading' }));
      fetchCountryData(countryName)
        .then(data => {
          console.log('✅ Data received for', countryName);
          // Only update state if the user is still hovering over the same country
          if (currentHoverTarget.current === countryName) {
            setCache(prev => ({ ...prev, [countryName]: data }));
          }
        })
        .catch(error => {
          console.error('❌ Failed to fetch data for', countryName, ':', error.message || error);
          if (currentHoverTarget.current === countryName) {
            setCache(prev => ({ ...prev, [countryName]: 'error' }));
          }
        });
    }
  }, [pinnedCountry, cache]);

  const handleMouseLeave = useCallback(() => {
    // Track hover duration for ML
    if (currentHoverTarget.current && hoverStartTime) {
      const duration = Date.now() - hoverStartTime;
      machineLearningService.trackInteraction({
        countryName: currentHoverTarget.current,
        action: 'hover',
        timestamp: Date.now(),
        duration,
      });
    }

    currentHoverTarget.current = null;
    setHoverStartTime(null);
    
    // Don't clear active country if tooltip is pinned
    if (!pinnedCountry) {
      setActiveCountry(null);
    }
  }, [pinnedCountry]);

  // Handle ML country selection
  const handleMLCountrySelect = useCallback((countryName: string) => {
    machineLearningService.trackInteraction({
      countryName,
      action: 'click',
      timestamp: Date.now(),
    });
    handleSearch(countryName);
  }, [handleSearch]);

  return (
    <div className="relative w-full h-full map-container fade-in">
      <SearchBar 
        onSearch={handleSearch}
        onClear={handleClearSearch}
        highlightedCountry={highlightedCountry}
      />
      
      <MLRecommendations
        onCountrySelect={handleMLCountrySelect}
        currentCountry={activeCountry || pinnedCountry || undefined}
        isVisible={showMLRecommendations}
        onToggle={() => setShowMLRecommendations(!showMLRecommendations)}
      />
      
      <MemoizedMap 
        colorScale={colorScale} 
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleCountryClick}
        highlightedCountry={highlightedCountry}
        pinnedCountry={pinnedCountry}
        zoom={zoom}
        center={center}
      />
      
      <CountryTooltip 
        activeCountry={activeCountry}
        pinnedCountry={pinnedCountry}
        cache={cache}
        onPin={handlePin}
        highlightedCountry={highlightedCountry}
        onCountrySelect={handleCountryClick}
      />
      
      <ZoomControls
        zoom={zoom}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onReset={handleZoomReset}
      />
      
      <Legend colorScale={colorScale} />
      
      {/* Enhanced debug button with animations */}
      <button
        onClick={clearCacheAndRetry}
        className="absolute bottom-4 left-4 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg smooth-transition btn-hover z-50 fade-in"
        title="Clear cache and retry API calls"
      >
        🔄 Refresh Data
      </button>
    </div>
  );
};

export const WorldMap = WorldMapComponent;