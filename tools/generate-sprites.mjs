/**
 * Sprite PNG generator - Arcade Choplifter style (close match)
 * Run: node tools/generate-sprites.mjs
 */
import sharp from 'sharp';
import { mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..', 'public', 'assets', 'sprites');
mkdirSync(OUT_DIR, { recursive: true });

// Extended arcade palette
const PALETTE = {
  '.': null,
  '0': [0x00, 0x00, 0x00, 255],    // black
  '1': [0x88, 0x88, 0x88, 255],    // medium gray
  '2': [0xcc, 0xcc, 0xcc, 255],    // light gray
  '3': [0xee, 0xee, 0xee, 255],    // near-white
  '4': [0x44, 0x88, 0xcc, 255],    // cockpit glass
  '5': [0x88, 0xcc, 0xee, 255],    // cockpit highlight
  '6': [0x33, 0x33, 0x33, 255],    // dark gray
  '7': [0x55, 0x55, 0x55, 255],    // gray
  '8': [0xd4, 0xa5, 0x74, 255],    // skin tone
  '9': [0xee, 0xee, 0xee, 255],    // white
  'a': [0x8b, 0x69, 0x14, 255],    // brown
  'b': [0x5a, 0x44, 0x10, 255],    // dark brown
  'c': [0xcc, 0x33, 0x33, 255],    // red
  'd': [0xff, 0xcc, 0x00, 255],    // yellow
  'e': [0xff, 0x88, 0x00, 255],    // orange
  'f': [0x44, 0x44, 0x44, 255],    // medium-dark gray
  'g': [0xc8, 0x90, 0x60, 255],    // tan
  'h': [0xa0, 0x70, 0x48, 255],    // dark tan
  'i': [0xff, 0xff, 0xff, 255],    // pure white
  'j': [0x44, 0x77, 0xaa, 255],    // steel blue
  'k': [0x48, 0xa8, 0x30, 255],    // green
  'l': [0xcc, 0xdd, 0xee, 255],    // cloud shadow
  'm': [0xaa, 0xaa, 0xaa, 255],    // light medium gray
  'n': [0x77, 0x77, 0x77, 255],    // neutral gray
  'o': [0xdd, 0x55, 0x44, 255],    // bright red
  'p': [0xbb, 0xbb, 0xcc, 255],    // blue-gray
  'q': [0x66, 0x88, 0x44, 255],    // olive
  'r': [0xff, 0x66, 0x44, 255],    // red-orange
  's': [0x99, 0x99, 0x99, 255],    // silver
  't': [0x33, 0x55, 0x88, 255],    // dark blue
  'u': [0xbb, 0xdd, 0xff, 255],    // light blue
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
          const off = ((sy * scale + dy) * w + sx * scale + dx) * 4;
          buf[off] = color[0]; buf[off+1] = color[1]; buf[off+2] = color[2]; buf[off+3] = color[3];
        }
      }
    }
  }
  return { buf, w, h };
}

async function save(name, pixels, scale = 2) {
  const { buf, w, h } = createSprite(pixels, scale);
  await sharp(buf, { raw: { width: w, height: h, channels: 4 } }).png().toFile(join(OUT_DIR, `${name}.png`));
  console.log(`  + ${name}.png (${w}x${h})`);
}

// ============================================================
// HELICOPTER - Arcade-style, facing RIGHT (cockpit on right)
// Elongated body, clear cockpit, tail boom, landing skids
// 34x16 pixels at 2x = 68x32
// ============================================================
const heliRight1 = [
  '..........0n6n6n6n6n6n6n6n6n6n6n0...',  // rotor blade full
  '...................0n0................',
  '...................0n0................',
  '...................020................',
  '..0f00..........0233320..............',
  '.0f770.......012333333220............',
  '0f7770.....0123333333333320..........',
  '0f7n70...012333333333333p320.........',
  '.0770..01233333333333345543200.......',
  '..00.0123333333333333345543200.......',
  '......01222333333333333333221100.....',
  '.......012222222222222222221100......',
  '........0111100000001111100..........',
  '........0.0cc0......0cc0.0..........',
  '.......0..0cccccccccccc0..0.........',
  '..........0c00c00c00c00c0...........',
];

