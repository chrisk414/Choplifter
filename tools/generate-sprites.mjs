/**
 * Sprite PNG generator - Arcade Choplifter style
 * Run: node tools/generate-sprites.mjs
 */
import sharp from 'sharp';
import { mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..', 'public', 'assets', 'sprites');
mkdirSync(OUT_DIR, { recursive: true });

// Arcade-style color palette
const PALETTE = {
  '.': null,
  '0': [0x00, 0x00, 0x00, 255],    // black (outlines)
  '1': [0x88, 0x88, 0x88, 255],    // medium gray (heli body shadow)
  '2': [0xbb, 0xbb, 0xbb, 255],    // light gray (heli body)
  '3': [0xdd, 0xdd, 0xdd, 255],    // near-white (heli highlight)
  '4': [0x44, 0x88, 0xcc, 255],    // cockpit glass
  '5': [0x88, 0xcc, 0xee, 255],    // cockpit glass highlight
  '6': [0x33, 0x33, 0x33, 255],    // dark gray (mechanical)
  '7': [0x55, 0x55, 0x55, 255],    // gray (rotor, metal)
  '8': [0xd4, 0xa5, 0x74, 255],    // skin tone
  '9': [0xee, 0xee, 0xee, 255],    // white (hostage/clouds)
  'a': [0x8b, 0x69, 0x14, 255],    // brown (barracks)
  'b': [0x5a, 0x44, 0x10, 255],    // dark brown
  'c': [0xcc, 0x33, 0x33, 255],    // red (accents)
  'd': [0xff, 0xcc, 0x00, 255],    // yellow (bullet)
  'e': [0xff, 0x88, 0x00, 255],    // orange (explosion)
  'f': [0x44, 0x44, 0x44, 255],    // medium-dark gray
  'g': [0xc8, 0x90, 0x60, 255],    // tan (jet body)
  'h': [0xa0, 0x70, 0x48, 255],    // dark tan (jet shadow)
  'i': [0xff, 0xff, 0xff, 255],    // pure white
  'j': [0x66, 0x99, 0xcc, 255],    // steel blue (base)
  'k': [0x48, 0xa8, 0x30, 255],    // green (grass/hills)
  'l': [0xdd, 0xee, 0xff, 255],    // cloud shadow
  'm': [0xcc, 0x88, 0x44, 255],    // copper/warm accent
};

function createSprite(pixels, scale = 2) {
  const srcH = pixels.length;
  const srcW = Math.max(...pixels.map(r => r.length));
  const w = srcW * scale;
  const h = srcH * scale;
  const buf = Buffer.alloc(w * h * 4, 0);

  for (let sy = 0; sy < srcH; sy++) {
    const row = pixels[sy];
    for (let sx = 0; sx < row.length; sx++) {
      const ch = row[sx];
      const color = PALETTE[ch];
      if (!color) continue;
      for (let dy = 0; dy < scale; dy++) {
        for (let dx = 0; dx < scale; dx++) {
          const px = sx * scale + dx;
          const py = sy * scale + dy;
          const off = (py * w + px) * 4;
          buf[off] = color[0];
          buf[off + 1] = color[1];
          buf[off + 2] = color[2];
          buf[off + 3] = color[3];
        }
      }
    }
  }
  return { buf, w, h };
}

async function saveSprite(name, pixels, scale = 2) {
  const { buf, w, h } = createSprite(pixels, scale);
  const path = join(OUT_DIR, `${name}.png`);
  await sharp(buf, { raw: { width: w, height: h, channels: 4 } })
    .png()
    .toFile(path);
  console.log(`  + ${name}.png (${w}x${h})`);
}

// ============================================================
// HELICOPTER - White/gray body with red accents (arcade style)
// ============================================================
const heliRight1 = [
  '....0677777777777777776760....',  // rotor blade full
  '.............07...............',
  '.............07...............',
  '............0220..............',
  '.....012222222222220..........',
  '....0122333333333322200.......',
  '...01223333333333332221c0....',
  '...0122345533333322222100....',
  '...0122345533332222221c0....',
  '...01223333333332222110c....',
  '...01222222222222221100.....',
  '....011122222221110c........',
  '.....0..077007700..0........',
  '.......07777777770..........',
  '.......00000000000..........',
  '..............................',
];

const heliRight2 = [
  '..........06777777760.........',  // rotor short
  '.............07...............',
  '.............07...............',
  '............0220..............',
  '.....012222222222220..........',
  '....0122333333333322200.......',
  '...01223333333333332221c0....',
  '...0122345533333322222100....',
  '...0122345533332222221c0....',
  '...01223333333332222110c....',
  '...01222222222222221100.....',
  '....011122222221110c........',
  '.....0..077007700..0........',
  '.......07777777770..........',
  '.......00000000000..........',
  '..............................',
];

const heliForward1 = [
  '.067777777777777777760.',  // rotor full
  '..........07............',
  '..........07............',
  '.........0220...........',
  '.....0122222222210......',
  '....012233333322210.....',
  '...01223333333322210....',
  '...01223455543322210....',
  '...01223455543222210....',
  '...01223333333222210....',
  '...01222222222222210....',
  '....0122222222221c0.....',
  '.....0077000077c0.......',
  '....077777700777770.....',
  '....000000000000000.....',
  '........................',
];

const heliForward2 = [
  '.......0677777760........',  // rotor short
  '..........07............',
  '..........07............',
  '.........0220...........',
  '.....0122222222210......',
  '....012233333322210.....',
  '...01223333333322210....',
  '...01223455543322210....',
  '...01223455543222210....',
  '...01223333333222210....',
  '...01222222222222210....',
  '....0122222222221c0.....',
  '.....0077000077c0.......',
  '....077777700777770.....',
  '....000000000000000.....',
  '........................',
];

// ============================================================
// HOSTAGE - Small white figure
// ============================================================
const hostageWalk1 = [
  '.0880.',
  '.0880.',
  '..99..',
  '..99..',
  '.0990.',
  '..99..',
  '..99..',
  '..00..',
  '.0..0.',
  '.0..0.',
  '.0..0.',
  '......',
];

const hostageWalk2 = [
  '.0880.',
  '.0880.',
  '..99..',
  '..99..',
  '.0990.',
  '..99..',
  '..99..',
  '..00..',
  '..00..',
  '..00..',
  '..00..',
  '......',
];

const hostageWave = [
  '.0880.',
  '.0880.',
  '..998.',
  '..998.',
  '.0990.',
  '..99..',
  '..99..',
  '..00..',
  '.0..0.',
  '.0..0.',
  '.0..0.',
  '......',
];

const hostageDead = [
  '..9779..',
  '.977779.',
  '97799779',
  '77777777',
  '97799779',
  '.977779.',
  '..9779..',
  '...77...',
];

// ============================================================
// BARRACKS - Brown building with peaked roof
// ============================================================
const barracksIntact = [
  '...............0aa0.............',
  '..............0aaaa0............',
  '.............0aaaaaa0...........',
  '............0aaaaaaaa0..........',
  '...........0aaaaaaaaaa0.........',
  '..........0aaaaaaaaaaaa0........',
  '.........0aaaaaaaaaaaaa0........',
  '........0aaaaaaaaaaaaaaa0.......',
  '.......0aaaaaaaaaaaaaaaa0.......',
  '......0bbbbbbbbbbbbbbbbbb0......',
  '......0aaa0455400aa04554000.....',
  '......0aaa0455400aa04554000.....',
  '......0aaa0000000aa00000000.....',
  '......0aaaaaaa0bb0aaaaaaaa0.....',
  '......0aaaaaaa0bb0aaaaaaaa0.....',
  '......0aaaaaaa0bb0aaaaaaaa0.....',
  '......0aaaaaaa0bb0aaaaaaaa0.....',
  '......0aaaaaaa0bb0aaaaaaaa0.....',
  '......0aaaaaaa0bb0aaaaaaaa0.....',
  '......0aaaaaaa0bb0aaaaaaaa0.....',
  '......00000000000000000000......',
  '................................',
];

const barracksDamaged = [
  '...............0aa0.............',
  '..............0a..a0............',
  '.............0aaa..a0...........',
  '............0aaaaaaaa0..........',
  '...........0aaa..aaaaa0.........',
  '..........0aaaaaaaaaaaa0........',
  '.........0aaaaaaaaaaaaa0........',
  '........0aaaaaaaaaaaaaaa0.......',
  '.......0aaaaaaaaaaaaaaaa0.......',
  '......0bbbbbbbbbbbbbbbbbb0......',
  '......0a..0455400aa04554000.....',
  '......0aaa0.55400..04554000.....',
  '......0aaa000..00aa00000000.....',
  '......0aaa.aaa0bb0.aaaaaaa0.....',
  '......0aaaaaaa0bb0aaaa..aa0.....',
  '......0aaaaaaa0bb0aaaaaaaa0.....',
  '......0aaaaaaa0bb0aaaa..aa0.....',
  '......0aaa..aa0bb0aaaaaaaa0.....',
  '......0aaaaaaa0bb0aaaaaaaa0.....',
  '......0aaaaaaa0bb0aaaaaaaa0.....',
  '......00000000000000000000......',
  '................................',
];

const barracksDestroyed = [
  '................................',
  '................................',
  '................................',
  '................................',
  '................................',
  '................................',
  '................................',
  '................................',
  '................................',
  '................................',
  '................................',
  '................................',
  '..........0.......0.............',
  '.........0a0.0bb.0a0............',
  '........0aab0bba0aab0...........',
  '.......0aabbbbbbaaabb0..........',
  '......0aabbb0aabbbbabb0.........',
  '.....0aaabbbaaabbbbaaab0........',
  '....0aaabbbbaaabbbaaaabb0.......',
  '...0aaaaabbbaaabbbaaaaabb0......',
  '..00000000000000000000000000....',
  '................................',
];

// ============================================================
// HOME BASE - Blue/steel building with helipad
// ============================================================
const homeBase = [
  '....0000000000000000000000................',
  '...0jjjjjjjjjjjjjjjjjjjj40..............',
  '..04jjjjjjjjjjjjjjjjjjjj440.............',
  '.04j55jj55jj55jj55jj55jj550.............',
  '.04j55jj55jj55jj55jj55jj550.............',
  '.04j00jj00jj00jj00jj00jj000.............',
  '.04jjjjjjjjjjjjjjjjjjjjjjc0.............',
  '.04jjjjjjjjjjjjjjjjjjjjjjc0...0770......',
  '.04jjjjjjjjjjjjjjjjjjjjjjc0..07007.....',
  '.04j00jj00jj00jj00jj00jj000..07007.....',
  '.04j55jj55jj55jj55jj55jj550..07007.....',
  '.04j55jj55jj55jj55jj55jj550..07007.....',
  '.04j00jj00jj00jj00jj00jj000..07007.....',
  '.04jjjjjj0bb0jjjjjjjjjjjj0...07007.....',
  '.04jjjjjj0bb0jjjjjjjjjjjj0...07007.....',
  '.04jjjjjj0bb0jjjjjjjjjjjj0...07007.....',
  '.04jjjjjj0bb0jjjjjjjjjjjj0..077770.....',
  '.04jjjjjj0bb0jjjjjjjjjjjj0..077770.....',
  '.00000000000000000000000000.07777777770..',
  '................................0ddd0.....',
  '................................0d0d0.....',
  '................................0ddd0.....',
  '................................00000.....',
  '.........................................',
];

// ============================================================
// TANK - Dark military gray/green
// ============================================================
const tankSprite = [
  '....................',
  '..........077.......',
  '..........077.......',
  '.......07777770.....',
  '.......07f1f770.....',
  '.......07777770.....',
  '....0777777777770...',
  '...0771777777177700.',
  '...07777777777777700',
  '..077f07f07f07f07700',
  '..077777777777777700',
  '..000000000000000000',
];

// ============================================================
// JET - Tan/brown fighter (arcade style)
// ============================================================
const jetSprite = [
  '...............00gg.........',
  '..........00ggggggg0........',
  '.....00gggggggggggggg0......',
  '0000gggggggghhggggggggg0...',
  '0000gggggggghhggggggggg0...',
  '.....00gggggggggggggg0......',
  '..........00ggggggg0........',
  '...............00gg.........',
];

// ============================================================
// UFO - Purple/magenta saucer with lights
// ============================================================
const ufoSprite = [
  '......0cc0......',
  '.....0cccc0.....',
  '....0cccccc0....',
  '...0cccccccc0...',
  '.00cccccccccc00.',
  '0f7ccd7ccd7ccf70',
  '.00f7f7777f7f00.',
  '...0f7f777f70...',
  '....00000000....',
  '................',
];

// ============================================================
// PROJECTILES
// ============================================================
const bulletSprite = [
  '.dd.',
  'dddd',
  'dddd',
  '.dd.',
];

const missileSprite = [
  '...0cc0.',
  '..0cccc0',
  'eecccccc',
  '...0cc0.',
];

// ============================================================
// EXPLOSIONS - orange/yellow/white
// ============================================================
const explosion1 = [
  '........',
  '...de...',
  '..deed..',
  '.deddde.',
  '.deddde.',
  '..deed..',
  '...de...',
  '........',
];

const explosion2 = [
  '............',
  '....eee.....',
  '...eddde....',
  '..eddddde...',
  '.eddd99dde..',
  '.edd9999de..',
  '.edd9999de..',
  '.eddd99dde..',
  '..eddddde...',
  '...eddde....',
  '....eee.....',
  '............',
];

const explosion3 = [
  '................',
  '.....7eee7......',
  '....7eddde7.....',
  '...eeddddde7....',
  '..eeddddddde7...',
  '.eeddd99dddde...',
  '.eddd9999ddde...',
  '.eddd9i99ddde...',
  '.eddd9999ddde...',
  '.eeddd99dddde...',
  '..eeddddddee7...',
  '...eedddddee....',
  '....7eedde7.....',
  '.....77ee7......',
  '................',
  '................',
];

const explosion4 = [
  '....................',
  '......77.77.........',
  '.....7ee.ee7........',
  '....7eeddee.7.......',
  '...7eedddddee7.....',
  '..7eeddddddde.7....',
  '.7eedd.ii.ddde.7....',
  '.eeddd.ii.dddee.....',
  '.eeddd....dddee.....',
  '.eedddd..ddddee.....',
  '.eeddddddddddee.....',
  '.7eeddddddddee7....',
  '..7eeddddddee.7....',
  '...7eeddddee7.......',
  '....7eeddee7........',
  '.....7eeee7.........',
  '......7777..........',
  '....................',
  '....................',
  '....................',
];

// ============================================================
// CLOUDS (3 sizes for variety)
// ============================================================
const cloudSmall = [
  '......9999......',
  '....99llll99....',
  '..99lllllll999..',
  '.9llllllllllll9.',
  '9lllllllllllll99',
  '9999999999999999',
];

const cloudMedium = [
  '..........9999..........',
  '.......999llll99........',
  '....999llllllll999......',
  '..99lllllllllllllll9....',
  '.9llll999llllllllll99...',
  '9llll9lllllllllllllll9..',
  '9lllllllllllllllllllll99',
  '999999999999999999999999',
];

const cloudLarge = [
  '...........99999....................',
  '.........99lllll99.................',
  '......999lllllllll99..............',
  '....99lllllllllllllll9............',
  '..99llllll999lllllllll99..........',
  '.9lllllll9lllllllllllllll99.......',
  '.9lllllllllllllllll99lllll999.....',
  '9llllllllllllllllll9lllllllll99...',
  '9lllllllllllllllllllllllllllll99..',
  '9llllllllllllllllllllllllllllll9..',
  '.999999999999999999999999999999...',
];

// ============================================================
// ROCKS for desert ground (3 variants)
// ============================================================
const rockSmall = [
  '..00..',
  '.0aa0.',
  '0abba0',
  '.0000.',
];

const rockMedium = [
  '...000...',
  '..0aaa0..',
  '.0aabba0.',
  '.0abbbba.',
  '0aabbba0.',
  '.000000..',
];

const rockLarge = [
  '....0000....',
  '..00aaaa0...',
  '.0aaabbba0..',
  '0aabbbbbba0.',
  '0abbbbaabba0',
  '.0aabbbbba0.',
  '..00000000..',
];

// ============================================================
// GENERATE ALL SPRITES
// ============================================================
async function main() {
  console.log('Generating arcade-style sprite PNGs...\n');

  // Helicopter (4 frames)
  await saveSprite('heli-right-1', heliRight1);
  await saveSprite('heli-right-2', heliRight2);
  await saveSprite('heli-forward-1', heliForward1);
  await saveSprite('heli-forward-2', heliForward2);

  // Hostages
  await saveSprite('hostage-walk-1', hostageWalk1);
  await saveSprite('hostage-walk-2', hostageWalk2);
  await saveSprite('hostage-wave', hostageWave);
  await saveSprite('hostage-dead', hostageDead);

  // Barracks (3 states)
  await saveSprite('barracks-intact', barracksIntact);
  await saveSprite('barracks-damaged', barracksDamaged);
  await saveSprite('barracks-destroyed', barracksDestroyed);

  // Home base
  await saveSprite('base', homeBase);

  // Enemies
  await saveSprite('tank', tankSprite);
  await saveSprite('jet', jetSprite);
  await saveSprite('ufo', ufoSprite);

  // Projectiles
  await saveSprite('bullet', bulletSprite);
  await saveSprite('missile', missileSprite);

  // Explosions (4 frames)
  await saveSprite('explosion-1', explosion1);
  await saveSprite('explosion-2', explosion2);
  await saveSprite('explosion-3', explosion3);
  await saveSprite('explosion-4', explosion4);

  // Clouds (3 sizes)
  await saveSprite('cloud-small', cloudSmall);
  await saveSprite('cloud-medium', cloudMedium);
  await saveSprite('cloud-large', cloudLarge);

  // Rocks (3 sizes)
  await saveSprite('rock-small', rockSmall);
  await saveSprite('rock-medium', rockMedium);
  await saveSprite('rock-large', rockLarge);

  console.log(`\nDone! Sprites generated in public/assets/sprites/`);
}

main().catch(console.error);
