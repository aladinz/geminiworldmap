import { COUNTRY_POPULATIONS } from '../constants';

// User interaction types for ML analysis
export interface UserInteraction {
  countryName: string;
  action: 'hover' | 'click' | 'pin' | 'search' | 'rate';
  timestamp: number;
  duration?: number; // milliseconds spent viewing
  rating?: number; // 1-5 scale for explicit feedback
  dataTypeViewed?: 'population' | 'news' | 'travel' | 'facts';
}

export interface UserPreferences {
  favoriteRegions: string[];
  preferredSafetyRating: number;
  budgetRange: 'low' | 'medium' | 'high';
  travelStyle: 'adventure' | 'cultural' | 'business' | 'relaxation';
  populationPreference: 'small' | 'medium' | 'large';
  visaPreference: 'visa-free' | 'easy-visa' | 'any';
  lastUpdated: number;
}

export interface CountryFeatures {
  name: string;
  population: number;
  populationCategory: 'small' | 'medium' | 'large';
  region: string;
  safetyRating: number;
  costCategory: 'low' | 'medium' | 'high';
  visaRequired: boolean;
  growthRate: number;
  coordinates: [number, number]; // [lat, lng]
}

export interface Recommendation {
  country: string;
  score: number;
  reasoning: string[];
  similarity: number;
  confidence: number;
}

class MachineLearningService {
  private static instance: MachineLearningService;
  private userInteractions: UserInteraction[] = [];
  private userPreferences: UserPreferences | null = null;
  private countryFeatures: Map<string, CountryFeatures> = new Map();
  
  static getInstance(): MachineLearningService {
    if (!MachineLearningService.instance) {
      MachineLearningService.instance = new MachineLearningService();
      MachineLearningService.instance.initializeCountryFeatures();
      MachineLearningService.instance.loadUserData();
    }
    return MachineLearningService.instance;
  }

  // Initialize country features for ML analysis
  private initializeCountryFeatures() {
    const countryRegions: Record<string, string> = {
      'China': 'East Asia',
      'India': 'South Asia',
      'United States': 'North America',
      'Indonesia': 'Southeast Asia',
      'Pakistan': 'South Asia',
      'Brazil': 'South America',
      'Nigeria': 'West Africa',
      'Bangladesh': 'South Asia',
      'Russia': 'Europe/Asia',
      'Mexico': 'North America',
      'Japan': 'East Asia',
      'Egypt': 'North Africa',
      'Saudi Arabia': 'Middle East',
      'South Korea': 'East Asia',
      'Thailand': 'Southeast Asia',
      'Vietnam': 'Southeast Asia',
      'Malaysia': 'Southeast Asia',
      'Singapore': 'Southeast Asia',
      'Philippines': 'Southeast Asia',
      'Turkey': 'Europe/Middle East',
    };

    const countryCoordinates: Record<string, [number, number]> = {
      'China': [35.8617, 104.1954],
      'India': [20.5937, 78.9629],
      'United States': [37.0902, -95.7129],
      'Indonesia': [-0.7893, 113.9213],
      'Pakistan': [30.3753, 69.3451],
      'Brazil': [-14.2350, -51.9253],
      'Nigeria': [9.0820, 8.6753],
      'Bangladesh': [23.6850, 90.3563],
      'Russia': [61.5240, 105.3188],
      'Mexico': [23.6345, -102.5528],
      'Japan': [36.2048, 138.2529],
      'Egypt': [26.0975, 30.0444],
      'Saudi Arabia': [23.8859, 45.0792],
      'South Korea': [35.9078, 127.7669],
      'Thailand': [15.8700, 100.9925],
      'Vietnam': [14.0583, 108.2772],
      'Malaysia': [4.2105, 101.9758],
      'Singapore': [1.3521, 103.8198],
      'Philippines': [12.8797, 121.7740],
      'Turkey': [38.9637, 35.2433],
    };

    Object.entries(COUNTRY_POPULATIONS).forEach(([country, population]) => {
      if (countryRegions[country]) {
        const features: CountryFeatures = {
          name: country,
          population,
          populationCategory: this.categorizePopulation(population),
          region: countryRegions[country],
          safetyRating: this.estimateSafetyRating(country),
          costCategory: this.estimateCostCategory(country),
          visaRequired: this.estimateVisaRequirement(country),
          growthRate: this.getGrowthRate(country),
          coordinates: countryCoordinates[country] || [0, 0],
        };
        this.countryFeatures.set(country, features);
      }
    });
  }

