import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, limit } from 'firebase/firestore';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userQuery = searchParams.get('q');
    const persona = searchParams.get('persona');

    if (!userQuery) {
        return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
    }

    try {
        // 1. Fetch live entries from Firestore
        let groundingContext = "";
        try {
            const liveSnapshot = await getDocs(query(collection(db, "entries"), limit(5)));
            const liveEntries = liveSnapshot.docs.map(d => d.data() as any);
            if (liveEntries.length > 0) {
                groundingContext = `Living Memory (Community Hub): ${liveEntries.map(m => `[${m.title}: ${m.description}]`).join('; ')}`;
            }
        } catch (e) { console.error('Silent Firebase fetch failure:', e); }

        // 2. Supplement with Wikipedia grounding if Firestore is empty
        if (!groundingContext) {
            const searchRes = await fetch(
                `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(userQuery)}&utf8=&format=json&origin=*`
            );
            const searchData = await searchRes.json();

            if (searchData.query?.search?.length > 0) {
                const bestMatchTitle = searchData.query.search[0].title;
                const extractRes = await fetch(
                    `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=1&explaintext=1&titles=${encodeURIComponent(bestMatchTitle)}&format=json&origin=*`
                );
                const extractData = await extractRes.json();
                const pages = extractData.query?.pages;
                const pageId = Object.keys(pages)[0];
                groundingContext = pages[pageId].extract || "";
            }
        }

        // 3. Persona Reasoning via Gemini
        if (process.env.GEMINI_API_KEY) {
            const systemPrompt = `You are the "Heritage Hub Institutional Guardian." 
            Your role is to guide the user in discovering world heritage. 
            Grounding Context: "${groundingContext || "No direct record found in hub or wiki archives."}"
            
            Task: Using the context (if available) and your vast knowledge, answer the user's inquiry: "${userQuery}".
            ${persona ? `Speak as a Guardian of "${persona}" traditions.` : "Speak with an institutional, respectful, and storytelling tone."}
            
            Always prioritize community entries found in Grounding Context if they match the user's intent.
            Always encourage the user to document their own findings in the Hub.
            Keep responses concise but evocative (max 150 words).`;

            const result = await model.generateContent(systemPrompt);
            const response = await result.response;
            const cleanText = response.text().replace(/\*/g, '');
            return NextResponse.json({ answer: cleanText });
        }

        // Fallback if no Gemini API key
        if (!groundingContext) {
            return NextResponse.json({ answer: "I scoured the archives but found only whispers. Perhaps the region knows it by another name?" }, { status: 404 });
        }

        const fallbackText = `Institutional Archive on "${userQuery}": ${groundingContext.split('\n')[0]}`;
        return NextResponse.json({ answer: fallbackText + "\n\n(Note: Connect your Gemini API Key to unlock advanced storytelling mode.)" });

    } catch (error) {
        console.error('Heritage AI Error:', error);
        return NextResponse.json({ answer: 'I experienced an interference while connecting to the historical databases.' }, { status: 500 });
    }
}
