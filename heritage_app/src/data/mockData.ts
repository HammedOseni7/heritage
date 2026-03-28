import { CulturalEntry } from '@/types';

export const MOCK_ENTRIES: CulturalEntry[] = [
    {
        id: '1',
        title: 'The Legend of the Silver River',
        description: 'An ancient oral tradition from the Guarani people about the origin of the Milky Way.',
        content: 'The Guarani people believe that the Milky Way is a celestial path where souls travel...',
        type: 'story',
        author: {
            name: 'Elena Rojas',
            avatar: 'https://i.pravatar.cc/150?u=elena',
            badges: ['Storyteller']
        },
        location: {
            lat: -25.5,
            lng: -54.5,
            city: 'Puerto Iguazú',
            country: 'Argentina'
        },
        createdAt: '2024-03-01T10:00:00Z',
        validationCount: 42,
        invalidationCount: 0,
        isValidated: true,
        status: 'Community Verified',
        images: ['/images/silver_river.png'],
        isElderVerified: true,
        audioUrl: 'https://actions.google.com/sounds/v1/water/waves_crashing_on_rock_beach.ogg',
        hasSimulation: true,
        simulationType: 'chat',
        metadata: {
            tribe: 'Guarani',
            language: 'Guarani',
            theme: 'Mythology',
            region: 'South America'
        }
    },
    {
        id: '2',
        title: 'Mancala Strategy: The Opening Gambit',
        description: 'Traditional rules and advanced opening strategies for the ancient game of Mancala.',
        content: 'Mancala is one of the oldest known board games. The opening move often dictates the flow...',
        type: 'game',
        author: {
            name: 'Moussa Diop',
            avatar: 'https://i.pravatar.cc/150?u=moussa',
            badges: ['Grandmaster']
        },
        location: {
            lat: 14.7,
            lng: -17.4,
            city: 'Dakar',
            country: 'Senegal'
        },
        createdAt: '2024-03-05T11:20:00Z',
        validationCount: 28,
        invalidationCount: 0,
        isValidated: true,
        status: 'Community Verified',
        images: ['/images/mancala.png'],
        has3DModel: true,
        hasSimulation: true,
        simulationType: 'mancala',
        metadata: {
            theme: 'Strategy',
            region: 'West Africa',
            tribe: 'Wolof'
        }
    },
    {
        id: '3',
        title: 'Himalayan Healing Herbs',
        description: 'Traditional knowledge of medicinal plants found in the high altitude of the Himalayas.',
        content: 'For generations, the sherpas have used the Blue Poppy for respiratory ailments...',
        type: 'medicine',
        author: {
            name: 'Tenzin Gyatso',
            avatar: 'https://i.pravatar.cc/150?u=tenzin',
            badges: ['Healer']
        },
        location: {
            lat: 27.9,
            lng: 86.9,
            city: 'Namche Bazaar',
            country: 'Nepal'
        },
        createdAt: '2024-03-02T14:30:00Z',
        validationCount: 156,
        invalidationCount: 0,
        isValidated: true,
        status: 'Community Verified',
        images: ['/images/herbs.png'],
        isElderVerified: true,
        hasSimulation: true,
        simulationType: 'chat',
        metadata: {
            tribe: 'Sherpa',
            language: 'Sherpa',
            theme: 'Herbal Remedies',
            region: 'Himalayas'
        }
    },
    {
        id: '4',
        title: 'Jollof Rice: The West African Soul',
        description: 'A deep dive into the cultural significance and regional variations of Jollof rice.',
        content: 'Whether it is the Nigerian smoky variety or the Senegalese Thieboudienne, Jollof is more than food...',
        type: 'cuisine',
        author: {
            name: 'Amina Okafor',
            avatar: 'https://i.pravatar.cc/150?u=amina',
            badges: ['Chef']
        },
        location: {
            lat: 6.5,
            lng: 3.4,
            city: 'Lagos',
            country: 'Nigeria'
        },
        createdAt: '2024-03-06T18:00:00Z',
        validationCount: 2,
        invalidationCount: 0,
        isValidated: false,
        status: 'Pending',
        originYear: 1400,
        migrationPath: [
            { lat: 14.4974, lng: -14.4524, city: 'Saint-Louis', country: 'Senegal', year: 1400 },
            { lat: 9.0820, lng: 8.6753, city: 'Abuja', country: 'Nigeria', year: 1800 },
            { lat: 7.9465, lng: -1.0232, city: 'Accra', country: 'Ghana', year: 1900 }
        ],
        images: ['/images/jollof.png'],
        metadata: {
            region: 'West Africa',
            theme: 'Culinary Migration'
        }
    },
    {
        id: '5',
        title: 'Kente Weaving: Patterns of History',
        description: 'The geometric symbols of the Ashanti people representing concepts and aphorisms.',
        content: 'Each color in a Kente cloth has a specific meaning. Yellow represents royalty...',
        type: 'craft',
        author: {
            name: 'Kwame Mensah',
            avatar: 'https://i.pravatar.cc/150?u=kwame',
            badges: ['Artisan']
        },
        location: {
            lat: 6.6,
            lng: -1.6,
            city: 'Kumasi',
            country: 'Ghana'
        },
        createdAt: '2024-03-03T09:15:00Z',
        validationCount: 89,
        invalidationCount: 0,
        isValidated: true,
        status: 'Community Verified',
        originYear: 1000,
        migrationPath: [
            { lat: 5.6037, lng: -0.1870, city: 'Accra', country: 'Ghana', year: 1000 },
            { lat: 4.5353, lng: -7.0373, city: 'Abidjan', country: 'Ivory Coast', year: 1500 },
            { lat: 6.5244, lng: 3.3792, city: 'Lagos', country: 'Nigeria', year: 1700 }
        ],
        images: ['/images/kente.png'],
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        has3DModel: true,
        hasSimulation: true,
        simulationType: 'weaving',
        metadata: {
            tribe: 'Ashanti',
            language: 'Twi',
            theme: 'Textile Art',
            region: 'West Africa'
        }
    },
    {
        id: '6',
        title: 'Inti Raymi: Festival of the Sun',
        description: 'The ancient Incan winter solstice celebration in Cusco.',
        content: 'Inti Raymi is a religious ceremony of the Inca Empire in honor of the god Inti...',
        type: 'festival',
        author: {
            name: 'Mateo Quispe',
            avatar: 'https://i.pravatar.cc/150?u=mateo',
            badges: ['Custodian']
        },
        location: {
            lat: -13.5,
            lng: -71.9,
            city: 'Cusco',
            country: 'Peru'
        },
        createdAt: '2024-03-04T12:00:00Z',
        validationCount: 15,
        invalidationCount: 0,
        isValidated: true,
        status: 'Community Verified',
        images: ['/images/inti_raymi.png'],
        metadata: {
            tribe: 'Inca',
            language: 'Quechua',
            theme: 'Solstice',
            region: 'Andes'
        }
    },
    {
        id: '7',
        title: 'Ofada Rice & Ayamase Stew',
        description: 'A deeply traditional Yoruba delicacy, known for its distinct aroma and spicy companion stew.',
        content: 'Ofada rice is a unique, unpolished short-grain rice grown primarily in South-Western Nigeria. When paired with Ayamase (designer stew)—a spicy concoction of green peppers, locust beans (iru), and assorted meats—it becomes more than a meal; it is a cultural pillar at Yoruba owambe parties.',
        type: 'cuisine',
        author: {
            name: 'Folake Adeleke',
            avatar: 'https://i.pravatar.cc/150?u=folake',
            badges: ['Culinary Custodian']
        },
        location: {
            lat: 6.8833,
            lng: 3.5500,
            city: 'Ofada Town',
            country: 'Nigeria'
        },
        createdAt: '2024-03-08T14:00:00Z',
        validationCount: 112,
        invalidationCount: 0,
        isValidated: true,
        status: 'Community Verified',
        images: ['https://images.unsplash.com/photo-1596560548464-f010549b84d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'],
        metadata: {
            tribe: 'Yoruba',
            language: 'Yoruba',
            theme: 'Gastronomy',
            region: 'West Africa'
        }
    }
];
