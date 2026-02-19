import { NextResponse } from 'next/server';
import { generateExplanation } from '@/lib/services/aiService';

export async function POST(req) {
    try {
        const body = await req.json();
        const { variant, drug } = body;

        if (!variant || !drug) {
            return NextResponse.json({ error: "Missing variant or drug parameter" }, { status: 400 });
        }

        const explanation = await generateExplanation(variant, drug);

        if (!explanation) {
            return NextResponse.json({ error: "Failed to generate explanation" }, { status: 500 });
        }

        return NextResponse.json(explanation);

    } catch (error) {
        console.error("AI Explain Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
