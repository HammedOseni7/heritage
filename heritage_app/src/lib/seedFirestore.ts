/**
 * One-time Firestore seeder — run with ts-node or copy-paste into a quick script.
 * Usage: After starting the dev server, open the browser console on any page
 * and call window.__seedFirestore() OR just visit /api/seed once.
 *
 * This is also triggered automatically via the /api/seed route below.
 */

import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

const SEED_ENTRIES = [
    {
        title: 'The Legend of the Silver River',
        description: 'An ancient oral tradition from the Guarani people about the origin of the Milky Way.',
        content: 'The Guarani people believe that the Milky Way is a celestial path where souls travel...',
        type: 'story',
        author: { name: 'Elena Rojas', avatar: 'https://i.pravatar.cc/150?u=elena', badges: ['Storyteller'] },
        location: { lat: -25.5, lng: -54.5, city: 'Puerto Iguazú', country: 'Argentina' },
        createdAt: '2024-03-01T10:00:00Z',
        validationCount: 42, invalidationCount: 0, isValidated: true,
        status: 'Community Verified', images: ['/images/silver_river.png'],
        isElderVerified: true,
        audioUrl: 'https://actions.google.com/sounds/v1/water/waves_crashing_on_rock_beach.ogg',
        hasSimulation: true, simulationType: 'chat', comments: [],
        metadata: { tribe: 'Guarani', language: 'Guarani', theme: 'Mythology', region: 'South America' }
    },
    {
        title: 'Mancala Strategy: The Opening Gambit',
        description: 'Traditional rules and advanced opening strategies for the ancient game of Mancala.',
        content: 'Mancala is one of the oldest known board games. The opening move often dictates the flow...',
        type: 'game',
        author: { name: 'Moussa Diop', avatar: 'https://i.pravatar.cc/150?u=moussa', badges: ['Grandmaster'] },
        location: { lat: 14.7, lng: -17.4, city: 'Dakar', country: 'Senegal' },
        createdAt: '2024-03-05T11:20:00Z',
        validationCount: 28, invalidationCount: 0, isValidated: true,
        status: 'Community Verified', images: ['/images/mancala.png'],
        has3DModel: true, hasSimulation: true, simulationType: 'mancala', comments: [],
        metadata: { theme: 'Strategy', region: 'West Africa', tribe: 'Wolof' }
    },
    {
        title: 'Himalayan Healing Herbs',
        description: 'Traditional knowledge of medicinal plants found in the high altitude of the Himalayas.',
        content: 'For generations, the sherpas have used the Blue Poppy for respiratory ailments...',
        type: 'medicine',
        author: { name: 'Tenzin Gyatso', avatar: 'https://i.pravatar.cc/150?u=tenzin', badges: ['Healer'] },
        location: { lat: 27.9, lng: 86.9, city: 'Namche Bazaar', country: 'Nepal' },
        createdAt: '2024-03-02T14:30:00Z',
        validationCount: 156, invalidationCount: 0, isValidated: true,
        status: 'Community Verified', images: ['/images/herbs.png'],
        isElderVerified: true, hasSimulation: true, simulationType: 'chat', comments: [],
        metadata: { tribe: 'Sherpa', language: 'Sherpa', theme: 'Herbal Remedies', region: 'Himalayas' }
    },
    {
        title: 'Jollof Rice: The West African Soul',
        description: 'A deep dive into the cultural significance and regional variations of Jollof rice.',
        content: 'Whether it is the Nigerian smoky variety or the Senegalese Thieboudienne, Jollof is more than food...',
        type: 'cuisine',
        author: { name: 'Amina Okafor', avatar: 'https://i.pravatar.cc/150?u=amina', badges: ['Chef'] },
        location: { lat: 6.5, lng: 3.4, city: 'Lagos', country: 'Nigeria' },
        createdAt: '2024-03-06T18:00:00Z',
        validationCount: 2, invalidationCount: 0, isValidated: false,
        status: 'Pending',
        originYear: 1400,
        migrationPath: [
            { lat: 14.4974, lng: -14.4524, city: 'Saint-Louis', country: 'Senegal', year: 1400 },
            { lat: 9.0820, lng: 8.6753, city: 'Abuja', country: 'Nigeria', year: 1800 },
            { lat: 7.9465, lng: -1.0232, city: 'Accra', country: 'Ghana', year: 1900 }
        ],
        images: ['/images/jollof.png'], comments: [],
        metadata: { region: 'West Africa', theme: 'Culinary Migration' }
    },
    {
        title: 'Kente Weaving: Patterns of History',
        description: 'The geometric symbols of the Ashanti people representing concepts and aphorisms.',
        content: 'Each color in a Kente cloth has a specific meaning. Yellow represents royalty...',
        type: 'craft',
        author: { name: 'Kwame Mensah', avatar: 'https://i.pravatar.cc/150?u=kwame', badges: ['Artisan'] },
        location: { lat: 6.6, lng: -1.6, city: 'Kumasi', country: 'Ghana' },
        createdAt: '2024-03-03T09:15:00Z',
        validationCount: 89, invalidationCount: 0, isValidated: true,
        status: 'Community Verified',
        originYear: 1000,
        migrationPath: [
            { lat: 5.6037, lng: -0.1870, city: 'Accra', country: 'Ghana', year: 1000 },
            { lat: 4.5353, lng: -7.0373, city: 'Abidjan', country: 'Ivory Coast', year: 1500 },
            { lat: 6.5244, lng: 3.3792, city: 'Lagos', country: 'Nigeria', year: 1700 }
        ],
        images: ['/images/kente.png'],
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        has3DModel: true, hasSimulation: true, simulationType: 'weaving', comments: [],
        metadata: { tribe: 'Ashanti', language: 'Twi', theme: 'Textile Art', region: 'West Africa' }
    },
    {
        title: 'Inti Raymi: Festival of the Sun',
        description: 'The ancient Incan winter solstice celebration in Cusco.',
        content: 'Inti Raymi is a religious ceremony of the Inca Empire in honor of the god Inti...',
        type: 'festival',
        author: { name: 'Mateo Quispe', avatar: 'https://i.pravatar.cc/150?u=mateo', badges: ['Custodian'] },
        location: { lat: -13.5, lng: -71.9, city: 'Cusco', country: 'Peru' },
        createdAt: '2024-03-04T12:00:00Z',
        validationCount: 15, invalidationCount: 0, isValidated: true,
        status: 'Community Verified', images: ['/images/inti_raymi.png'], comments: [],
        metadata: { tribe: 'Inca', language: 'Quechua', theme: 'Solstice', region: 'Andes' }
    },
    {
        title: 'Ofada Rice & Ayamase Stew',
        description: 'A deeply traditional Yoruba delicacy, known for its distinct aroma and spicy companion stew.',
        content: 'Ofada rice is a unique, unpolished short-grain rice grown primarily in South-Western Nigeria...',
        type: 'cuisine',
        author: { name: 'Folake Adeleke', avatar: 'https://i.pravatar.cc/150?u=folake', badges: ['Culinary Custodian'] },
        location: { lat: 6.8833, lng: 3.5500, city: 'Ofada Town', country: 'Nigeria' },
        createdAt: '2024-03-08T14:00:00Z',
        validationCount: 112, invalidationCount: 0, isValidated: true,
        status: 'Community Verified',
        images: ['https://images.unsplash.com/photo-1596560548464-f010549b84d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'],
        comments: [],
        metadata: { tribe: 'Yoruba', language: 'Yoruba', theme: 'Gastronomy', region: 'West Africa' }
    }
];

export async function seedEntries(): Promise<{ seeded: number; skipped: string }> {
    const snapshot = await getDocs(collection(db, 'entries'));
    if (!snapshot.empty) {
        return { seeded: 0, skipped: `Already seeded — ${snapshot.size} entries exist in Firestore.` };
    }

    for (const entry of SEED_ENTRIES) {
        await addDoc(collection(db, 'entries'), entry);
    }

    return { seeded: SEED_ENTRIES.length, skipped: '' };
}
