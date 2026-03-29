const fs = require('fs');

const types = ['story', 'game', 'medicine', 'cuisine', 'craft', 'festival'];
const regions = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania', 'Middle East'];

const entries = [
    {
        id: 'demo_benin',
        title: 'The Benin Bronzes: Spirits of the Kingdom',
        description: 'Masterpieces of metalwork from the historic Kingdom of Benin, depicting kings and warfare.',
        content: 'Constructed from brass and bronze, these plaques decorated the royal palace in Benin City. They represent a high point of West African art, detailing the lineage of the Obas (Kings) and complex administrative systems of the 16th century.',
        type: 'craft',
        author: { name: 'Osaro Idah', avatar: 'https://i.pravatar.cc/150?u=osaro', badges: ['Grand Historian'] },
        location: { lat: 6.3333, lng: 5.6222, city: 'Benin City', country: 'Nigeria' },
        createdAt: new Date().toISOString(),
        validationCount: 450, invalidationCount: 0, isValidated: true,
        status: 'Community Verified', images: ['https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?q=80&w=1000', 'https://images.unsplash.com/photo-1503174971373-b1f69850bbd6?q=80&w=1000'],
        isElderVerified: true,
        metadata: { tribe: 'Edo', theme: 'Royal Art', region: 'Africa' }
    },
    {
        id: 'demo_chichen',
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
        id: 'demo_petra',
        title: 'Petra: The Rose-Red City of Nabataeans',
        description: 'A masterpiece of architecture carved directly into vibrant sandstone cliffs.',
        content: 'Petra was the thriving capital of the Nabataean Empire between 400 BC and AD 106. Its most famous structure, Al-Khazneh (The Treasury), showcases an intricate fusion of Hellenistic and Eastern architectural styles.',
        type: 'craft',
        author: { name: 'Omar Zaid', avatar: 'https://i.pravatar.cc/150?u=omar', badges: ['Custodian'] },
        location: { lat: 30.3285, lng: 35.4444, city: 'Ma\'an', country: 'Jordan' },
        createdAt: new Date().toISOString(),
        validationCount: 1200, invalidationCount: 0, isValidated: true,
        status: 'Community Verified', images: ['https://images.unsplash.com/photo-1580193103504-471f40097162?q=80&w=1000'],
        metadata: { theme: 'Rock-Cut Architecture', region: 'Asia' }
    },
    {
        id: 'demo_dreamtime',
        title: 'Dreamtime: The Rainbow Serpent',
        description: 'The fundamental creation story of Australian Aboriginal spirituality.',
        content: 'The Rainbow Serpent (Wagyl) is the creator of the world in many Aboriginal cultures. It carved the rivers and valleys across the land as it moved. These stories are passed down through "songlines" that function as maps.',
        type: 'story',
        author: { name: 'Billong Yidaki', avatar: 'https://i.pravatar.cc/150?u=billong', badges: ['Songman'] },
        location: { lat: -12.4634, lng: 130.8456, city: 'Darwin', country: 'Australia' },
        createdAt: new Date().toISOString(),
        validationCount: 3000, invalidationCount: 0, isValidated: true,
        status: 'Community Verified', images: ['https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=1000'],
        isElderVerified: true,
        metadata: { tribe: 'Yolngu', language: 'Yolngu Matha', theme: 'Cosmology', region: 'Oceania' }
    }
];

