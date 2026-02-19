import { NextResponse } from 'next/server';
import { chatWithBot } from '@/lib/services/aiService';

export async function POST(req) {
    try {
        const body = await req.json();
        const { history, message } = body;

        if (!message) {
            return NextResponse.json({ error: "Message is required" }, { status: 400 });
        }

        const response = await chatWithBot(history || [], message);
        return NextResponse.json({ response });

    } catch (error) {
        console.error("AI Chat Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