  // ML helper functions
  private categorizePopulation(population: number): 'small' | 'medium' | 'large' {
    if (population < 50000000) return 'small';
    if (population < 200000000) return 'medium';
    return 'large';
  }

  private estimateSafetyRating(country: string): number {
    const safetyRatings: Record<string, number> = {
      'Singapore': 5, 'Japan': 5, 'South Korea': 5,
      'United States': 4, 'Malaysia': 4, 'Thailand': 4, 'Vietnam': 4,
      'China': 4, 'Saudi Arabia': 4, 'Indonesia': 3, 'Brazil': 3,
      'India': 3, 'Egypt': 3, 'Turkey': 3, 'Philippines': 3,
      'Pakistan': 2, 'Nigeria': 2, 'Bangladesh': 3, 'Russia': 3, 'Mexico': 3,
    };
    return safetyRatings[country] || 3;
  }

  private estimateCostCategory(country: string): 'low' | 'medium' | 'high' {
    const costCategories: Record<string, 'low' | 'medium' | 'high'> = {
      'Singapore': 'high', 'United States': 'high', 'Japan': 'high',
      'South Korea': 'medium', 'Saudi Arabia': 'medium', 'Malaysia': 'medium',
      'China': 'medium', 'Brazil': 'medium', 'Russia': 'medium', 'Turkey': 'medium',
      'Thailand': 'low', 'Vietnam': 'low', 'Philippines': 'low', 'Indonesia': 'low',
      'India': 'low', 'Pakistan': 'low', 'Bangladesh': 'low', 'Egypt': 'low',
      'Nigeria': 'low', 'Mexico': 'low',
    };
    return costCategories[country] || 'medium';
  }

  private estimateVisaRequirement(country: string): boolean {
    const visaFreeCountries = ['Thailand', 'Malaysia', 'Singapore', 'Philippines', 'South Korea', 'Japan'];
    return !visaFreeCountries.includes(country);
  }

  private getGrowthRate(country: string): number {
    const growthRates: Record<string, number> = {
      'Nigeria': 2.4, 'Pakistan': 1.9, 'Egypt': 1.8, 'Philippines': 1.5, 'Saudi Arabia': 1.2,
      'Malaysia': 1.1, 'Bangladesh': 1.0, 'Vietnam': 0.9, 'Indonesia': 0.9, 'India': 0.8,
      'Singapore': 0.7, 'Brazil': 0.6, 'Turkey': 0.6, 'United States': 0.4, 'Thailand': 0.3,
      'China': 0.2, 'South Korea': 0.1, 'Russia': 0.1, 'Japan': -0.3, 'Mexico': 0.9,
    };
    return growthRates[country] || 0.5;
  }

  // Track user interactions for ML analysis
  trackInteraction(interaction: UserInteraction) {
    this.userInteractions.push({
      ...interaction,
      timestamp: Date.now(),
    });

    // Keep only last 1000 interactions to prevent memory issues
    if (this.userInteractions.length > 1000) {
      this.userInteractions = this.userInteractions.slice(-1000);
    }

    this.saveUserData();
    this.updateUserPreferences();
  }