const users = [
    { id: 'u_1', username: 'AztecSeeker', firstName: 'Mateo', lastName: 'Hernandez', country: 'Mexico', region: 'Americas', bio: 'Archaeologist specialized in Mesoamerican civilizations.', points: 1500, badgeLevel: 'Legacy Guardian', avatar: 'https://i.pravatar.cc/150?u=u_1' },
    { id: 'u_2', username: 'NileWhisper', firstName: 'Amira', lastName: 'Said', country: 'Egypt', region: 'Africa', bio: 'Egyptologist focusing on the New Kingdom.', points: 1200, badgeLevel: 'Heritage Keeper', avatar: 'https://i.pravatar.cc/150?u=u_2' },
    { id: 'u_3', username: 'HellenicSoul', firstName: 'Nikos', lastName: 'Pappas', country: 'Greece', region: 'Europe', bio: 'Classical scholar and landscape historian.', points: 1100, badgeLevel: 'Heritage Keeper', avatar: 'https://i.pravatar.cc/150?u=u_3' },
    { id: 'u_4', username: 'SilkRoadSage', firstName: 'Wei', lastName: 'Chen', country: 'China', region: 'Asia', bio: 'Expert in Tang Dynasty trade and culture.', points: 1400, badgeLevel: 'Legacy Guardian', avatar: 'https://i.pravatar.cc/150?u=u_4' },
    { id: 'u_5', username: 'YorubaKing', firstName: 'Oladipo', lastName: 'Ojo', country: 'Nigeria', region: 'Africa', bio: 'Oral historian of the Oyo Empire.', points: 1300, badgeLevel: 'Heritage Keeper', avatar: 'https://i.pravatar.cc/150?u=u_5' },
    { id: 'u_6', username: 'RenaissanceMan', firstName: 'Leonardo', lastName: 'Rossi', country: 'Italy', region: 'Europe', bio: 'Architectural historian of Florence.', points: 950, badgeLevel: 'Cultural Spotter', avatar: 'https://i.pravatar.cc/150?u=u_6' },
    { id: 'u_7', username: 'ShogunScholar', firstName: 'Kenji', lastName: 'Sato', country: 'Japan', region: 'Asia', bio: 'Specialist in Edo period social structures.', points: 1600, badgeLevel: 'Legacy Guardian', avatar: 'https://i.pravatar.cc/150?u=u_7' },
    { id: 'u_8', username: 'VedicVoice', firstName: 'Anjali', lastName: 'Sharma', country: 'India', region: 'Asia', bio: 'Sanskrit scholar and ritual expert.', points: 1250, badgeLevel: 'Heritage Keeper', avatar: 'https://i.pravatar.cc/150?u=u_8' },
    { id: 'u_9', username: 'BushWalker', firstName: 'Jarrah', lastName: 'Aboriginal', country: 'Australia', region: 'Oceania', bio: 'Custodian of Aboriginal dreamtime stories.', points: 2000, badgeLevel: 'Legacy Guardian', avatar: 'https://i.pravatar.cc/150?u=u_9' },
    { id: 'u_10', username: 'AmazonProtect', firstName: 'Cauã', lastName: 'Silva', country: 'Brazil', region: 'Americas', bio: 'Indigenous rights activist and ethnobotanist.', points: 880, badgeLevel: 'Cultural Spotter', avatar: 'https://i.pravatar.cc/150?u=u_10' },
    { id: 'u_11', username: 'FirstNations', firstName: 'Aiyana', lastName: 'Running', country: 'Canada', region: 'Americas', bio: 'Preserver of Haida art and storytelling.', points: 1150, badgeLevel: 'Heritage Keeper', avatar: 'https://i.pravatar.cc/150?u=u_11' },
    { id: 'u_12', username: 'SavannahSpirit', firstName: 'Kipkoech', lastName: 'Rutto', country: 'Kenya', region: 'Africa', bio: 'Historian of the Great Rift Valley.', points: 720, badgeLevel: 'Cultural Spotter', avatar: 'https://i.pravatar.cc/150?u=u_12' },
    { id: 'u_13', username: 'PersianArtes', firstName: 'Parviz', lastName: 'Karimi', country: 'Iran', region: 'Middle East', bio: 'Master weaver and carpet historian.', points: 1800, badgeLevel: 'Legacy Guardian', avatar: 'https://i.pravatar.cc/150?u=u_13' },
    { id: 'u_14', username: 'GothicGuide', firstName: 'Claire', lastName: 'Dubois', country: 'France', region: 'Europe', bio: 'Stained glass restoration expert.', points: 1050, badgeLevel: 'Heritage Keeper', avatar: 'https://i.pravatar.cc/150?u=u_14' },
    { id: 'u_15', username: 'BatikMaster', firstName: 'Budi', lastName: 'Santoso', country: 'Indonesia', region: 'Asia', bio: 'Javanese batik philosophy teacher.', points: 1450, badgeLevel: 'Heritage Keeper', avatar: 'https://i.pravatar.cc/150?u=u_15' },
    { id: 'u_16', username: 'IncaDescendant', firstName: 'Yuri', lastName: 'Cusihuallpa', country: 'Peru', region: 'Americas', bio: 'Quechua language and textile expert.', points: 1350, badgeLevel: 'Heritage Keeper', avatar: 'https://i.pravatar.cc/150?u=u_16' },
    { id: 'u_17', username: 'LotusHealer', firstName: 'Mai', lastName: 'Nguyen', country: 'Vietnam', region: 'Asia', bio: 'Traditional medicine practitioner.', points: 900, badgeLevel: 'Cultural Spotter', avatar: 'https://i.pravatar.cc/150?u=u_17' },
    { id: 'u_18', username: 'CoffeeKing', firstName: 'Abebe', lastName: 'Bikila', country: 'Ethiopia', region: 'Africa', bio: 'Custodian of the coffee ceremony history.', points: 820, badgeLevel: 'Cultural Spotter', avatar: 'https://i.pravatar.cc/150?u=u_18' },
    { id: 'u_19', username: 'AtlasScholar', firstName: 'Fatima', lastName: 'Zahra', country: 'Morocco', region: 'Africa', bio: 'Expert in Berber architecture.', points: 1100, badgeLevel: 'Heritage Keeper', avatar: 'https://i.pravatar.cc/150?u=u_19' },
    { id: 'u_20', username: 'SiamSoul', firstName: 'Somchai', lastName: 'Preecha', country: 'Thailand', region: 'Asia', bio: 'Preserver of traditional Thai dance (Khon).', points: 1000, badgeLevel: 'Heritage Keeper', avatar: 'https://i.pravatar.cc/150?u=u_20' }
].map(u => ({ ...u, email: `${u.username.toLowerCase()}@heritage.org`, contributions: [] }));

