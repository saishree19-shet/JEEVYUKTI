// const fetch = require('node-fetch'); // Native fetch in Node 18+

async function testChat() {
    try {
        const response = await fetch('http://localhost:5000/api/ai/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: "Explain the clinical risk of using Codeine for a CYP2D6 Poor Metabolizer."
            })
        });
        const data = await response.json();
        console.log("Status:", response.status);
        console.log("Full Response Text:\n", data.response);
    } catch (error) {
        console.error("Error:", error);
    }
}

testChat();