  // Analyze user behavior to update preferences
  private updateUserPreferences() {
    if (this.userInteractions.length < 5) return; // Need minimum data

    const recentInteractions = this.userInteractions.slice(-50); // Last 50 interactions
    const countryFrequency: Record<string, number> = {};
    const regionFrequency: Record<string, number> = {};
    let totalRatings = 0;
    let ratingSum = 0;

    recentInteractions.forEach(interaction => {
      countryFrequency[interaction.countryName] = (countryFrequency[interaction.countryName] || 0) + 1;
      
      const features = this.countryFeatures.get(interaction.countryName);
      if (features) {
        regionFrequency[features.region] = (regionFrequency[features.region] || 0) + 1;
      }

      if (interaction.rating) {
        ratingSum += interaction.rating;
        totalRatings++;
      }
    });

    const favoriteRegions = Object.entries(regionFrequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([region]) => region);

    this.userPreferences = {
      favoriteRegions,
      preferredSafetyRating: totalRatings > 0 ? Math.round(ratingSum / totalRatings) : 3,
      budgetRange: this.inferBudgetPreference(recentInteractions),
      travelStyle: this.inferTravelStyle(recentInteractions),
      populationPreference: this.inferPopulationPreference(recentInteractions),
      visaPreference: this.inferVisaPreference(recentInteractions),
      lastUpdated: Date.now(),
    };

    this.saveUserData();
  }

  private inferBudgetPreference(interactions: UserInteraction[]): 'low' | 'medium' | 'high' {
    const costCounts = { low: 0, medium: 0, high: 0 };
    
    interactions.forEach(interaction => {
      const features = this.countryFeatures.get(interaction.countryName);
      if (features) {
        costCounts[features.costCategory]++;
      }
    });

    return Object.entries(costCounts).reduce((a, b) => costCounts[a[0] as keyof typeof costCounts] > costCounts[b[0] as keyof typeof costCounts] ? a : b)[0] as 'low' | 'medium' | 'high';
  }

  private inferTravelStyle(interactions: UserInteraction[]): 'adventure' | 'cultural' | 'business' | 'relaxation' {
    // Simple heuristic based on country characteristics
    const adventureCountries = ['Nepal', 'New Zealand', 'Norway', 'Chile'];
    const culturalCountries = ['Italy', 'Greece', 'Egypt', 'India', 'Japan', 'Turkey'];
    const businessCountries = ['Singapore', 'United States', 'Germany', 'South Korea'];
    const relaxationCountries = ['Thailand', 'Malaysia', 'Philippines', 'Brazil'];

    let scores = { adventure: 0, cultural: 0, business: 0, relaxation: 0 };

    interactions.forEach(interaction => {
      if (adventureCountries.includes(interaction.countryName)) scores.adventure++;
      if (culturalCountries.includes(interaction.countryName)) scores.cultural++;
      if (businessCountries.includes(interaction.countryName)) scores.business++;
      if (relaxationCountries.includes(interaction.countryName)) scores.relaxation++;
    });

    return Object.entries(scores).reduce((a, b) => a[1] > b[1] ? a : b)[0] as 'adventure' | 'cultural' | 'business' | 'relaxation';
  }

  private inferPopulationPreference(interactions: UserInteraction[]): 'small' | 'medium' | 'large' {
    const popCounts = { small: 0, medium: 0, large: 0 };
    
    interactions.forEach(interaction => {
      const features = this.countryFeatures.get(interaction.countryName);
      if (features) {
        popCounts[features.populationCategory]++;
      }
    });

    return Object.entries(popCounts).reduce((a, b) => popCounts[a[0] as keyof typeof popCounts] > popCounts[b[0] as keyof typeof popCounts] ? a : b)[0] as 'small' | 'medium' | 'large';
  }

  private inferVisaPreference(interactions: UserInteraction[]): 'visa-free' | 'easy-visa' | 'any' {
    let visaFreeCount = 0;
    let visaRequiredCount = 0;

    interactions.forEach(interaction => {
      const features = this.countryFeatures.get(interaction.countryName);
      if (features) {
        if (features.visaRequired) {
          visaRequiredCount++;
        } else {
          visaFreeCount++;
        }
      }
    });

    if (visaFreeCount > visaRequiredCount * 2) return 'visa-free';
    if (visaFreeCount > visaRequiredCount) return 'easy-visa';
    return 'any';
  }

