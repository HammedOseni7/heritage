import { NextResponse } from 'next/server';
import { seedEntries, seedUsers } from '@/lib/seedFirestore';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const force = searchParams.get('force') === 'true';

    try {
        const entriesResult = await seedEntries(force);
        const usersResult = await seedUsers(force);
        
        return NextResponse.json({
            entries: entriesResult,
            users: usersResult
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
