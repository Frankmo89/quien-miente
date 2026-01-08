// Script to replace Spain Spanish with Latin American Spanish
const fs = require('fs');
const path = require('path');

const replacements = {
  // Common Spain Spanish to Latin American Spanish
  'os ha engañado': 'los ha engañado',
  'os habéis': 'se han',
  'os he': 'les he',
  'os hemos': 'les hemos',
  'os ha': 'los ha',
  'os haya': 'los haya',
  'os hayamos': 'los hayamos',
  'os hayáis': 'los hayan',
  'os hayan': 'los hayan',
  'os': 'les', // General replacement for "os"
  'vosotros': 'ustedes',
  'vosotras': 'ustedes',
  'erais': 'eran',
  'erais niños': 'eran niños',
  'cuando erais': 'cuando eran',
  'papás': 'papás',
  'mamá': 'mamá',
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
  'sumergís': 'sumergen',
  'os': 'les',
  'Presentaos': 'Preséntense',
  'Presentaos,': 'Preséntense,',
  'Escribid': 'Escriban',
  'Escribid vuestro': 'Escriban su',
  'Elige tu avatar': 'Elige tu avatar',
  'Añadir Jugador': 'Añadir Jugador',
  'Volver': 'Volver',
  'Volver al Inicio': 'Volver al Inicio',
  'CONTINUAR': 'CONTINUAR',
  'Jugar otra vez': 'Jugar otra vez',
  'Cambiar de juego': 'Cambiar de juego',
  'Desbloquear por': 'Desbloquear por',
  'Desbloqueado': 'Desbloqueado',
  'GRATIS': 'GRATIS',
  'Familiar y Adultos': 'Familiar y Adultos',
  'Familiar': 'Familiar',
  'Adultos': 'Adultos',
};

function replaceInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    for (const [spain, latin] of Object.entries(replacements)) {
      const regex = new RegExp(spain, 'gi');
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
    } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.jsx') || file.endsWith('.js')) {
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