  // Generate personalized recommendations using ML algorithms
  generateRecommendations(excludeCountries: string[] = [], limit: number = 5): Recommendation[] {
    if (!this.userPreferences || this.userInteractions.length < 3) {
      return this.getPopularCountries(excludeCountries, limit);
    }

    const candidates = Array.from(this.countryFeatures.values())
      .filter(country => !excludeCountries.includes(country.name));

    const scoredRecommendations = candidates.map(country => {
      const score = this.calculateRecommendationScore(country);
      const similarity = this.calculateSimilarityToPreferences(country);
      const reasoning = this.generateReasoning(country);
      
      return {
        country: country.name,
        score,
        reasoning,
        similarity,
        confidence: this.calculateConfidence(country),
      };
    });

    // Sort by score and apply diversity factor
    const recommendations = scoredRecommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, limit * 2); // Get more candidates for diversity

    // Apply diversity to avoid recommending only similar countries
    const diverseRecommendations = this.applyDiversityFilter(recommendations, limit);

    return diverseRecommendations.slice(0, limit);
  }

  private calculateRecommendationScore(country: CountryFeatures): number {
    if (!this.userPreferences) return 0.5;

    let score = 0;
    const prefs = this.userPreferences;

    // Region preference (30% weight)
    if (prefs.favoriteRegions.includes(country.region)) {
      score += 0.3 * (prefs.favoriteRegions.indexOf(country.region) === 0 ? 1 : 0.7);
    }

    // Safety rating preference (25% weight)
    const safetyScore = 1 - Math.abs(country.safetyRating - prefs.preferredSafetyRating) / 5;
    score += 0.25 * safetyScore;

    // Budget preference (20% weight)
    const budgetMatch = this.matchesBudgetPreference(country, prefs.budgetRange);
    score += 0.2 * budgetMatch;

    // Population preference (15% weight)
    const popMatch = country.populationCategory === prefs.populationPreference ? 1 : 0.5;
    score += 0.15 * popMatch;

    // Visa preference (10% weight)
    const visaMatch = this.matchesVisaPreference(country, prefs.visaPreference);
    score += 0.1 * visaMatch;

    // Interaction history bonus/penalty
    const interactionScore = this.getInteractionScore(country.name);
    score += interactionScore * 0.1;

    return Math.min(score, 1); // Cap at 1
  }

  private matchesBudgetPreference(country: CountryFeatures, budgetPref: string): number {
    if (country.costCategory === budgetPref) return 1;
    if ((budgetPref === 'low' && country.costCategory === 'medium') ||
        (budgetPref === 'high' && country.costCategory === 'medium')) return 0.7;
    return 0.3;
  }

  private matchesVisaPreference(country: CountryFeatures, visaPref: string): number {
    if (visaPref === 'any') return 1;
    if (visaPref === 'visa-free' && !country.visaRequired) return 1;
    if (visaPref === 'easy-visa' && !country.visaRequired) return 1;
    if (visaPref === 'easy-visa' && country.visaRequired) return 0.7;
    return 0.3;
  }

  private getInteractionScore(countryName: string): number {
    const interactions = this.userInteractions.filter(i => i.countryName === countryName);
    if (interactions.length === 0) return 0;

    let score = 0;
    interactions.forEach(interaction => {
      switch (interaction.action) {
        case 'hover': score += 0.1; break;
        case 'click': score += 0.3; break;
        case 'pin': score += 0.5; break;
        case 'search': score += 0.4; break;
        case 'rate': score += (interaction.rating || 3) * 0.2; break;
      }
    });

    return Math.min(score / 10, 1); // Normalize
  }

  private calculateSimilarityToPreferences(country: CountryFeatures): number {
    // Calculate based on similar countries user has interacted with
    const interactedCountries = [...new Set(this.userInteractions.map(i => i.countryName))];
    
    if (interactedCountries.length === 0) return 0.5;

    let totalSimilarity = 0;
    let count = 0;

    interactedCountries.forEach(intCountry => {
      const intFeatures = this.countryFeatures.get(intCountry);
      if (intFeatures) {
        const similarity = this.calculateCountrySimilarity(country, intFeatures);
        totalSimilarity += similarity;
        count++;
      }
    });

    return count > 0 ? totalSimilarity / count : 0.5;
  }

  private calculateCountrySimilarity(country1: CountryFeatures, country2: CountryFeatures): number {
    let similarity = 0;

    // Region similarity (40%)
    if (country1.region === country2.region) similarity += 0.4;

    // Population category similarity (20%)
    if (country1.populationCategory === country2.populationCategory) similarity += 0.2;

    // Safety rating similarity (20%)
    const safetyDiff = Math.abs(country1.safetyRating - country2.safetyRating);
    similarity += 0.2 * (1 - safetyDiff / 5);

    // Cost category similarity (10%)
    if (country1.costCategory === country2.costCategory) similarity += 0.1;

    // Visa requirement similarity (10%)
    if (country1.visaRequired === country2.visaRequired) similarity += 0.1;

    return similarity;
  }

  private generateReasoning(country: CountryFeatures): string[] {
    const reasons: string[] = [];
    
    if (!this.userPreferences) {
      reasons.push("Popular destination based on global trends");
      return reasons;
    }

    const prefs = this.userPreferences;

    if (prefs.favoriteRegions.includes(country.region)) {
      reasons.push(`Located in your preferred region: ${country.region}`);
    }

    if (Math.abs(country.safetyRating - prefs.preferredSafetyRating) <= 1) {
      reasons.push(`Matches your safety preferences (${country.safetyRating}/5 rating)`);
    }

    if (this.matchesBudgetPreference(country, prefs.budgetRange) >= 0.7) {
      reasons.push(`Fits your ${prefs.budgetRange} budget range`);
    }

    if (country.populationCategory === prefs.populationPreference) {
      reasons.push(`${country.populationCategory} population size matches your preference`);
    }

    if (!country.visaRequired && prefs.visaPreference !== 'any') {
      reasons.push("Visa-free travel available");
    }

    const interactionScore = this.getInteractionScore(country.name);
    if (interactionScore > 0.3) {
      reasons.push("Based on your previous interest in this country");
    }

    if (reasons.length === 0) {
      reasons.push("Recommended based on similar user preferences");
    }

    return reasons;
  }

  private calculateConfidence(country: CountryFeatures): number {
    if (!this.userPreferences) return 0.3;

    const dataPoints = this.userInteractions.length;
    const baseConfidence = Math.min(dataPoints / 50, 1); // More interactions = higher confidence

    const prefMatch = this.calculateRecommendationScore(country);
    return (baseConfidence + prefMatch) / 2;
  }

  private applyDiversityFilter(recommendations: Recommendation[], limit: number): Recommendation[] {
    const diverse: Recommendation[] = [];
    const usedRegions: Set<string> = new Set();

    // First pass: pick best from each region
    recommendations.forEach(rec => {
      const country = this.countryFeatures.get(rec.country);
      if (country && !usedRegions.has(country.region) && diverse.length < limit) {
        diverse.push(rec);
        usedRegions.add(country.region);
      }
    });

    // Second pass: fill remaining slots with highest scores
    recommendations.forEach(rec => {
      if (diverse.length < limit && !diverse.find(d => d.country === rec.country)) {
        diverse.push(rec);
      }
    });

    return diverse;
  }

  private getPopularCountries(excludeCountries: string[], limit: number): Recommendation[] {
    const popularCountries = ['Japan', 'South Korea', 'Singapore', 'Thailand', 'Malaysia'];
    
    return popularCountries
      .filter(country => !excludeCountries.includes(country))
      .slice(0, limit)
      .map(country => ({
        country,
        score: 0.7,
        reasoning: ['Popular global destination', 'Great for first-time visitors'],
        similarity: 0.5,
        confidence: 0.3,
      }));
  }

  // Data persistence
  private saveUserData() {
    try {
      const data = {
        interactions: this.userInteractions.slice(-100), // Save last 100 interactions
        preferences: this.userPreferences,
        timestamp: Date.now(),
      };
      localStorage.setItem('gemini-ml-data', JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save user data:', error);
    }
  }

  private loadUserData() {
    try {
      const data = localStorage.getItem('gemini-ml-data');
      if (data) {
        const parsed = JSON.parse(data);
        this.userInteractions = parsed.interactions || [];
        this.userPreferences = parsed.preferences || null;
      }
    } catch (error) {
      console.warn('Failed to load user data:', error);
    }
  }

  // Public methods for external use
  getUserPreferences(): UserPreferences | null {
    return this.userPreferences;
  }

  updateUserPreference(key: keyof UserPreferences, value: any) {
    if (!this.userPreferences) {
      this.userPreferences = {
        favoriteRegions: [],
        preferredSafetyRating: 3,
        budgetRange: 'medium',
        travelStyle: 'cultural',
        populationPreference: 'medium',
        visaPreference: 'any',
        lastUpdated: Date.now(),
      };
    }
    
    (this.userPreferences as any)[key] = value;
    this.userPreferences.lastUpdated = Date.now();
    this.saveUserData();
  }

  getInteractionStats() {
    const stats = {
      totalInteractions: this.userInteractions.length,
      countriesExplored: new Set(this.userInteractions.map(i => i.countryName)).size,
      averageRating: 0,
      mostViewedCountry: '',
      recentActivity: this.userInteractions.slice(-10),
    };

    const ratings = this.userInteractions.filter(i => i.rating).map(i => i.rating!);
    if (ratings.length > 0) {
      stats.averageRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;
    }

    const countryFreq: Record<string, number> = {};
    this.userInteractions.forEach(i => {
      countryFreq[i.countryName] = (countryFreq[i.countryName] || 0) + 1;
    });

    stats.mostViewedCountry = Object.entries(countryFreq)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || '';

    return stats;
  }

  resetUserData() {
    this.userInteractions = [];
    this.userPreferences = null;
    localStorage.removeItem('gemini-ml-data');
  }

  generateSmartInsights(countryName: string): { insights: string[], similarCountries: string[] } {
    if (!this.userPreferences) {
      return {
        insights: [`Welcome to ${countryName}! Start exploring more countries to get personalized insights.`],
        similarCountries: []
      };
    }

    const countryFeatures = this.countryFeatures.get(countryName);
    const userStats = this.getInteractionStats();
    const insights: string[] = [];
    const similarCountries: string[] = [];

    // Get user's interaction history with this country
    const countryInteractions = this.userInteractions.filter(i => i.countryName === countryName);
    const hasVisited = countryInteractions.length > 0;
    const userRating = countryInteractions.find(i => i.rating)?.rating;

    // Generate personalized insights based on user preferences and behavior
    if (countryFeatures) {
      // Region preference insight
      if (this.userPreferences.favoriteRegions.includes(countryFeatures.region)) {
        insights.push(`Perfect match! ${countryName} is in ${countryFeatures.region}, one of your favorite regions to explore.`);
      } else if (this.userPreferences.favoriteRegions.length > 0) {
        insights.push(`New territory! ${countryName} offers a different perspective from your usual ${this.userPreferences.favoriteRegions[0]} explorations.`);
      }

      // Budget compatibility insight
      if (countryFeatures.costCategory === this.userPreferences.budgetRange) {
        insights.push(`Budget-friendly choice! ${countryName}'s ${countryFeatures.costCategory} cost aligns perfectly with your travel budget.`);
      } else if (countryFeatures.costCategory === 'low' && this.userPreferences.budgetRange !== 'low') {
        insights.push(`Great value! ${countryName} offers excellent experiences at a lower cost than your usual destinations.`);
      } else if (countryFeatures.costCategory === 'high' && this.userPreferences.budgetRange !== 'high') {
        insights.push(`Premium destination! ${countryName} might be pricier but offers luxury experiences worth the investment.`);
      }

      // Safety rating insight
      if (countryFeatures.safetyRating >= this.userPreferences.preferredSafetyRating) {
        insights.push(`Feel secure! ${countryName}'s safety rating (${countryFeatures.safetyRating}/5) matches your comfort level.`);
      } else {
        insights.push(`Adventure awaits! ${countryName} offers unique experiences, though it requires more travel awareness.`);
      }

      // Population preference insight
      if (countryFeatures.populationCategory === this.userPreferences.populationPreference) {
        insights.push(`Perfect size! ${countryName}'s ${countryFeatures.populationCategory} population fits your preference for ${this.userPreferences.populationPreference}-sized countries.`);
      }

      // Travel style insight
      const styleInsights = {
        cultural: `Rich heritage! ${countryName} offers deep cultural experiences that align with your interests.`,
        adventure: `Thrill seeker's paradise! ${countryName} provides exciting outdoor adventures.`,
        business: `Professional hub! ${countryName} is great for business travel and networking.`,
        relaxation: `Peaceful escape! ${countryName} offers the perfect retreat for relaxation.`
      };
      insights.push(styleInsights[this.userPreferences.travelStyle]);

      // Historical interaction insight
      if (hasVisited) {
        if (userRating) {
          insights.push(`You rated ${countryName} ${userRating}/5 stars. ${userRating >= 4 ? 'Seems like a favorite!' : userRating >= 3 ? 'Worth another look!' : 'Maybe give it another chance?'}`);
        } else {
          insights.push(`You've explored ${countryName} before. Consider rating it to improve your recommendations!`);
        }
      }

      // Comparison to most viewed country
      if (userStats.mostViewedCountry && userStats.mostViewedCountry !== countryName) {
        const mostViewedFeatures = this.countryFeatures.get(userStats.mostViewedCountry);
        if (mostViewedFeatures) {
          if (mostViewedFeatures.region === countryFeatures.region) {
            insights.push(`Similar to ${userStats.mostViewedCountry}! Both countries share the same regional characteristics.`);
          } else if (mostViewedFeatures.populationCategory === countryFeatures.populationCategory) {
            insights.push(`Like ${userStats.mostViewedCountry}, ${countryName} has a ${countryFeatures.populationCategory} population size.`);
          }
        }
      }
    }

    // Generate similar countries based on user preferences and country features
    if (countryFeatures) {
      const allCountries = Array.from(this.countryFeatures.values());
      const similar = allCountries
        .filter(c => c.name !== countryName)
        .map(c => ({
          name: c.name,
          similarity: this.calculateSimilarity(countryFeatures, c)
        }))
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 4)
        .map(c => c.name);
      
      similarCountries.push(...similar);
    }

    // Limit insights to most relevant ones
    const finalInsights = insights.slice(0, 3);
    
    // Add a default insight if none were generated
    if (finalInsights.length === 0) {
      finalInsights.push(`Discover what makes ${countryName} unique! Explore more to get personalized insights.`);
    }

    return {
      insights: finalInsights,
      similarCountries: similarCountries.slice(0, 3)
    };
  }

  private calculateSimilarity(country1: CountryFeatures, country2: CountryFeatures): number {
    let similarity = 0;

    // Region similarity (highest weight)
    if (country1.region === country2.region) similarity += 0.4;

    // Population category similarity
    if (country1.populationCategory === country2.populationCategory) similarity += 0.2;

    // Cost category similarity
    if (country1.costCategory === country2.costCategory) similarity += 0.2;

    // Safety rating similarity (closer ratings = higher similarity)
    const safetyDiff = Math.abs(country1.safetyRating - country2.safetyRating);
    similarity += (1 - safetyDiff / 4) * 0.1;

    // Population size similarity (logarithmic scale)
    const pop1 = Math.log(country1.population + 1);
    const pop2 = Math.log(country2.population + 1);
    const popSimilarity = 1 - Math.abs(pop1 - pop2) / Math.max(pop1, pop2);
    similarity += popSimilarity * 0.1;

    return similarity;
  }
}

export const machineLearningService = MachineLearningService.getInstance();
