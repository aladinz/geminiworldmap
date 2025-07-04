# 🌍 Gemini World Map Explorer - Dual Platform Edition

> **Interactive world exploration with AI-powered insights - Now available in React and Streamlit!**

![World Map Explorer](https://img.shields.io/badge/Platform-React%20%7C%20Streamlit-blue) ![Status](https://img.shields.io/badge/Status-Ready%20for%20Deployment-green) ![Features](https://img.shields.io/badge/Features-ML%20%7C%20Real--time%20%7C%20Interactive-orange)

## 🚀 Quick Start

### Option 1: Automated Launcher (Recommended)
```bash
# Windows
start.bat

# macOS/Linux  
chmod +x start.sh && ./start.sh
```

### Option 2: Manual Setup
```bash
# Setup both versions
python setup.py

# Run React version (Full experience)
npm run dev          # → http://localhost:5177

# Run Streamlit version (Data science)
streamlit run streamlit_app.py    # → http://localhost:8501
```

## 🎭 Two Powerful Versions

### 🌐 React Version - Interactive Experience
**Best for: Production apps, interactive UX, mobile support**

**Features:**
- ✨ **Advanced Interactivity**: Hover effects, smooth animations, click-to-pin
- 🤖 **Full ML Engine**: Personalized recommendations, behavior tracking
- 📊 **Real-time Data**: Live population counters, news feeds, travel info
- 🔍 **Advanced Search**: Auto-complete, instant zoom, country highlighting
- 🎨 **Custom UI**: Beautiful animations, responsive design
- 🧠 **Smart Insights**: AI-powered personalized country insights
- 📱 **Mobile Ready**: Touch-friendly responsive interface

**Tech Stack:** React 18, TypeScript, Vite, D3.js, React Simple Maps

### 🐍 Streamlit Version - Data Science Platform
**Best for: Data analysis, research, rapid prototyping, Python ecosystem**

**Features:**
- 📈 **Interactive Charts**: Plotly choropleth maps with population data
- 🔬 **Data Analysis**: Pandas integration for statistical analysis
- 🤖 **Simplified ML**: User behavior tracking and basic insights
- 📊 **Python Ecosystem**: Full access to numpy, pandas, scikit-learn
- ☁️ **Easy Deployment**: One-click Streamlit Cloud deployment
- 🎛️ **Control Widgets**: Sliders, dropdowns, and interactive components

**Tech Stack:** Streamlit, Plotly, Pandas, NumPy

## 📊 Feature Comparison

| Feature | React Version | Streamlit Version |
|---------|---------------|-------------------|
| **Map Interaction** | Hover, Click, Zoom, Pan | Click Selection |
| **Visual Quality** | Custom SVG with animations | Plotly choropleth |
| **ML Recommendations** | Full engine with similarity | Simplified insights |
| **Real-time Data** | Live counters, WebSocket ready | Static/mock data |
| **Search** | Auto-complete with highlighting | Dropdown selection |
| **Mobile Support** | Full responsive design | Basic responsive |
| **Deployment** | Static hosting (Vercel, Netlify) | Streamlit Cloud, Heroku |
| **Customization** | Complete control | Streamlit components |
| **Data Science** | Limited | Full Python ecosystem |
| **Development Speed** | Moderate | Very fast |

## 🛠️ Installation & Setup

### Prerequisites
- **Node.js** 18+ (for React version)
- **Python** 3.8+ (for Streamlit version)

### React Version Setup
```bash
# Install dependencies
npm install

# Start development
npm run dev

# Build for production
npm run build
```

### Streamlit Version Setup
```bash
# Install Python dependencies
pip install -r requirements.txt

# Run Streamlit app
streamlit run streamlit_app.py
```

### Both Versions (Automated)
```bash
# Run setup script
python setup.py

# Or use the launcher
start.bat    # Windows
./start.sh   # macOS/Linux
```

## 🌐 Live Demos

- **React Version**: http://localhost:5177 (after running `npm run dev`)
- **Streamlit Version**: http://localhost:8501 (after running `streamlit run streamlit_app.py`)

## 🎯 Use Cases

### Choose React Version For:
- 🏢 **Commercial Applications**: Customer-facing products
- 🎮 **Interactive Experiences**: Gaming, education, entertainment
- 📱 **Mobile Apps**: Touch-first interfaces
- 🎨 **Custom Branding**: Complete design control
- ⚡ **Performance**: Optimized for large-scale usage

### Choose Streamlit Version For:
- 🔬 **Research Projects**: Academic studies, data exploration
- 📊 **Data Dashboards**: Internal analytics, reporting
- 🧪 **Prototyping**: Rapid feature testing
- 🐍 **Python Workflows**: Integration with existing Python tools
- ☁️ **Quick Deployment**: MVP and proof of concepts

## 🔧 Configuration

### Environment Variables
Create `.env.local` with:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

## 📚 Documentation

- **[Streamlit Setup Guide](STREAMLIT_SETUP.md)** - Detailed Streamlit deployment guide
- **[ML Integration](ML_INTEGRATION_COMPLETE.md)** - Machine learning features
- **[Real-time Features](REALTIME_INTEGRATION_COMPLETE.md)** - Real-time data integration

## 🎉 What's New

✅ **Dual Platform Support**: React + Streamlit versions  
✅ **Fixed Smart Insights**: Personalized for each country  
✅ **Easy Deployment**: Streamlit Cloud ready  
✅ **Python Ecosystem**: Full data science integration  
✅ **Automated Setup**: One-click launchers  

---

**🌍 Start exploring the world with AI-powered insights! Choose your platform and begin your journey! ✨**

For detailed setup instructions and deployment guide, see [STREAMLIT_SETUP.md](STREAMLIT_SETUP.md)
