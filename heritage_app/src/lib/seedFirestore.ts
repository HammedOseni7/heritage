import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';

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

const SEED_USERS = [
    { id: 'user_benin', email: 'osaro@benin.ng', username: 'BronzeGuardian', firstName: 'Osaro', lastName: 'Idah', avatar: 'https://i.pravatar.cc/150?u=osaro', bio: 'Historian specializing in the Kingdom of Benin and Bronzes.', points: 2450, badgeLevel: 'Legacy Guardian', country: 'Nigeria', region: 'Africa' },
    { id: 'user_maya', email: 'ximena@chichen.mx', username: 'MayaScholar', firstName: 'Ximena', lastName: 'Cano', avatar: 'https://i.pravatar.cc/150?u=ximena', bio: 'Epigrapher of Mayan hieroglyphs and astronomy.', points: 1890, badgeLevel: 'Heritage Keeper', country: 'Mexico', region: 'Americas' },
    { id: 'user_petra', email: 'omar@petra.jo', username: 'DesertRose', firstName: 'Omar', lastName: 'Zaid', avatar: 'https://i.pravatar.cc/150?u=omar', bio: 'Archeologist focused on Nabataean water systems.', points: 2100, badgeLevel: 'Legacy Guardian', country: 'Jordan', region: 'Asia' },
    { id: 'user_aboriginal', email: 'billong@dreamtime.au', username: 'DreamWalker', firstName: 'Billong', lastName: 'Yidaki', avatar: 'https://i.pravatar.cc/150?u=billong', bio: 'Custodian of the Yolngu songlines and oral history.', points: 3400, badgeLevel: 'Legacy Guardian', country: 'Australia', region: 'Oceania' },
    { id: 'user_venice', email: 'giulia@venezia.it', username: 'Serenissima', firstName: 'Giulia', lastName: 'Moro', avatar: 'https://i.pravatar.cc/150?u=giulia', bio: 'Restoration expert for Venetian Renaissance architecture.', points: 920, badgeLevel: 'Heritage Keeper', country: 'Italy', region: 'Europe' },
    { id: 'user_japan', email: 'akio@kyoto.jp', username: 'ZenMaster', firstName: 'Akio', lastName: 'Tanaka', avatar: 'https://i.pravatar.cc/150?u=akio', bio: 'Kyoto-based master of the tea ceremony and garden design.', points: 1550, badgeLevel: 'Legacy Guardian', country: 'Japan', region: 'Asia' },
    { id: 'user_ethiopia', email: 'selam@lalibela.et', username: 'RockChurch', firstName: 'Selam', lastName: 'Berhe', avatar: 'https://i.pravatar.cc/150?u=selam', bio: 'Theologian and historian of the rock-hewn churches.', points: 640, badgeLevel: 'Cultural Spotter', country: 'Ethiopia', region: 'Africa' },
    { id: 'user_india', email: 'priya@varanasi.in', username: 'GangesSoul', firstName: 'Priya', lastName: 'Iyer', avatar: 'https://i.pravatar.cc/150?u=priya', bio: 'Scholar of ancient Sanskrit and Varanasi ritual arts.', points: 880, badgeLevel: 'Heritage Keeper', country: 'India', region: 'Asia' },
    { id: 'user_egypt', email: 'youssef@cairo.eg', username: 'PharaohFan', firstName: 'Youssef', lastName: 'Hassan', avatar: 'https://i.pravatar.cc/150?u=youssef', bio: 'Guide to the Giza plateau and hieroglyphic translation.', points: 410, badgeLevel: 'Cultural Spotter', country: 'Egypt', region: 'Africa' },
    { id: 'user_greece', email: 'eleni@athens.gr', username: 'AgoraSpirit', firstName: 'Eleni', lastName: 'Pappa', avatar: 'https://i.pravatar.cc/150?u=eleni', bio: 'Classical archaeologist specializing in Parthenon friezes.', points: 1200, badgeLevel: 'Heritage Keeper', country: 'Greece', region: 'Europe' },
    { id: 'user_brolaja', email: 'brolaja@gmail.com', username: 'brolaja', firstName: 'Brolaja', lastName: 'Admin', avatar: 'https://i.pravatar.cc/150?u=brolaja', bio: 'Platform administrator and heritage guardian with full submission privileges.', points: 9999, badgeLevel: 'Legacy Guardian', country: 'Nigeria', region: 'Africa', isAdmin: true, isElderVerified: true, bypassValidation: true }
];

