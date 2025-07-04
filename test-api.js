// Simple Node.js test for the Gemini API
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
console.log('🔑 API Key status:', apiKey ? 'Present' : 'Missing');

if (!apiKey) {
    console.error("❌ VITE_GEMINI_API_KEY environment variable not set.");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function testCountryData(countryName) {
    console.log(`🔍 Testing API for: ${countryName}`);
    
    const prompt = `Provide information about the country "${countryName}" in this exact JSON format:
{
  "name": "country name",
  "capital": "capital city", 
  "population": 12345678,
  "facts": ["fact 1", "fact 2", "fact 3"]
}

Return only the JSON object, no other text. Make sure the facts are interesting and specific to this country.`;

    try {
        // Get the generative model
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        console.log(`📤 Sending prompt for ${countryName}`);

        // Generate content
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log(`📥 Raw API response for ${countryName}:`, text);

        if (!text) {
            throw new Error('No response text received from Gemini API');
        }

        let jsonStr = text.trim();

        // Clean up the response - remove markdown fences if present
        const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
        const match = jsonStr.match(fenceRegex);
        if (match && match[2]) {
            jsonStr = match[2].trim();
        }

        // Also remove any leading/trailing text that's not JSON
        const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            jsonStr = jsonMatch[0];
        }

        console.log(`🧹 Cleaned JSON for ${countryName}:`, jsonStr);

        const data = JSON.parse(jsonStr);

        // Validate the structure
        if (!data.name || !data.capital || typeof data.population !== 'number' || !Array.isArray(data.facts)) {
            throw new Error(`Invalid data structure for ${countryName}: ${JSON.stringify(data)}`);
        }

        console.log(`✅ Successfully parsed data for ${countryName}:`, data);
        return data;
        
    } catch (error) {
        console.error(`❌ Error testing data for ${countryName}:`, error);
        throw error;
    }
}

// Test with a few countries
async function runTests() {
    const countries = ['United States', 'France', 'Japan', 'Brazil'];
    
    for (const country of countries) {
        try {
            await testCountryData(country);
            console.log(`\n`);
        } catch (error) {
            console.error(`Failed test for ${country}:`, error.message);
            console.log(`\n`);
        }
    }
}

runTests().catch(console.error);
