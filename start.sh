#!/bin/bash
echo "🌍 Gemini World Map Explorer - Launcher"
echo "====================================="
echo ""
echo "Choose your version:"
echo "[1] React Version (localhost:5177) - Full interactive experience"
echo "[2] Streamlit Version (localhost:8501) - Python data science version"
echo "[3] Both versions simultaneously"
echo "[4] Setup/Install dependencies"
echo ""
read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        echo ""
        echo "🌐 Starting React Version..."
        echo "Opening http://localhost:5177"
        open "http://localhost:5177" 2>/dev/null || xdg-open "http://localhost:5177" 2>/dev/null || echo "Please open http://localhost:5177 in your browser"
        npm run dev
        ;;
    2)
        echo ""
        echo "🐍 Starting Streamlit Version..."
        echo "Opening http://localhost:8501"
        open "http://localhost:8501" 2>/dev/null || xdg-open "http://localhost:8501" 2>/dev/null || echo "Please open http://localhost:8501 in your browser"
        streamlit run streamlit_app.py
        ;;
    3)
        echo ""
        echo "🚀 Starting Both Versions..."
        echo "React: http://localhost:5177"
        echo "Streamlit: http://localhost:8501"
        open "http://localhost:5177" 2>/dev/null || xdg-open "http://localhost:5177" 2>/dev/null
        open "http://localhost:8501" 2>/dev/null || xdg-open "http://localhost:8501" 2>/dev/null
        gnome-terminal -- npm run dev 2>/dev/null || xterm -e npm run dev 2>/dev/null || (echo "Starting React in background..." && npm run dev &)
        streamlit run streamlit_app.py
        ;;
    4)
        echo ""
        echo "🛠️ Running setup..."
        python setup.py
        read -p "Press enter to continue..."
        ;;
    *)
        echo "Invalid choice. Please run the script again."
        ;;
esac