const premiumImages = [
    '1548013146-72479768bbaa', '1518709268805-4e9042af9f23', '1580193103504-471f40097162', '1502082553048-f009c37129b9',
    '1560969562-b13c873fcc94', '1545048702-79362596cdc9', '1524492412937-b28074a5d7da', '1516026672322-bc52d61a55d5',
    '1542646272-511ce630737a', '1508804185872-d7badad00f7d', '1526392060635-9d6019884377', '1544376798-89aa6b82c6cd',
    '1603566622288-06cf4553e198', '1503177119275-0aa32b3a744a', '1461955431633-91b4ca562136', '1552832230-c0197dd311b5',
    '1599427303058-f17cbcd43908', '1545459724-c18449bfabb8', '1493976040374-85c8e967a041', '1566438480900-0609be27a4be'
];

// Append more generated entries
for (let i = 1; i <= 100; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const type = types[i % types.length];
    const region = user.region;
    const imgId = premiumImages[i % premiumImages.length];
    
    entries.push({
        id: `demo_scaled_${i}`,
        title: `${type.charAt(0).toUpperCase() + type.slice(1)} Discovery #${i}: ${region} Heritage`,
        description: `Protecting the legacy of ${region} through this unique ${type} tradition.`,
        content: `Detailed documentation of the historical significance, methods, and community impact of this ${region} ${type}. This entry was generated to demonstrate the scale and global reach of our encyclopedia.`,
        type: type,
        author: {
            name: user.username,
            avatar: user.avatar,
            badges: [user.badgeLevel]
        },
        location: {
            lat: (Math.random() * 120 - 60),
            lng: (Math.random() * 240 - 120),
            city: `City_${i}`,
            country: user.country
        },
        createdAt: new Date(Date.now() - Math.random() * 1000000000).toISOString(),
        validationCount: Math.floor(Math.random() * 500),
        invalidationCount: Math.floor(Math.random() * 5),
        isValidated: Math.random() > 0.3,
        status: Math.random() > 0.3 ? 'Community Verified' : 'Pending',
        images: [`https://images.unsplash.com/photo-${imgId}?q=80&w=1000`],
        metadata: {
            theme: `${type.charAt(0).toUpperCase() + type.slice(1)} Excellence`,
            region: region
        }
    });
}

const data = { users, entries };
fs.writeFileSync('tools/mock_payload.json', JSON.stringify(data, null, 2), 'utf8');
console.log('Successfully generated tools/mock_payload.json');
