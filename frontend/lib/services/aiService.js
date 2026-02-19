const { GoogleGenerativeAI } = require("@google/generative-ai");

// Helper for delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Multi-Model Fallback List
const MODELS = [
    "gemini-1.5-flash",       // Stable Priority
    "gemini-flash-latest"     // Fallback
];

/**
 * Helper to get available keys from environment
 */
const getPotentialKeys = () => {
    return [
        process.env.GEMINI_API_KEY,
        process.env.NEXT_PUBLIC_GEMINI_API_KEY
    ].filter(key => key && key.length > 10);
};

/**
 * Robust Execution Helper
 * Tries: All Keys -> All Models
 */
const generateWithFallback = async (operationName, promptOrFn) => {
    const keys = getPotentialKeys();

    if (keys.length === 0) {
        throw new Error("❌ No valid GEMINI_API_KEY found in environment variables.");
    }

    console.log(`[AI Service] Found ${keys.length} API Keys. Starting robustness check...`);

    let lastError = null;

    // Outer Loop: API Keys
    for (let k = 0; k < keys.length; k++) {
        const apiKey = keys[k];
        const genAI = new GoogleGenerativeAI(apiKey);
        console.log(`[AI Service] 🔑 Trying Key #${k + 1} (${apiKey.slice(0, 4)}...${apiKey.slice(-4)})`);

        // Inner Loop: Models
        for (const modelName of MODELS) {
            try {
                console.log(`   [AI Service] 🤖 Attempting model: ${modelName}`);
                const model = genAI.getGenerativeModel({ model: modelName });

                if (typeof promptOrFn === 'function') {
                    // Pass the model instance to the callback (for chat)
                    return await promptOrFn(model);
                } else {
                    // Standard generation
                    const result = await model.generateContent(promptOrFn);
                    const response = await result.response;
                    return response.text();
                }

            } catch (error) {
                console.warn(`   ⚠️ [${modelName}] Failed: ${error.message}`);
                lastError = error;

                // Handle Rate Limits (429)
                if (error.message.includes("429") || (error.response && error.response.status === 429)) {
                    console.warn("   ⏳ Rate Limit Hit. Pausing 1s...");
                    await delay(1000);
                }

                // Continue to next model - DO NOT THROW HERE
                continue;
            }
        }
        // Continue to next key
    }

    console.error("[AI Service] ❌ All Keys and Models failed.");
    throw lastError || new Error("AI Service Unavailable: All fallbacks failed.");
};

export const generateExplanation = async (variantData, drugName) => {
    const prompt = `
    You are 'PharmaGuard', an expert Clinical Pharmacogenomics AI strictly following CPIC Guidelines.

    PATIENT CONTEXT:
    - Genetic Variants: ${JSON.stringify(variantData)}
    - Target Drug: ${drugName}

    STRICT GUIDELINES:
    1. **SAFE**: If phenotype is 'Normal'/'Extensive', recommend "Standard Dosing".
    2. **UNSAFE**: If 'Poor'/'Intermediate'/'Rapid', provide specific CPIC recommendation.
    3. **EVIDENCE**: Cite CPIC guideline level.

    RETURN JSON ONLY:
    {
        "summary": "Clinical summary",
        "clinical_implication": "Mechanism explanation",
        "actionable_recommendation": "Dosing recommendation",
        "confidence_score": "0-100",
        "confidence_reasoning": "Basis for score",
        "alternatives": ["Drug A", "Drug B"],
        "citations": ["CPIC Source"],
        "visual_chain": [
            { "step": "Gene", "value": "CYP2D6", "description": "Enzyme responsible for metabolism", "status": "neutral" },
            { "step": "Phenotype", "value": "Poor Metabolizer", "description": "Reduced enzyme activity", "status": "warning" },
            { "step": "Metabolism", "value": "Blocked", "description": "Cannot convert Prodrug to Active", "status": "critical" },
            { "step": "Outcome", "value": "Therapeutic Failure", "description": "Drug will not provide pain relief", "status": "info" }
        ]
    }
    `;

    try {
        const text = await generateWithFallback("generateExplanation", prompt);
        const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanedText);
    } catch (error) {
        console.error("[AI Service] Explanation Error:", error);
        return {
            summary: "Analysis Temporarily Unavailable",
            clinical_implication: "Please try again shortly.",
            alternatives: []
        };
    }
};

export const chatWithBot = async (history, message) => {
    try {
        return await generateWithFallback("chatWithBot", async (model) => {
            // Sanitize history for Gemini (User first)
            let validHistory = history.map(h => ({
                role: h.role === 'assistant' ? 'model' : h.role,
                parts: h.parts || [{ text: h.message || "" }]
            })).filter(h => h.parts[0].text.trim() !== "");

            if (validHistory.length > 0 && validHistory[0].role === 'model') {
                validHistory.shift();
            }

            const chat = model.startChat({
                history: validHistory,
                generationConfig: {
                    maxOutputTokens: 800,
                    temperature: 0.7,
                },
            });

            const systemInstruction = `
            You are 'PharmaGuard', a clinical pharmacogenomics assistant.
            CRITICAL RULES:
            1. RESPONSE MUST BE FAST & CONCISE (Max 5-6 Bullet Points).
            2. FORMAT WITH MARKDOWN BULLETS.
            3. STRICTLY FOLLOW CPIC GUIDELINES.
            4. IF UNSURE, SAY "CONSULT A CLINICIAN".
            `;

            const result = await chat.sendMessage(`${systemInstruction}\n\nUSER QUESTION: ${message}`);
            const response = await result.response;
            return response.text();
        });
    } catch (error) {
        console.error("[AI Service] Chat Error:", error);

        if (error.message.includes("429") || (error.response && error.response.status === 429)) {
            return "⚠️ **System Busy:** I am receiving too many requests right now. Please wait **60 seconds** and try again.";
        }

        return "I'm having trouble connecting to the knowledge base. Please check your internet connection.";
    }
};
