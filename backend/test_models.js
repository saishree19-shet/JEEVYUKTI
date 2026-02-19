const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

// Native fetch in Node 18+
// const fetch = require('node-fetch'); 

async function listModels() {
    if (!process.env.GEMINI_API_KEY) {
        console.error("No API KEY found!");
        return;
    }

    const key = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;

    console.log("Fetching models via REST API...");
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            console.error("API Error:", JSON.stringify(data.error, null, 2));
        } else {
            console.log("Available Models:");
            if (data.models) {
                data.models.forEach(m => console.log(`- ${m.name} (${m.version}) [${m.supportedGenerationMethods.join(', ')}]`));
            } else {
                console.log("No models found.");
            }
        }
    } catch (error) {
        console.error("Network Error:", error);
    }
}

// listModels();

async function testSpecificModel() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const modelName = "gemini-flash-latest";
    console.log(`Testing SDK with model: ${modelName}`);
    try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Hello");
        console.log("Success! Response:", result.response.text());
    } catch (e) {
        console.error("SDK Error:", e);
    }
}
testSpecificModel();
