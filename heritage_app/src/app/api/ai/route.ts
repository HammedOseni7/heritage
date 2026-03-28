import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const persona = searchParams.get('persona');

    if (!query) {
        return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
    }

    try {
        // 1. Search Wikipedia for the closest matching page title
        const searchRes = await fetch(
            `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&utf8=&format=json&origin=*`
        );

        const searchData = await searchRes.json();

        if (!searchData.query?.search || searchData.query.search.length === 0) {
            return NextResponse.json({ answer: "I scoured the historical archives but couldn't find a direct record of that specific term. Could it be known by another name in the region?" }, { status: 404 });
        }

        const bestMatchTitle = searchData.query.search[0].title;

        // 2. Fetch the introductory extract for that specific page
        const extractRes = await fetch(
            `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=1&explaintext=1&titles=${encodeURIComponent(bestMatchTitle)}&format=json&origin=*`
        );

        const extractData = await extractRes.json();
        const pages = extractData.query?.pages;

        if (!pages) {
            return NextResponse.json({ answer: "I found a reference, but the archives are currently unreadable. Let's try another search." }, { status: 500 });
        }

        const pageId = Object.keys(pages)[0];
        const rawExtract = pages[pageId].extract;

        if (!rawExtract) {
            return NextResponse.json({ answer: "The archives mention this, but I cannot retrieve the full context at this moment." }, { status: 404 });
        }

        // Clean up and truncate the response
        const paragraphs = rawExtract.split('\n').filter(Boolean);
        let finalAnswer = paragraphs[0];

        // Apply Persona Logic
        if (persona) {
            finalAnswer = `As a Guardian of ${persona}, I can tell you that ${finalAnswer.replace(/^.*is /, 'our tradition is ')}`;
            if (paragraphs.length > 1) {
                finalAnswer += ` We also believe that ${paragraphs[1].charAt(0).toLowerCase() + paragraphs[1].slice(1)}`;
            }
        } else {
            finalAnswer = `According to the global archives on "${bestMatchTitle}": ${finalAnswer}`;
            if (finalAnswer.length < 300 && paragraphs.length > 1) {
                finalAnswer += `\n\nFurthermore, ${paragraphs[1]}`;
            }
        }

        return NextResponse.json({ answer: finalAnswer });

    } catch (error) {
        console.error('Wikipedia AI Search Error:', error);
        return NextResponse.json({ answer: 'I experienced an interference while connecting to the historical databases. Please pause and try again.' }, { status: 500 });
    }
}
