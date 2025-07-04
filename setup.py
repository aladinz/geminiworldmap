#!/usr/bin/env python3
"""
Setup script for Gemini World Map Explorer
Supports both React (local) and Streamlit versions
"""

import subprocess
import sys
import os
import platform

def run_command(command, description):
    """Run a command and handle errors"""
    print(f"🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed: {e}")
        print(f"Error output: {e.stderr}")
        return False

def check_node():
    """Check if Node.js is installed"""
    try:
        subprocess.run(["node", "--version"], check=True, capture_output=True)
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        return False

def check_python():
    """Check if Python is installed"""
    try:
        subprocess.run([sys.executable, "--version"], check=True, capture_output=True)
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        return False

def setup_react_app():
    """Setup React/Vite application"""
    print("\n🌐 Setting up React Application...")
    
    if not check_node():
        print("❌ Node.js not found. Please install Node.js from https://nodejs.org/")
        return False
    
    # Install npm dependencies
    if not run_command("npm install", "Installing Node.js dependencies"):
        return False
    
    print("✅ React app setup complete!")
    return True

def setup_streamlit_app():
    """Setup Streamlit application"""
    print("\n🐍 Setting up Streamlit Application...")
    
    if not check_python():
        print("❌ Python not found. Please install Python from https://python.org/")
        return False
    
    # Install Python dependencies
    if not run_command(f"{sys.executable} -m pip install -r requirements.txt", "Installing Python dependencies"):
        return False
    
    print("✅ Streamlit app setup complete!")
    return True

def main():
    """Main setup function"""
    print("🌍 Gemini World Map Explorer Setup")
    print("=" * 50)
    
    print("\nThis script will set up both versions of the application:")
    print("1. React/Vite version (localhost:5177)")
    print("2. Streamlit version (localhost:8501)")
    
    # Setup React app
    react_success = setup_react_app()
    
    # Setup Streamlit app
    streamlit_success = setup_streamlit_app()
    
    print("\n" + "=" * 50)
    print("🎉 Setup Summary:")
    
    if react_success:
        print("✅ React app ready!")
        print("   Run: npm run dev (opens on http://localhost:5177)")
    else:
        print("❌ React app setup failed")
    
    if streamlit_success:
        print("✅ Streamlit app ready!")
        print("   Run: streamlit run streamlit_app.py (opens on http://localhost:8501)")
    else:
        print("❌ Streamlit app setup failed")
    
    if react_success or streamlit_success:
        print("\n🚀 You can now run either or both applications!")
        if react_success and streamlit_success:
            print("💡 Tip: Run both simultaneously to compare features!")

if __name__ == "__main__":
    main()