const heliRight2 = [
  '..............0n6n6n6n6n6n6n0........',  // rotor short
  '...................0n0................',
  '...................0n0................',
  '...................020................',
  '..0f00..........0233320..............',
  '.0f770.......012333333220............',
  '0f7770.....0123333333333320..........',
  '0f7n70...012333333333333p320.........',
  '.0770..01233333333333345543200.......',
  '..00.0123333333333333345543200.......',
  '......01222333333333333333221100.....',
  '.......012222222222222222221100......',
  '........0111100000001111100..........',
  '........0.0cc0......0cc0.0..........',
  '.......0..0cccccccccccc0..0.........',
  '..........0c00c00c00c00c0...........',
];

const heliForward1 = [
  '..06n6n6n6n6n6n6n6n6n6n60..',  // rotor full
  '............0n0..............',
  '............0n0..............',
  '............020..............',
  '.......0122333332210........',
  '......012333333333210.......',
  '.....01233333333333210......',
  '.....0123345554333332100....',
  '.....0123345554333332100....',
  '.....01233333333333321000...',
  '......0122233332222210......',
  '.......01222222222100.......',
  '.......0cc00....00cc0.......',
  '......0cccccc00cccccc0......',
  '......0c00c00..00c00c0......',
  '......000000....000000......',
];

const heliForward2 = [
  '........06n6n6n6n6n60........',  // rotor short
  '............0n0..............',
  '............0n0..............',
  '............020..............',
  '.......0122333332210........',
  '......012333333333210.......',
  '.....01233333333333210......',
  '.....0123345554333332100....',
  '.....0123345554333332100....',
  '.....01233333333333321000...',
  '......0122233332222210......',
  '.......01222222222100.......',
  '.......0cc00....00cc0.......',
  '......0cccccc00cccccc0......',
  '......0c00c00..00c00c0......',
  '......000000....000000......',
];

// ============================================================
// HOSTAGE - slightly taller, more visible on desert
// 6x14 at 2x = 12x28
// ============================================================
const hostageWalk1 = [
  '.0880.',
  '.0880.',
  '.0880.',
  '..ii..',
  '..ii..',
  '.0ii0.',
  '..ii..',
  '..ii..',
  '..ii..',
  '..00..',
  '.0..0.',
  '.0..0.',
  '.0..0.',
  '......',
];

const hostageWalk2 = [
  '.0880.',
  '.0880.',
  '.0880.',
  '..ii..',
  '..ii..',
  '.0ii0.',
  '..ii..',
  '..ii..',
  '..ii..',
  '..00..',
  '..00..',
  '..00..',
  '..00..',
  '......',
];

const hostageWave = [
  '.0880.',
  '.0880.',
  '.0880.',
  '..ii8.',
  '..ii8.',
  '.0ii0.',
  '..ii..',
  '..ii..',
  '..ii..',
  '..00..',
  '.0..0.',
  '.0..0.',
  '.0..0.',
  '......',
];

const hostageDead = [
  '...ii...',
  '..9ii9..',
  '.9iiii9.',
  '9i9ii9i9',
  '.9iiii9.',
  '..9ii9..',
  '...99...',
  '........',
];

// ============================================================
// BARRACKS - more detailed
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
  '..........77...77...............',
  '.........7667.766...............',
  '........0a770bb70a0.............',
  '.......0a6b0bba06ab0............',
  '......0aab7bbbb7aab0...........',
  '.....0aabbbbbbbaaabb0..........',
  '....0aabbb06abbbbaabb0.........',
  '...0aaabbbbaaabbbaaaab0........',
  '..0aaabbbbbaaabbbaaaabb0.......',
  '.0aaaaaabbbaaabbbaaaaabb0......',
  '000000000000000000000000000....',
  '................................',
];

