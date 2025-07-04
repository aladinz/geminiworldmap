@echo off
echo 🌍 Gemini World Map Explorer - Launcher
echo =====================================
echo.
echo Choose your version:
echo [1] React Version (localhost:5177) - Full interactive experience
echo [2] Streamlit Version (localhost:8501) - Python data science version
echo [3] Both versions simultaneously
echo [4] Setup/Install dependencies
echo.
set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" (
    echo.
    echo 🌐 Starting React Version...
    echo Opening http://localhost:5177
    start "" "http://localhost:5177"
    npm run dev
) else if "%choice%"=="2" (
    echo.
    echo 🐍 Starting Streamlit Version...
    echo Opening http://localhost:8501
    start "" "http://localhost:8501"
    streamlit run streamlit_app.py
) else if "%choice%"=="3" (
    echo.
    echo 🚀 Starting Both Versions...
    echo React: http://localhost:5177
    echo Streamlit: http://localhost:8501
    start "" "http://localhost:5177"
    start "" "http://localhost:8501"
    start cmd /k "npm run dev"
    streamlit run streamlit_app.py
) else if "%choice%"=="4" (
    echo.
    echo 🛠️ Running setup...
    python setup.py
    pause
) else (
    echo Invalid choice. Please run the script again.
    pause
)
