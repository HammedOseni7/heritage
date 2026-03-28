import { NextResponse } from 'next/server';
import { seedEntries } from '@/lib/seedFirestore';

export async function GET() {
    try {
        const result = await seedEntries();
        return NextResponse.json(result);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