// ============================================================
// HOME BASE
// ============================================================
const homeBase = [
  '...000000000000000000000000...................',
  '..0jjjjjjjjjjjjjjjjjjjjjj40.................',
  '.04jjjjjjjjjjjjjjjjjjjjjj440................',
  '.04j55jj55jj55jj55jj55jj550.................',
  '.04j55jj55jj55jj55jj55jj550.................',
  '.04j00jj00jj00jj00jj00jj000.................',
  '.04jjjjjjjjjjjjjjjjjjjjjjc0.................',
  '.04jjjjjjjjjjjjjjjjjjjjjjc0....077700.......',
  '.04jjjjjjjjjjjjjjjjjjjjjjc0...07nn070......',
  '.04j00jj00jj00jj00jj00jj000...07nn070......',
  '.04j55jj55jj55jj55jj55jj550...07nn070......',
  '.04j55jj55jj55jj55jj55jj550...07nn070......',
  '.04j00jj00jj00jj00jj00jj000...07nn070......',
  '.04jjjjjj0bb0jjjjjjjjjjjj0....07nn070......',
  '.04jjjjjj0bb0jjjjjjjjjjjj0....07nn070......',
  '.04jjjjjj0bb0jjjjjjjjjjjj0....07nn070......',
  '.04jjjjjj0bb0jjjjjjjjjjjj0...0777777770....',
  '.04jjjjjj0bb0jjjjjjjjjjjj0...0nnnnnnn70....',
  '.00000000000000000000000000...077777777770...',
  '...........00000..............0n0ddd0n70....',
  '...........0bbb0..............0n0d0d0n70....',
  '...........0bbb0..............0n0ddd0n70....',
  '...........00000..............07777777770....',
  '..............................................',
];

// ============================================================
// TANK - more detailed treads
// ============================================================
const tankSprite = [
  '........................',
  '............0770........',
  '............0770........',
  '.........077777770......',
  '.........07fn1f770......',
  '.........077777770......',
  '......0777777777777700..',
  '.....077s7777777s77700..',
  '.....077777777777777700.',
  '....077f07f07f07f077700.',
  '....0f7f7f7f7f7f7f7f00.',
  '....0000000000000000000.',
];

// ============================================================
// JET - tan/brown with more wing detail
// ============================================================
const jetSprite = [
  '..................00hh...........',
  '.............00hhhhhhhh0.........',
  '........00hhhggggggggggg0.......',
  '....00hhgggggggggggggggggg0.....',
  '0000gggggggggg00ggggggggggg0....',
  '0000gggggggggg00ggggggggggg0....',
  '....00hhgggggggggggggggggg0.....',
  '........00hhhggggggggggg0.......',
  '.............00hhhhhhhh0.........',
  '..................00hh...........',
];

