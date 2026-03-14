import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, GROUND_Y, COLOR_GROUND, COLOR_MOUNTAIN, COLOR_HILL } from '../constants';
import { renderSilhouette } from '../sprites/SpriteRenderer';
import { MOUNTAIN_HEIGHTS, HILL_HEIGHTS } from '../sprites/SpriteData';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload(): void {
    const base = 'assets/sprites';

    // Helicopter
    this.load.image('heli-right-1', `${base}/heli-right-1.png`);
    this.load.image('heli-right-2', `${base}/heli-right-2.png`);
    this.load.image('heli-forward-1', `${base}/heli-forward-1.png`);
    this.load.image('heli-forward-2', `${base}/heli-forward-2.png`);

    // Hostages
    this.load.image('hostage-walk-1', `${base}/hostage-walk-1.png`);
    this.load.image('hostage-walk-2', `${base}/hostage-walk-2.png`);
    this.load.image('hostage-wave', `${base}/hostage-wave.png`);
    this.load.image('hostage-dead', `${base}/hostage-dead.png`);

    // Barracks
    this.load.image('barracks-intact', `${base}/barracks-intact.png`);
    this.load.image('barracks-damaged', `${base}/barracks-damaged.png`);
    this.load.image('barracks-destroyed', `${base}/barracks-destroyed.png`);

    // Home base
    this.load.image('base', `${base}/base.png`);

    // Enemies
    this.load.image('tank', `${base}/tank.png`);
    this.load.image('jet', `${base}/jet.png`);
    this.load.image('ufo', `${base}/ufo.png`);

    // Projectiles
    this.load.image('bullet', `${base}/bullet.png`);
    this.load.image('missile', `${base}/missile.png`);

    // Explosions
    this.load.image('explosion-1', `${base}/explosion-1.png`);
    this.load.image('explosion-2', `${base}/explosion-2.png`);
    this.load.image('explosion-3', `${base}/explosion-3.png`);
    this.load.image('explosion-4', `${base}/explosion-4.png`);
  }

  create(): void {
    // Background silhouettes (still procedural - they're large tiling textures)
    renderSilhouette(this, 'mountains', MOUNTAIN_HEIGHTS, GAME_WIDTH, 200, COLOR_MOUNTAIN);
    renderSilhouette(this, 'hills', HILL_HEIGHTS, GAME_WIDTH, 120, COLOR_HILL);

    // Ground texture (procedural - large tiling)
    this.generateGroundTexture();

    this.scene.start('TitleScene');
  }

  private generateGroundTexture(): void {
    const g = this.add.graphics().setVisible(false);
    const groundH = GAME_HEIGHT - GROUND_Y;
    g.fillStyle(COLOR_GROUND);
    g.fillRect(0, 0, GAME_WIDTH, groundH);
    // Grass detail on top edge
    g.fillStyle(0x6aaa3a);
    for (let x = 0; x < GAME_WIDTH; x += 6) {
      const h = 2 + Math.floor(Math.random() * 3);
      g.fillRect(x, 0, 3, h);
    }
    g.fillStyle(0x4a7a2a);
    for (let x = 3; x < GAME_WIDTH; x += 8) {
      g.fillRect(x, 0, 2, 2);
    }
    g.generateTexture('ground', GAME_WIDTH, groundH);
    g.destroy();
  }
}