const SEED_ENTRIES = [
    {
        title: 'The Benin Bronzes: Spirits of the Kingdom',
        description: 'Masterpieces of metalwork from the historic Kingdom of Benin, depicting kings and warfare.',
        content: 'Constructed from brass and bronze, these plaques decorated the royal palace in Benin City. They represent a high point of West African art, detailing the lineage of the Obas (Kings) and complex administrative systems of the 16th century.',
        type: 'craft',
        author: { name: 'Osaro Idah', avatar: 'https://i.pravatar.cc/150?u=osaro', badges: ['Grand Historian'] },
        location: { lat: 6.3333, lng: 5.6222, city: 'Benin City', country: 'Nigeria' },
        createdAt: new Date().toISOString(),
        validationCount: 450, invalidationCount: 0, isValidated: true,
        status: 'Community Verified', images: ['https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?q=80&w=1000', 'https://images.unsplash.com/photo-1503174971373-b1f69850bbd6?q=80&w=1000'],
        isElderVerified: true, hasSimulation: true, simulationType: 'chat', comments: [],
        metadata: { tribe: 'Edo', theme: 'Royal Art', region: 'Africa' }
    },
    {
        title: 'Chichen Itza: The Descent of Kukulcan',
        description: 'The monumental Mayan city-state, known for its advanced astronomical alignments.',
        content: 'During the spring and autumn equinoxes, the shadow of the El Castillo pyramid mimics a serpent descending the stairs—a tribute to Kukulcan. This architectural marvel proves the Mayas advanced knowledge of the solar calendar.',
        type: 'festival',
        author: { name: 'Ximena Cano', avatar: 'https://i.pravatar.cc/150?u=ximena', badges: ['Astronomer'] },
        location: { lat: 20.6843, lng: -88.5678, city: 'Yucatán', country: 'Mexico' },
        createdAt: new Date().toISOString(),
        validationCount: 890, invalidationCount: 1, isValidated: true,
        status: 'Community Verified', images: ['https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000'],
        has3DModel: true, audioUrl: 'https://actions.google.com/sounds/v1/ambiences/natural_wind.ogg',
        metadata: { tribe: 'Maya', theme: 'Astronomy', region: 'Americas' }
    },
    {
        title: 'Petra: The Rose-Red City of Nabataeans',
        description: 'A masterpiece of architecture carved directly into vibrant sandstone cliffs.',
        content: 'Petra was the thriving capital of the Nabataean Empire between 400 BC and AD 106. Its most famous structure, Al-Khazneh (The Treasury), showcases an intricate fusion of Hellenistic and Eastern architectural styles.',
        type: 'craft',
        author: { name: 'Omar Zaid', avatar: 'https://i.pravatar.cc/150?u=omar', badges: ['Custodian'] },
        location: { lat: 30.3285, lng: 35.4444, city: 'Ma\'an', country: 'Jordan' },
        createdAt: new Date().toISOString(),
        validationCount: 1200, invalidationCount: 0, isValidated: true,
        status: 'Community Verified', images: ['https://images.unsplash.com/photo-1580193103504-471f40097162?q=80&w=1000'],
        hasSimulation: true, simulationType: 'chat',
        metadata: { theme: 'Rock-Cut Architecture', region: 'Asia' }
    },
    {
        title: 'Dreamtime: The Rainbow Serpent',
        description: 'The fundamental creation story of Australian Aboriginal spirituality.',
        content: 'The Rainbow Serpent (Wagyl) is the creator of the world in many Aboriginal cultures. It carved the rivers and valleys across the land as it moved. These stories are passed down through "songlines" that function as maps.',
        type: 'story',
        author: { name: 'Billong Yidaki', avatar: 'https://i.pravatar.cc/150?u=billong', badges: ['Songman'] },
        location: { lat: -12.4634, lng: 130.8456, city: 'Darwin', country: 'Australia' },
        createdAt: new Date().toISOString(),
        validationCount: 3000, invalidationCount: 0, isValidated: true,
        status: 'Community Verified', images: ['https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=1000'],
        isElderVerified: true, hasSimulation: true, simulationType: 'chat',
        metadata: { tribe: 'Yolngu', language: 'Yolngu Matha', theme: 'Cosmology', region: 'Oceania' }
    },
    {
        title: 'Lalibela: The New Jerusalem',
        description: 'Monolithic rock-hewn churches of Ethiopia, carved from the top down.',
        content: 'The 11 medieval churches of Lalibela remain a place of pilgrimage for Orthodox Christians. The church of St. George (Bete Giyorgis) is the most famous, carved in the shape of a cross directly into volcanic tuff.',
        type: 'craft',
        author: { name: 'Selam Berhe', avatar: 'https://i.pravatar.cc/150?u=selam', badges: ['Theologian'] },
        location: { lat: 12.0333, lng: 39.0333, city: 'Lalibela', country: 'Ethiopia' },
        createdAt: new Date().toISOString(),
        validationCount: 420, invalidationCount: 0, isValidated: true,
        status: 'Community Verified', images: ['https://images.unsplash.com/photo-1560969562-b13c873fcc94?q=80&w=1000'],
        metadata: { theme: 'Sacred Architecture', region: 'Africa' }
    },
    {
        title: 'Kyoto Zen Gardens: The Karesansui',
        description: 'Dry landscape gardens designed to stimulate meditation and spiritual growth.',
        content: 'Zen gardens like Ryoan-ji use rocks and raked gravel to represent islands and water. They are physical manifestations of the Zen philosophy of simplicity and interconnectedness.',
        type: 'medicine',
        author: { name: 'Akio Tanaka', avatar: 'https://i.pravatar.cc/150?u=akio', badges: ['Zen Master'] },
        location: { lat: 35.0392, lng: 135.7285, city: 'Kyoto', country: 'Japan' },
        createdAt: new Date().toISOString(),
        validationCount: 155, invalidationCount: 0, isValidated: true,
        status: 'Community Verified', images: ['https://images.unsplash.com/photo-1545048702-79362596cdc9?q=80&w=1000'],
        hasSimulation: true, simulationType: 'chat',
        metadata: { theme: 'Spiritual Well-being', region: 'Asia' }
    },
    {
        title: 'The Varanasi Ghats: Rituals of Life & Death',
        description: 'The sacred riverfront of the Ganges, where thousands years of tradition remain unbroken.',
        content: 'Varanasi is one of the oldest living cities in the world. The evening Ganga Aarti ritual, with lamps floating on the river, is a profound expression of Hindu devotion and the cycle of rebirth.',
        type: 'festival',
        author: { name: 'Priya Iyer', avatar: 'https://i.pravatar.cc/150?u=priya', badges: ['Scholar'] },
        location: { lat: 25.3176, lng: 82.9739, city: 'Varanasi', country: 'India' },
        createdAt: new Date().toISOString(),
        validationCount: 560, invalidationCount: 12, isValidated: true,
        status: 'Community Verified', images: ['https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=1000'],
        metadata: { theme: 'Sacred Rituals', region: 'Asia' }
    },
    {
        title: 'Masai Jumping Dance: The Adumu',
        description: 'The iconic rite of passage for Young Masai warriors (Moran).',
        content: 'The Adumu is performed during the Eunoto ceremony. Warriors jump as high as they can to show their strength, agility, and eligibility to lead the tribe. It is accompanied by deep, rhythmic chanting.',
        type: 'festival',
        author: { name: 'Leshari Ole', avatar: 'https://i.pravatar.cc/150?u=masai', badges: ['Warrior'] },
        location: { lat: -1.2833, lng: 36.8167, city: 'Maasai Mara', country: 'Kenya' },
        createdAt: new Date().toISOString(),
        validationCount: 45, invalidationCount: 0, isValidated: false,
        status: 'Pending', images: ['https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=1000'],
        metadata: { tribe: 'Maasai', region: 'Africa' }
    },
    {
        title: 'Venetian Carnival Masks: Commedia dell\'Arte',
        description: 'The centuries-old tradition of masked anonymity during the Venice Carnival.',
        content: 'Masks like the Bauta and Volto allowed Venetians to participate in society regardless of class. Each design has its own history and role in the theater of the streets.',
        type: 'craft',
        author: { name: 'Giulia Moro', avatar: 'https://i.pravatar.cc/150?u=giulia', badges: ['Artisan'] },
        location: { lat: 45.4408, lng: 12.3155, city: 'Venice', country: 'Italy' },
        createdAt: new Date().toISOString(),
        validationCount: 120, invalidationCount: 0, isValidated: true,
        status: 'Community Verified', images: ['https://images.unsplash.com/photo-1542646272-511ce630737a?q=80&w=1000'],
        metadata: { theme: 'Social Traditions', region: 'Europe' }
    },
    {
        title: 'The Great Wall: Stone & Soul',
        description: 'The world\'s longest defensive system, a marvel of ancient engineering.',
        content: 'Spanning thousands of miles, the Wall protected the Silk Road and unified the empire. It is a symbol of Chinese persistence and architectural ingenuity through multiple dynasties.',
        type: 'craft',
        author: { name: 'Li Wei', avatar: 'https://i.pravatar.cc/150?u=li', badges: ['Structural Historian'] },
        location: { lat: 40.4319, lng: 116.5704, city: 'Mutianyu', country: 'China' },
        createdAt: new Date().toISOString(),
        validationCount: 220, invalidationCount: 0, isValidated: true,
        status: 'Community Verified', images: ['https://images.unsplash.com/photo-1508804185872-d7badad00f7d?q=80&w=1000'],
        metadata: { theme: 'Military Architecture', region: 'Asia' }
    }
];

async function clearCollection(collectionName: string) {
    const snapshot = await getDocs(collection(db, collectionName));
    const promises = snapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(promises);
}

export async function seedUsers(force: boolean = false): Promise<{ seeded: number; skipped: string }> {
    const snapshot = await getDocs(collection(db, 'users'));
    if (!snapshot.empty && !force) {
        return { seeded: 0, skipped: `Already seeded — ${snapshot.size} users exist.` };
    }

    if (force) await clearCollection('users');

    for (const user of SEED_USERS) {
        await setDoc(doc(db, 'users', user.id), user);
    }

    return { seeded: SEED_USERS.length, skipped: '' };
}

export async function seedEntries(force: boolean = false): Promise<{ seeded: number; skipped: string }> {
    const snapshot = await getDocs(collection(db, 'entries'));
    if (!snapshot.empty && !force) {
        return { seeded: 0, skipped: `Already seeded — ${snapshot.size} entries exist.` };
    }

    if (force) await clearCollection('entries');

    for (const entry of SEED_ENTRIES) {
        await addDoc(collection(db, 'entries'), entry);
    }

    return { seeded: SEED_ENTRIES.length, skipped: '' };
}