// ============================================================
// UFO
// ============================================================
const ufoSprite = [
  '......0cc0......',
  '.....0cccc0.....',
  '....0cccccc0....',
  '...0cccccccc0...',
  '.00cccccccccc00.',
  '0f7ccd7ccd7ccf70',
  '.00f7f7n77f7f00.',
  '...0f7f7n7f70...',
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
// EXPLOSIONS
// ============================================================
const explosion1 = [
  '........',
  '...de...',
  '..deed..',
  '.deidde.',
  '.deidde.',
  '..deed..',
  '...de...',
  '........',
];

const explosion2 = [
  '............',
  '....eee.....',
  '...eddde....',
  '..eddddde...',
  '.edddiidde..',
  '.eddiiidde..',
  '.eddiiidde..',
  '.edddiidde...',
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
  '..eeddddddde....',
  '.eedddiidddde...',
  '.edddiiiddde....',
  '.edddiiiddde....',
  '.edddiiiddde....',
  '.eedddiidddde...',
  '..eeddddddee....',
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
// CLOUDS - 5 varieties, more fluffy/detailed
// ============================================================
const cloud1 = [
  '..........iiii..............',
  '........iilllii.............',
  '......iillllllii............',
  '....iillllllllliii..........',
  '..iilllliiillllllli.........',
  '.illlliiilllllllllli........',
  'illllllllllllllllllli.......',
  'iiiiiiiiiiiiiiiiiiiii.......',
];

const cloud2 = [
  '..............iiii..................',
  '...........iiilllii................',
  '.........iillllllliii..............',
  '......iiillllllllllllii............',
  '....iilllllliiilllllllli...........',
  '..iilllllliilllllllllllli..........',
  '.illllllllllllllllllllllli.........',
  'illllllllllllllllllllllllli........',
  'iiiiiiiiiiiiiiiiiiiiiiiiii.........',
];

const cloud3 = [
  '...........iiii....................',
  '.........iiillli...................',
  '.......iillllllii.................',
  '.....iillllllllliii...............',
  '...iillllllllllllllii.............',
  '..illlliiillllllllllli............',
  '.illliiillllllliiilllii...........',
  'illllllllllllliillllllii..........',
  'illllllllllllllllllllllli.........',
  'illlllllllllllllllllllllli........',
  '.iiiiiiiiiiiiiiiiiiiiiiiii........',
];

const cloud4 = [
  '.......iiii.....',
  '.....iilllii....',
  '...iilllllllii..',
  '..illllllllllii.',
  '.illllllllllllli',
  'illlllllllllllll',
  'iiiiiiiiiiiiiii.',
];

const cloud5 = [
  '...iiii...iiii.......',
  '..illlii.iillli......',
  '.illllliilllllli.....',
  'illllllllllllllli....',
  'illlllllllllllllli...',
  '.iiiiiiiiiiiiiiiii...',
];

// ============================================================
// ROCKS - more natural shapes, 4 variants
// ============================================================
const rock1 = [
  '..00..',
  '.0ba0.',
  '0abba0',
  '.0000.',
];

const rock2 = [
  '...000....',
  '..0aab0...',
  '.0aabba0..',
  '.0abbbba0.',
  '0aabbba0..',
  '.000000...',
];

const rock3 = [
  '.....0000.....',
  '...00aaab0....',
  '..0aaabbba0...',
  '.0aabbbbbba0..',
  '0aabbbbabbba0.',
  '.0aabbbbba0...',
  '..000000000...',
];

const rock4 = [
  '..00..',
  '.0ab0.',
  '0abba0',
  '0abba0',
  '.0000.',
];

// ============================================================
// GENERATE
// ============================================================
async function main() {
  console.log('Generating arcade-style sprite PNGs...\n');

  await save('heli-right-1', heliRight1);
  await save('heli-right-2', heliRight2);
  await save('heli-forward-1', heliForward1);
  await save('heli-forward-2', heliForward2);

  await save('hostage-walk-1', hostageWalk1);
  await save('hostage-walk-2', hostageWalk2);
  await save('hostage-wave', hostageWave);
  await save('hostage-dead', hostageDead);

  await save('barracks-intact', barracksIntact);
  await save('barracks-damaged', barracksDamaged);
  await save('barracks-destroyed', barracksDestroyed);

  await save('base', homeBase);

  await save('tank', tankSprite);
  await save('jet', jetSprite);
  await save('ufo', ufoSprite);

  await save('bullet', bulletSprite);
  await save('missile', missileSprite);

  await save('explosion-1', explosion1);
  await save('explosion-2', explosion2);
  await save('explosion-3', explosion3);
  await save('explosion-4', explosion4);

  await save('cloud-1', cloud1);
  await save('cloud-2', cloud2);
  await save('cloud-3', cloud3);
  await save('cloud-4', cloud4);
  await save('cloud-5', cloud5);

  await save('rock-1', rock1);
  await save('rock-2', rock2);
  await save('rock-3', rock3);
  await save('rock-4', rock4);

  console.log('\nDone!');
}

main().catch(console.error);
