import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

export async function GET() {
    try {
        // Fetch all entries ordered by creation date
        const q = query(collection(db, "entries"), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        
        const entries = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Return the entries as a JSON array
        // Added CORS headers in case you want to access this from other domains
        return NextResponse.json(entries, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Cache-Control': 'no-store, max-age=0'
            }
        });
    } catch (error: any) {
        console.error('API Export Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch entries', details: error.message }, 
            { status: 500 }
        );
    }
}

// Handle preflight requests
export async function OPTIONS() {
    return new NextResponse(null, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
    });
}
