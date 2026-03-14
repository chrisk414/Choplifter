import Phaser from 'phaser';
import { PALETTE, SpriteDefinition } from './SpriteData';

/**
 * Renders a SpriteDefinition to a named Phaser texture.
 * Each pixel in the definition is drawn as a (scale x scale) block.
 */
export function renderSprite(
  scene: Phaser.Scene,
  name: string,
  def: SpriteDefinition,
): void {
  const scale = def.scale ?? 1;
  const texW = def.width * scale;
  const texH = def.height * scale;

  const g = scene.add.graphics().setVisible(false);

  for (let y = 0; y < def.height; y++) {
    const row = def.pixels[y];
    if (!row) continue;
    for (let x = 0; x < def.width; x++) {
      const ch = row[x];
      if (!ch || ch === '.') continue;
      const color = PALETTE[ch];
      if (color === undefined || color < 0) continue;
      g.fillStyle(color, 1);
      g.fillRect(x * scale, y * scale, scale, scale);
    }
  }

  g.generateTexture(name, texW, texH);
  g.destroy();
}

/**
 * Renders a procedural mountain/hill silhouette as a TileSprite texture.
 */
export function renderSilhouette(
  scene: Phaser.Scene,
  name: string,
  heights: number[],
  width: number,
  totalHeight: number,
  color: number,
): void {
  const g = scene.add.graphics().setVisible(false);

  g.fillStyle(color, 1);
  g.beginPath();
  g.moveTo(0, totalHeight);

  const step = width / (heights.length - 1);
  for (let i = 0; i < heights.length; i++) {
    g.lineTo(i * step, totalHeight - heights[i]);
  }

  g.lineTo(width, totalHeight);
  g.closePath();
  g.fillPath();

  g.generateTexture(name, width, totalHeight);
  g.destroy();
}
