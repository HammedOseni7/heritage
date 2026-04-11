import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function POST(request: Request) {
    try {
        const { text, targetLanguage } = await request.json();

        if (!text) {
            return NextResponse.json({ error: 'Text is required' }, { status: 400 });
        }

        if (!process.env.GEMINI_API_KEY) {
            console.warn('GEMINI_API_KEY is missing. Falling back to simple response.');
            return NextResponse.json({ 
                translatedText: text, 
                source: 'Baseline (API Key Missing)',
                warning: 'Gemini API key not configured.'
            });
        }

        const systemPrompt = `You are a professional linguistic expert specializing in World Heritage and cultural preservation.
        
        Task: Translate the following text into ${targetLanguage || 'Spanish'}.
        Text to translate: "${text}"
        
        Rules:
        1. Maintain the cultural nuance and respectful tone.
        2. Ensure technical terms related to heritage, archeology, or traditions are translated accurately.
        3. provide ONLY the translated text, no introductory or concluding remarks.`;

        const result = await model.generateContent(systemPrompt);
        const response = await result.response;
        const translatedText = response.text().trim();

        return NextResponse.json({
            translatedText,
            source: 'Heritage Hub AI (Gemini)'
        });

    } catch (error: any) {
        console.error('Translation Error:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
