import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { text, targetLanguage } = await request.json();

        if (!text) {
            return NextResponse.json({ error: 'Text is required' }, { status: 400 });
        }

        // We'll use the MyMemory Free API for real translations
        // API Docs: https://mymemory.translated.net/doc/spec.php
        const response = await fetch(
            `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLanguage || 'es'}`
        );

        const data = await response.json();

        if (data.responseData) {
            return NextResponse.json({
                translatedText: data.responseData.translatedText,
                source: 'Heritage AI (MyMemory)'
            });
        }

        return NextResponse.json({ error: 'Translation failed' }, { status: 500 });

    } catch (error) {
        console.error('Translation Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
