const express = require('express');
const router = express.Router();
const { generateExplanation, chatWithBot } = require('../services/aiService');

router.post('/explain', async (req, res) => {
    const { variant, drug } = req.body;
    if (!variant || !drug) {
        return res.status(400).json({ error: "Missing variant or drug parameter" });
    }
    const explanation = await generateExplanation(variant, drug);
    if (!explanation) {
        return res.status(500).json({ error: "Failed to generate explanation" });
    } else {
        res.json(explanation);
    }
});

router.post('/chat', async (req, res) => {
    const { history, message } = req.body;
    if (!message) {
        return res.status(400).json({ error: "Message is required" });
    }
    const response = await chatWithBot(history || [], message);
    res.json({ response });
});

module.exports = router;
