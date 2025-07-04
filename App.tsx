import React from 'react';
import { WorldMap } from './components/WorldMap';

const App: React.FC = () => {
  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-gray-900 p-4 md:p-8">
      <header className="text-center mb-8">
        <div className="flex items-center justify-center gap-4 mb-2">
           <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400"><path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/><path d="M12 19.5A10.5 10.5 0 0 0 22.5 9c0-8.25-10.5-12-10.5-12S1.5.75 1.5 9A10.5 10.5 0 0 0 12 19.5Z"/></svg>
           <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Gemini World Map Explorer
          </h1>
        </div>
        <p className="text-lg text-gray-400 max-w-3xl mx-auto">
          A population-colored world map. Hover over a country to fetch live data about its capital, population, and key facts using the Gemini API.
        </p>
      </header>
      <main className="w-full max-w-7xl bg-gray-800/50 border border-gray-700 rounded-2xl shadow-2xl shadow-cyan-500/10 overflow-hidden">
        <WorldMap />
      </main>
      <footer className="text-center mt-8 text-gray-500 text-sm">
        <p>Map data from Natural Earth. Country details powered by Google Gemini.</p>
      </footer>
    </div>
  );
};

export default App;