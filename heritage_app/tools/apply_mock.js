const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync('tools/mock_payload.json', 'utf8'));

const mockDataContent = `import { CulturalEntry } from '@/types';\n\nexport const MOCK_ENTRIES: CulturalEntry[] = ${JSON.stringify(data.entries, null, 4)};\n`;
fs.writeFileSync('src/data/mockData.ts', mockDataContent);

const mockUsersContent = `import { UserProfile } from '@/types';\n\nexport const MOCK_USERS: UserProfile[] = ${JSON.stringify(data.users, null, 4)};\n\nexport const CURRENT_USER: UserProfile = MOCK_USERS[0];\n`;
fs.writeFileSync('src/data/mockUsers.ts', mockUsersContent);

console.log('Successfully updated mockData.ts and mockUsers.ts');
