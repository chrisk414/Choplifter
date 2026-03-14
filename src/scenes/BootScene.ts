import Phaser from 'phaser';
import {
  GAME_WIDTH, GAME_HEIGHT, GROUND_Y,
  COLOR_GROUND, COLOR_GROUND_DARK, COLOR_GRASS, COLOR_GRASS_DARK,
  COLOR_MOUNTAIN_FAR, COLOR_MOUNTAIN_NEAR, COLOR_HILL, COLOR_HILL_DARK,
} from '../constants';

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

    // Clouds
    this.load.image('cloud-small', `${base}/cloud-small.png`);
    this.load.image('cloud-medium', `${base}/cloud-medium.png`);
    this.load.image('cloud-large', `${base}/cloud-large.png`);

    // Rocks
    this.load.image('rock-small', `${base}/rock-small.png`);
    this.load.image('rock-medium', `${base}/rock-medium.png`);
    this.load.image('rock-large', `${base}/rock-large.png`);
  }

  create(): void {
    this.generateMountainTexture();
    this.generateHillTexture();
    this.generateGroundTexture();

    this.scene.start('TitleScene');
  }

  private generateMountainTexture(): void {
    const g = this.add.graphics().setVisible(false);
    const h = 180;

    // Far mountains (brown/gray)
    g.fillStyle(COLOR_MOUNTAIN_FAR);
    g.beginPath();
    g.moveTo(0, h);
    g.lineTo(0, 120); g.lineTo(40, 70); g.lineTo(80, 100);
    g.lineTo(140, 40); g.lineTo(200, 80); g.lineTo(260, 30);
    g.lineTo(320, 70); g.lineTo(400, 50); g.lineTo(460, 90);
    g.lineTo(520, 35); g.lineTo(580, 75); g.lineTo(640, 25);
    g.lineTo(700, 60); g.lineTo(760, 45); g.lineTo(820, 80);
    g.lineTo(880, 55); g.lineTo(GAME_WIDTH, 70);
    g.lineTo(GAME_WIDTH, h);
    g.closePath();
    g.fillPath();

    // Nearer mountain peaks (lighter brown)
    g.fillStyle(COLOR_MOUNTAIN_NEAR);
    g.beginPath();
    g.moveTo(0, h);
    g.lineTo(0, 130); g.lineTo(60, 80); g.lineTo(120, 110);
    g.lineTo(180, 60); g.lineTo(260, 90); g.lineTo(340, 55);
    g.lineTo(420, 100); g.lineTo(500, 70); g.lineTo(580, 95);
    g.lineTo(660, 65); g.lineTo(740, 85); g.lineTo(820, 50);
    g.lineTo(900, 75); g.lineTo(GAME_WIDTH, 90);
    g.lineTo(GAME_WIDTH, h);
    g.closePath();
    g.fillPath();

    g.generateTexture('mountains', GAME_WIDTH, h);
    g.destroy();
  }

  private generateHillTexture(): void {
    const g = this.add.graphics().setVisible(false);
    const h = 100;

    // Green hills
    g.fillStyle(COLOR_HILL);
    g.beginPath();
    g.moveTo(0, h);
    g.lineTo(0, 60); g.lineTo(80, 30); g.lineTo(160, 50);
    g.lineTo(240, 20); g.lineTo(340, 45); g.lineTo(440, 15);
    g.lineTo(540, 40); g.lineTo(640, 25); g.lineTo(740, 50);
    g.lineTo(840, 30); g.lineTo(GAME_WIDTH, 45);
    g.lineTo(GAME_WIDTH, h);
    g.closePath();
    g.fillPath();

    // Darker hill accents
    g.fillStyle(COLOR_HILL_DARK);
    g.beginPath();
    g.moveTo(0, h);
    g.lineTo(0, 75); g.lineTo(100, 50); g.lineTo(200, 65);
    g.lineTo(300, 40); g.lineTo(400, 60); g.lineTo(500, 35);
    g.lineTo(600, 55); g.lineTo(700, 45); g.lineTo(800, 60);
    g.lineTo(900, 50); g.lineTo(GAME_WIDTH, 55);
    g.lineTo(GAME_WIDTH, h);
    g.closePath();
    g.fillPath();

    g.generateTexture('hills', GAME_WIDTH, h);
    g.destroy();
  }

  private generateGroundTexture(): void {
    const g = this.add.graphics().setVisible(false);
    const groundH = GAME_HEIGHT - GROUND_Y;

    // Grass strip at the top (green dashed line like the screenshot)
    g.fillStyle(COLOR_GRASS);
    g.fillRect(0, 0, GAME_WIDTH, 6);
    g.fillStyle(COLOR_GRASS_DARK);
    for (let x = 0; x < GAME_WIDTH; x += 8) {
      g.fillRect(x, 0, 4, 6);
    }

    // Sand/desert body
    g.fillStyle(COLOR_GROUND);
    g.fillRect(0, 6, GAME_WIDTH, groundH - 6);

    // Darker sand variation stripes
    g.fillStyle(COLOR_GROUND_DARK);
    for (let y = 20; y < groundH; y += 30) {
      g.fillRect(0, y, GAME_WIDTH, 2);
    }

    g.generateTexture('ground', GAME_WIDTH, groundH);
    g.destroy();
  }
}
