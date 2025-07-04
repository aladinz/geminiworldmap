import streamlit as st
import plotly.express as px
import plotly.graph_objects as go
import pandas as pd
import numpy as np
import json
import requests
from datetime import datetime
import time
import random
from typing import Dict, List, Tuple, Optional
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure Streamlit page
st.set_page_config(
    page_title="🌍 Gemini World Map Explorer",
    page_icon="🌍",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for better styling
st.markdown("""
<style>
    .main-header {
        text-align: center;
        padding: 1rem 0;
        background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        color: white;
        border-radius: 10px;
        margin-bottom: 2rem;
    }
    
    .metric-card {
        background: #f8f9fa;
        padding: 1rem;
        border-radius: 8px;
        border-left: 4px solid #667eea;
        margin: 0.5rem 0;
    }
    
    .insight-card {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 1rem;
        border-radius: 8px;
        margin: 0.5rem 0;
    }
    
    .country-tag {
        display: inline-block;
        background: #667eea;
        color: white;
        padding: 0.25rem 0.5rem;
        margin: 0.25rem;
        border-radius: 4px;
        font-size: 0.8rem;
    }
</style>
""", unsafe_allow_html=True)

# Title
st.markdown("""
<div class="main-header">
    <h1>🌍 Gemini World Map Explorer</h1>
    <p>Discover the world with AI-powered insights and real-time data</p>
</div>
""", unsafe_allow_html=True)

# Country population data (converted from constants.ts)
COUNTRY_POPULATIONS = {
    'China': 1425671352,
    'India': 1417173173,
    'United States': 339996563,
    'Indonesia': 277534122,
    'Pakistan': 240485658,
    'Nigeria': 223804632,
    'Brazil': 216422446,
    'Bangladesh': 171186372,
    'Russia': 144444359,
    'Mexico': 128455567,
    'Ethiopia': 126527060,
    'Japan': 123294513,
    'Philippines': 117337368,
    'Egypt': 112716598,
    'Vietnam': 98858950,
    'Iran': 86758304,
    'Turkey': 85816199,
    'Germany': 83294633,
    'Thailand': 71668264,
    'United Kingdom': 67736802,
    'Tanzania': 67438106,
    'France': 64756584,
    'South Africa': 60414495,
    'Italy': 58940687,
    'Myanmar': 55227143,
    'Kenya': 55100586,
    'South Korea': 51784059,
    'Colombia': 51874024,
    'Uganda': 48582334,
    'Spain': 47519628,
    'Argentina': 45773884,
    'Algeria': 45606480,
    'Sudan': 45992020,
    'Ukraine': 43306477,
    'Iraq': 44496122,
    'Afghanistan': 42239854,
    'Poland': 41026067,
    'Canada': 39742430,
    'Morocco': 37840044,
    'Saudi Arabia': 36947025,
    'Uzbekistan': 35163944,
    'Peru': 33715471,
    'Angola': 35588987,
    'Malaysia': 33938221,
    'Mozambique': 33897354,
    'Ghana': 33475870,
    'Yemen': 33697358,
    'Nepal': 30896590,
    'Venezuela': 28838499,
    'Madagascar': 30325732,
    'Cameroon': 28647293,
    'North Korea': 26069416,
    'Australia': 26439111,
    'Niger': 26207977,
    'Sri Lanka': 23103565,
    'Burkina Faso': 23251485,
    'Mali': 22593590,
    'Romania': 19892812,
    'Malawi': 20405317,
    'Chile': 19629590,
    'Kazakhstan': 19644865,
    'Zambia': 20017675,
    'Guatemala': 18092026,
    'Ecuador': 18001000,
    'Syria': 19364809,
    'Netherlands': 17590672,
    'Senegal': 18275743,
    'Cambodia': 16944826,
    'Chad': 18278568,
    'Somalia': 18143378,
    'Zimbabwe': 16665409,
    'Guinea': 14190612,
    'Rwanda': 14256567,
    'Benin': 13712828,
    'Burundi': 13238559,
    'Tunisia': 12458223,
    'Bolivia': 12224110,
    'Belgium': 11686140,
    'Haiti': 11724763,
    'Cuba': 11212191,
    'South Sudan': 11088796,
    'Dominican Republic': 11332972,
    'Czech Republic': 10827529,
    'Greece': 10432481,
    'Jordan': 11285869,
    'Portugal': 10467366,
    'Azerbaijan': 10358074,
    'Sweden': 10612086,
    'Honduras': 10593798,
    'United Arab Emirates': 10081785,
    'Hungary': 9676135,
    'Tajikistan': 10143543,
    'Belarus': 9498238,
    'Austria': 9120813,
    'Papua New Guinea': 10329931,
    'Serbia': 8653016,
    'Israel': 9756700,
    'Switzerland': 8921981,
    'Togo': 8680837,
    'Sierra Leone': 8791092,
    'Hong Kong': 7346248,
    'Laos': 7633779,
    'Paraguay': 6861524,
    'Bulgaria': 6687717,
    'Libya': 6888388,
    'Lebanon': 5489739,
    'Nicaragua': 6948392,
    'Kyrgyzstan': 6735347,
    'El Salvador': 6364943,
    'Turkmenistan': 6117924,
    'Singapore': 5941060,
    'Denmark': 5910913,
    'Finland': 5545475,
    'Congo': 5835806,
    'Slovakia': 5428792,
    'Norway': 5474360,
    'Oman': 4644384,
    'Palestine': 5371230,
    'Costa Rica': 5212173,
    'Liberia': 5418377,
    'Ireland': 5056935,
    'Central African Republic': 5579144,
    'New Zealand': 5228100,
    'Mauritania': 4862989,
    'Panama': 4351267,
    'Kuwait': 4310108,
    'Croatia': 3853200,
    'Moldova': 3435931,
    'Georgia': 3736400,
    'Eritrea': 3748901,
    'Uruguay': 3423108,
    'Bosnia and Herzegovina': 3210847,
    'Mongolia': 3398366,
    'Armenia': 2777970,
    'Jamaica': 2825544,
    'Qatar': 2716391,
    'Albania': 2832439,
    'Puerto Rico': 2829812,
    'Lithuania': 2718352,
    'Namibia': 2604172,
    'Gambia': 2759198,
    'Botswana': 2675352,
    'Gabon': 2436566,
    'Lesotho': 2330318,
    'Slovenia': 2119675,
    'North Macedonia': 2093599,
    'Latvia': 1830211,
    'Bahrain': 1783983,
    'Equatorial Guinea': 1714671,
    'Trinidad and Tobago': 1534937,
    'Estonia': 1322765,
    'Timor-Leste': 1360596,
    'Mauritius': 1300557,
    'Cyprus': 1260138,
    'Eswatini': 1202005,
    'Djibouti': 1136455,
    'Fiji': 924610,
    'Réunion': 981796,
    'Comoros': 852075,
    'Guyana': 813834,
    'Bhutan': 787424,
    'Solomon Islands': 740424,
    'Macao': 695168,
    'Montenegro': 626485,
    'Luxembourg': 640064,
    'Western Sahara': 611875,
    'Suriname': 618040,
    'Cape Verde': 598682,
    'Maldives': 521021,
    'Malta': 519562,
    'Brunei': 452524,
    'Belize': 405272,
    'Bahamas': 412623,
    'Iceland': 375318,
    'Vanuatu': 334506,
    'Barbados': 281995,
    'New Caledonia': 290915,
    'French Polynesia': 308872,
    'Samoa': 205557,
    'Saint Lucia': 180251,
    'Kiribati': 133515,
    'Micronesia': 114164,
    'Grenada': 124610,
    'Saint Vincent and the Grenadines': 103948,
    'Aruba': 106277,
    'Tonga': 107749,
    'United States Virgin Islands': 99465,
    'Seychelles': 107118,
    'Antigua and Barbuda': 93219,
    'Isle of Man': 84710,
    'Andorra': 79824,
    'Dominica': 72737,
    'Cayman Islands': 69310,
    'Bermuda': 64055,
    'Marshall Islands': 41996,
    'Northern Mariana Islands': 49796,
    'Greenland': 56583,
    'American Samoa': 44273,
    'Saint Kitts and Nevis': 47755,
    'Faroe Islands': 53270,
    'Sint Maarten': 44222,
    'Monaco': 36469,
    'Turks and Caicos Islands': 46062,
    'Saint Martin': 32556,
    'Liechtenstein': 39327,
    'San Marino': 33745,
    'British Virgin Islands': 31758,
    'Cook Islands': 17571,
    'Palau': 18055,
    'Anguilla': 15857,
    'Wallis and Futuna': 11572,
    'Tuvalu': 11396,
    'Nauru': 12780,
    'Saint Barthélemy': 9907,
    'Saint Helena': 5314,
    'Saint Pierre and Miquelon': 5840,
    'Montserrat': 4922,
    'Falkland Islands': 3539,
    'Norfolk Island': 2188,
    'Christmas Island': 1692,
    'Tokelau': 1893,
    'Niue': 1549,
    'Vatican City': 825,
    'Cocos Islands': 573,
    'Pitcairn Islands': 50
}

class StreamlitMLService:
    """Machine Learning service for Streamlit app"""
    
    def __init__(self):
        if 'user_interactions' not in st.session_state:
            st.session_state.user_interactions = []
        if 'user_preferences' not in st.session_state:
            st.session_state.user_preferences = {
                'favorite_regions': [],
                'preferred_safety_rating': 3,
                'budget_range': 'medium',
                'travel_style': 'cultural',
                'population_preference': 'medium'
            }
    
    def track_interaction(self, country: str, action: str):
        """Track user interaction"""
        interaction = {
            'country': country,
            'action': action,
            'timestamp': datetime.now(),
        }
        st.session_state.user_interactions.append(interaction)
    
    def get_personalized_insights(self, country: str) -> List[str]:
        """Generate personalized insights for a country"""
        insights = []
        
        # Get user interaction history
        country_interactions = [i for i in st.session_state.user_interactions if i['country'] == country]
        
        if not country_interactions:
            insights.append(f"First time exploring {country}! Click to learn more.")
        else:
            insights.append(f"You've viewed {country} {len(country_interactions)} time(s) before.")
        
        # Add population-based insight
        if country in COUNTRY_POPULATIONS:
            pop = COUNTRY_POPULATIONS[country]
            if pop > 100_000_000:
                insights.append(f"{country} is a highly populated country with {pop:,} people.")
            elif pop > 10_000_000:
                insights.append(f"{country} has a substantial population of {pop:,} people.")
            else:
                insights.append(f"{country} is a smaller country with {pop:,} people.")
        
        return insights[:3]  # Limit to 3 insights

def create_world_map():
    """Create an interactive world map using Plotly"""
    
    # Create a DataFrame from country data
    countries = []
    populations = []
    for country, pop in COUNTRY_POPULATIONS.items():
        countries.append(country)
        populations.append(pop)
    
    df = pd.DataFrame({
        'country': countries,
        'population': populations,
        'log_population': np.log10(populations)
    })
    
    # Create choropleth map
    fig = px.choropleth(
        df,
        locations='country',
        locationmode='country names',
        color='log_population',
        hover_name='country',
        hover_data={'population': ':,', 'log_population': False},
        color_continuous_scale='Viridis',
        title='World Population by Country (Log Scale)',
        labels={'log_population': 'Log Population'}
    )
    
    fig.update_layout(
        geo=dict(
            showframe=False,
            showcoastlines=True,
            projection_type='equirectangular'
        ),
        title_x=0.5,
        height=600
    )
    
    return fig

def main():
    """Main Streamlit application"""
    
    # Initialize ML service
    ml_service = StreamlitMLService()
    
    # Sidebar
    with st.sidebar:
        st.header("🎯 Explorer Settings")
        
        # Country search
        st.subheader("🔍 Search Countries")
        search_term = st.text_input("Search for a country...")
        
        if search_term:
            matching_countries = [c for c in COUNTRY_POPULATIONS.keys() 
                                if search_term.lower() in c.lower()]
            if matching_countries:
                selected_country = st.selectbox("Select a country:", matching_countries)
                if st.button("Explore Country"):
                    ml_service.track_interaction(selected_country, 'search')
                    st.session_state.selected_country = selected_country
        
        # User preferences
        st.subheader("⚙️ Your Preferences")
        travel_style = st.selectbox(
            "Travel Style:",
            ['cultural', 'adventure', 'business', 'relaxation']
        )
        budget_range = st.selectbox(
            "Budget Range:",
            ['low', 'medium', 'high']
        )
        
        st.session_state.user_preferences.update({
            'travel_style': travel_style,
            'budget_range': budget_range
        })
        
        # User stats
        st.subheader("📊 Your Stats")
        total_interactions = len(st.session_state.user_interactions)
        unique_countries = len(set(i['country'] for i in st.session_state.user_interactions))
        
        st.metric("Countries Explored", unique_countries)
        st.metric("Total Interactions", total_interactions)
    
    # Main content
    col1, col2 = st.columns([2, 1])
    
    with col1:
        st.subheader("🗺️ Interactive World Map")
        
        # Display the map
        fig = create_world_map()
        
        # Handle map clicks (simplified for Streamlit)
        selected_country = st.selectbox(
            "Click to explore a country:",
            list(COUNTRY_POPULATIONS.keys()),
            key="map_country_select"
        )
        
        if selected_country:
            ml_service.track_interaction(selected_country, 'click')
            st.session_state.selected_country = selected_country
        
        st.plotly_chart(fig, use_container_width=True)
    
    with col2:
        st.subheader("🏛️ Country Details")
        
        if 'selected_country' in st.session_state:
            country = st.session_state.selected_country
            
            # Country info card
            st.markdown(f"### 🏴 {country}")
            
            if country in COUNTRY_POPULATIONS:
                population = COUNTRY_POPULATIONS[country]
                st.metric("Population", f"{population:,}")
                
                # Population category
                if population > 100_000_000:
                    category = "🏙️ Highly Populated"
                elif population > 10_000_000:
                    category = "🏘️ Substantially Populated"
                else:
                    category = "🏡 Moderately Populated"
                
                st.info(category)
            
            # Smart Insights
            st.subheader("🧠 Smart Insights")
            insights = ml_service.get_personalized_insights(country)
            
            for insight in insights:
                st.markdown(f"""
                <div class="insight-card">
                    💡 {insight}
                </div>
                """, unsafe_allow_html=True)
            
            # Mock real-time data
            st.subheader("📈 Real-Time Data")
            
            # Live population counter (mock)
            current_pop = COUNTRY_POPULATIONS.get(country, 0)
            growth_rate = random.uniform(0.5, 2.5)  # Mock growth rate
            
            col_a, col_b = st.columns(2)
            with col_a:
                st.metric("Current Population", f"{current_pop:,}")
            with col_b:
                st.metric("Growth Rate", f"{growth_rate:.1f}%", delta=f"+{int(current_pop * growth_rate / 100):,}")
            
            # Mock news
            st.subheader("📰 Latest News")
            mock_news = [
                f"Economic growth continues in {country}",
                f"New infrastructure projects announced in {country}",
                f"Tourism reaches new heights in {country}"
            ]
            
            for news in mock_news[:2]:
                st.info(f"📰 {news}")
            
            # Rate country
            st.subheader("⭐ Rate This Country")
            rating = st.slider("Rate your interest (1-5)", 1, 5, 3)
            if st.button("Submit Rating"):
                ml_service.track_interaction(country, 'rate')
                st.success(f"Thanks for rating {country} as {rating}/5!")
        
        else:
            st.info("👆 Select a country from the map or search to see details!")
    
    # Recent activity
    st.subheader("🕒 Recent Activity")
    if st.session_state.user_interactions:
        recent = st.session_state.user_interactions[-5:]
        for interaction in reversed(recent):
            st.text(f"{interaction['timestamp'].strftime('%H:%M:%S')} - {interaction['action'].title()} {interaction['country']}")
    else:
        st.info("Start exploring countries to see your activity!")

if __name__ == "__main__":
    main()
