import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const replacements = {
  // Critical Spain Spanish to Latin American Spanish
  'os ha engañado a todos': 'los ha engañado a todos',
  'os ha engañado': 'los ha engañado',
  'os habéis': 'se han',
  'os he': 'les he',
  'os hemos': 'les hemos',
  'os ha': 'los ha',
  'os haya': 'los haya',
  'os hayamos': 'los hayamos',
  'os hayáis': 'los hayan',
  'os hayan': 'los hayan',
  'vosotros': 'ustedes',
  'vosotras': 'ustedes',
  'erais niños': 'eran niños',
  'cuando erais': 'cuando eran',
  'habéis': 'han',
  'podéis': 'pueden',
  'queréis': 'quieren',
  'sabéis': 'saben',
  'decís': 'dicen',
  'hacéis': 'hacen',
  'tenéis': 'tienen',
  'sois': 'son',
  'estáis': 'están',
  'váis': 'van',
  'venís': 'vienen',
  'traéis': 'traen',
  'salís': 'salen',
  'entráis': 'entran',
  'llegáis': 'llegan',
  'veis': 'ven',
  'oís': 'oyen',
  'coméis': 'comen',
  'bebéis': 'beben',
  'vivís': 'viven',
  'partís': 'parten',
  'recibís': 'reciben',
  'abríais': 'abrían',
  'cerráis': 'cierran',
  'dormís': 'duermen',
  'sentís': 'sienten',
  'pedís': 'piden',
  'servís': 'sirven',
  'seguís': 'siguen',
  'conseguís': 'consiguen',
  'perseguís': 'persiguen',
  'elegís': 'eligen',
  'recogéis': 'recogen',
  'protegéis': 'protegen',
  'dirigís': 'dirigen',
  'exigís': 'exigen',
  'afligís': 'afligen',
  'infligís': 'infligen',
  'erigís': 'erigen',
  'transigís': 'transigen',
  'corregís': 'corrigen',
  'regís': 'rigen',
  'surgís': 'surgen',
  'convergís': 'convergen',
  'divergís': 'divergen',
  'emergís': 'emergen',
  'sumergís': 'sumergen',
  'Presentaos': 'Preséntense',
  'Escribid': 'Escriban',
  'Escribid vuestro': 'Escriban su',
  'vuestro': 'su',
  'vuestros': 'sus',
  'vuestra': 'su',
  'vuestras': 'sus',
};

function replaceInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    for (const [spain, latin] of Object.entries(replacements)) {
      const regex = new RegExp(`\\b${spain}\\b`, 'gi');
      if (regex.test(content)) {
        content = content.replace(regex, (match) => {
          // Preserve case
          if (match[0] === match[0].toUpperCase()) {
            return latin.charAt(0).toUpperCase() + latin.slice(1);
          }
          return latin;
        });
        modified = true;
      }
    }

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✓ Fixed: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Skip node_modules and .git
      if (!file.startsWith('.') && file !== 'node_modules') {
        walkDir(filePath);
      }
    } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.jsx') || file.endsWith('.js') || file.endsWith('.mjs')) {
      replaceInFile(filePath);
    }
  });
}

const clientDir = path.join(__dirname, '../client/src');
const serverDir = path.join(__dirname, '../server');

console.log('Fixing Spanish Spain to Latin American Spanish...\n');
walkDir(clientDir);
walkDir(serverDir);
console.log('\n✅ All files processed!');
