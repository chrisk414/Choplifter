import Phaser from 'phaser';
import {
  HELI_WIDTH, HELI_HEIGHT, BARRACKS_WIDTH, BARRACKS_HEIGHT,
  BULLET_SIZE, HOSTAGE_WIDTH, HOSTAGE_HEIGHT,
  TANK_WIDTH, TANK_HEIGHT, JET_WIDTH, JET_HEIGHT, UFO_SIZE,
  BASE_WIDTH,
  COLOR_HELI_BODY, COLOR_HELI_COCKPIT, COLOR_BARRACKS,
  COLOR_HOSTAGE, COLOR_TANK, COLOR_JET, COLOR_UFO,
  COLOR_BULLET, COLOR_MISSILE, COLOR_EXPLOSION, COLOR_BASE,
  COLOR_GROUND, COLOR_MOUNTAIN, COLOR_HILL,
  GAME_WIDTH, GAME_HEIGHT, GROUND_Y,
} from '../constants';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  create(): void {
    this.generateHelicopterTextures();
    this.generateBarracksTextures();
    this.generateBulletTexture();
    this.generateHostageTextures();
    this.generateTankTexture();
    this.generateJetTexture();
    this.generateUfoTexture();
    this.generateMissileTexture();
    this.generateExplosionTextures();
    this.generateBaseTexture();
    this.generateBackgroundTextures();
    this.generateGroundTexture();

    this.scene.start('TitleScene');
  }

  private generateHelicopterTextures(): void {
    // Helicopter facing right
    const g = this.add.graphics().setVisible(false);

    // Body
    g.fillStyle(COLOR_HELI_BODY);
    g.fillRect(8, 8, 28, 12);
    // Cockpit
    g.fillStyle(COLOR_HELI_COCKPIT);
    g.fillRect(32, 9, 8, 8);
    // Tail
    g.fillStyle(COLOR_HELI_BODY);
    g.fillRect(2, 10, 8, 6);
    g.fillRect(0, 6, 6, 6);
    // Rotor mast
    g.fillStyle(0x333333);
    g.fillRect(22, 5, 4, 4);
    // Rotor blade (frame 1)
    g.fillStyle(0x222222);
    g.fillRect(6, 3, 36, 2);
    // Skids
    g.fillStyle(0x333333);
    g.fillRect(12, 20, 24, 2);
    g.fillRect(14, 18, 2, 4);
    g.fillRect(30, 18, 2, 4);

    g.generateTexture('heli-right-1', HELI_WIDTH, HELI_HEIGHT);
    g.clear();

    // Helicopter facing right - rotor frame 2
    g.fillStyle(COLOR_HELI_BODY);
    g.fillRect(8, 8, 28, 12);
    g.fillStyle(COLOR_HELI_COCKPIT);
    g.fillRect(32, 9, 8, 8);
    g.fillStyle(COLOR_HELI_BODY);
    g.fillRect(2, 10, 8, 6);
    g.fillRect(0, 6, 6, 6);
    g.fillStyle(0x333333);
    g.fillRect(22, 5, 4, 4);
    // Shorter rotor (angled)
    g.fillStyle(0x222222);
    g.fillRect(14, 3, 20, 2);
    g.fillStyle(0x333333);
    g.fillRect(12, 20, 24, 2);
    g.fillRect(14, 18, 2, 4);
    g.fillRect(30, 18, 2, 4);

    g.generateTexture('heli-right-2', HELI_WIDTH, HELI_HEIGHT);
    g.clear();

    // Helicopter facing forward (toward player)
    g.fillStyle(COLOR_HELI_BODY);
    g.fillRect(12, 8, 24, 12);
    g.fillStyle(COLOR_HELI_COCKPIT);
    g.fillRect(16, 9, 16, 10);
    // Rotor mast
    g.fillStyle(0x333333);
    g.fillRect(22, 5, 4, 4);
    // Rotor blade
    g.fillStyle(0x222222);
    g.fillRect(6, 3, 36, 2);
    // Skids
    g.fillStyle(0x333333);
    g.fillRect(10, 20, 28, 2);
    g.fillRect(12, 18, 2, 4);
    g.fillRect(34, 18, 2, 4);

    g.generateTexture('heli-forward-1', HELI_WIDTH, HELI_HEIGHT);
    g.clear();

    // Forward frame 2
    g.fillStyle(COLOR_HELI_BODY);
    g.fillRect(12, 8, 24, 12);
    g.fillStyle(COLOR_HELI_COCKPIT);
    g.fillRect(16, 9, 16, 10);
    g.fillStyle(0x333333);
    g.fillRect(22, 5, 4, 4);
    g.fillStyle(0x222222);
    g.fillRect(14, 3, 20, 2);
    g.fillStyle(0x333333);
    g.fillRect(10, 20, 28, 2);
    g.fillRect(12, 18, 2, 4);
    g.fillRect(34, 18, 2, 4);

    g.generateTexture('heli-forward-2', HELI_WIDTH, HELI_HEIGHT);
    g.destroy();
  }

  private generateBarracksTextures(): void {
    const g = this.add.graphics().setVisible(false);

    // Intact barracks
    g.fillStyle(COLOR_BARRACKS);
    g.fillRect(0, 8, BARRACKS_WIDTH, BARRACKS_HEIGHT - 8);
    // Roof
    g.fillStyle(0x6b4e0a);
    g.fillTriangle(0, 8, BARRACKS_WIDTH / 2, 0, BARRACKS_WIDTH, 8);
    // Door
    g.fillStyle(0x4a3a0a);
    g.fillRect(24, 28, 16, 20);
    // Windows
    g.fillStyle(0x88ccff);
    g.fillRect(6, 18, 10, 8);
    g.fillRect(48, 18, 10, 8);
    g.generateTexture('barracks-intact', BARRACKS_WIDTH, BARRACKS_HEIGHT);
    g.clear();

    // Damaged barracks
    g.fillStyle(COLOR_BARRACKS);
    g.fillRect(0, 8, BARRACKS_WIDTH, BARRACKS_HEIGHT - 8);
    g.fillStyle(0x6b4e0a);
    g.fillTriangle(0, 8, BARRACKS_WIDTH / 2, 0, BARRACKS_WIDTH, 8);
    g.fillStyle(0x4a3a0a);
    g.fillRect(24, 28, 16, 20);
    // Damage marks
    g.fillStyle(0x333333);
    g.fillRect(10, 14, 8, 6);
    g.fillRect(42, 20, 10, 8);
    g.generateTexture('barracks-damaged', BARRACKS_WIDTH, BARRACKS_HEIGHT);
    g.clear();

    // Destroyed barracks (rubble)
    g.fillStyle(0x5a4a2a);
    g.fillRect(4, 30, BARRACKS_WIDTH - 8, 18);
    g.fillStyle(0x444444);
    g.fillRect(8, 26, 12, 8);
    g.fillRect(32, 28, 16, 10);
    g.fillRect(20, 32, 8, 6);
    g.generateTexture('barracks-destroyed', BARRACKS_WIDTH, BARRACKS_HEIGHT);
    g.destroy();
  }

  private generateBulletTexture(): void {
    const g = this.add.graphics().setVisible(false);
    g.fillStyle(COLOR_BULLET);
    g.fillCircle(BULLET_SIZE / 2, BULLET_SIZE / 2, BULLET_SIZE / 2);
    g.generateTexture('bullet', BULLET_SIZE, BULLET_SIZE);
    g.destroy();
  }

  private generateHostageTextures(): void {
    const g = this.add.graphics().setVisible(false);

    // Walk frame 1
    g.fillStyle(COLOR_HOSTAGE);
    g.fillCircle(4, 2, 2); // head
    g.fillRect(3, 4, 2, 6); // body
    g.fillRect(1, 10, 2, 4); // left leg
    g.fillRect(5, 10, 2, 4); // right leg
    g.fillRect(0, 5, 2, 2); // left arm
    g.fillRect(6, 5, 2, 2); // right arm
    g.generateTexture('hostage-walk-1', HOSTAGE_WIDTH, HOSTAGE_HEIGHT);
    g.clear();

    // Walk frame 2
    g.fillStyle(COLOR_HOSTAGE);
    g.fillCircle(4, 2, 2);
    g.fillRect(3, 4, 2, 6);
    g.fillRect(2, 10, 2, 4); // legs together
    g.fillRect(4, 10, 2, 4);
    g.fillRect(1, 6, 2, 2);
    g.fillRect(5, 4, 2, 2);
    g.generateTexture('hostage-walk-2', HOSTAGE_WIDTH, HOSTAGE_HEIGHT);
    g.clear();

    // Death puff
    g.fillStyle(0xffffff);
    g.fillCircle(4, 7, 3);
    g.fillStyle(0xcccccc);
    g.fillCircle(2, 4, 2);
    g.fillCircle(6, 5, 2);
    g.generateTexture('hostage-dead', HOSTAGE_WIDTH, HOSTAGE_HEIGHT);
    g.destroy();
  }

  private generateTankTexture(): void {
    const g = this.add.graphics().setVisible(false);
    // Body
    g.fillStyle(COLOR_TANK);
    g.fillRect(2, 8, 28, 10);
    // Turret
    g.fillStyle(0x555555);
    g.fillRect(10, 4, 12, 6);
    // Barrel
    g.fillRect(20, 2, 10, 3);
    // Tracks
    g.fillStyle(0x444444);
    g.fillRect(0, 16, TANK_WIDTH, 4);
    g.generateTexture('tank', TANK_WIDTH, TANK_HEIGHT);
    g.destroy();
  }

  private generateJetTexture(): void {
    const g = this.add.graphics().setVisible(false);
    g.fillStyle(COLOR_JET);
    // Fuselage
    g.fillRect(4, 4, 32, 4);
    // Nose
    g.fillTriangle(36, 4, 40, 6, 36, 8);
    // Wings
    g.fillRect(12, 0, 16, 12);
    // Tail
    g.fillRect(2, 1, 6, 10);
    g.generateTexture('jet', JET_WIDTH, JET_HEIGHT);
    g.destroy();
  }

  private generateUfoTexture(): void {
    const g = this.add.graphics().setVisible(false);
    g.fillStyle(COLOR_UFO);
    // Dome
    g.fillCircle(UFO_SIZE / 2, 8, 6);
    // Saucer body
    g.fillStyle(0xaa33aa);
    g.fillEllipse(UFO_SIZE / 2, 14, UFO_SIZE, 8);
    // Lights
    g.fillStyle(0xffff00);
    g.fillCircle(4, 14, 2);
    g.fillCircle(UFO_SIZE / 2, 14, 2);
    g.fillCircle(UFO_SIZE - 4, 14, 2);
    g.generateTexture('ufo', UFO_SIZE, UFO_SIZE);
    g.destroy();
  }

  private generateMissileTexture(): void {
    const g = this.add.graphics().setVisible(false);
    g.fillStyle(COLOR_MISSILE);
    g.fillRect(0, 1, 6, 2);
    g.fillStyle(0xff8800);
    g.fillRect(6, 0, 2, 4);
    g.generateTexture('missile', 8, 4);
    g.destroy();
  }

  private generateExplosionTextures(): void {
    const g = this.add.graphics().setVisible(false);

    for (let i = 1; i <= 4; i++) {
      g.clear();
      const size = 8 + i * 8;
      const alpha = 1 - (i - 1) * 0.2;

      g.fillStyle(COLOR_EXPLOSION, alpha);
      g.fillCircle(size / 2, size / 2, size / 2);
      g.fillStyle(0xffff00, alpha * 0.8);
      g.fillCircle(size / 2, size / 2, size / 3);
      g.fillStyle(0xffffff, alpha * 0.5);
      g.fillCircle(size / 2, size / 2, size / 6);

      g.generateTexture(`explosion-${i}`, size, size);
    }
    g.destroy();
  }

  private generateBaseTexture(): void {
    const g = this.add.graphics().setVisible(false);
    const h = 60;

    // Building
    g.fillStyle(COLOR_BASE);
    g.fillRect(20, 10, 80, 50);
    // Roof
    g.fillStyle(0x336699);
    g.fillRect(16, 6, 88, 6);
    // Helipad (H marking)
    g.fillStyle(0xcccccc);
    g.fillRect(120, 48, 50, 12);
    g.fillStyle(0xffffff);
    g.fillRect(138, 50, 4, 8);
    g.fillRect(133, 53, 14, 2);
    // Door
    g.fillStyle(0x224466);
    g.fillRect(50, 34, 20, 26);
    // Windows
    g.fillStyle(0x88ccff);
    g.fillRect(28, 18, 14, 10);
    g.fillRect(78, 18, 14, 10);
    // Flag pole
    g.fillStyle(0xcccccc);
    g.fillRect(108, 0, 2, 20);
    g.fillStyle(0xff4444);
    g.fillRect(110, 2, 12, 8);

    g.generateTexture('base', BASE_WIDTH, h);
    g.destroy();
  }

  private generateBackgroundTextures(): void {
    const g = this.add.graphics().setVisible(false);

    // Mountain silhouette tile (960px wide, repeating)
    const mtnH = 200;
    g.fillStyle(COLOR_MOUNTAIN);
    g.beginPath();
    g.moveTo(0, mtnH);
    g.lineTo(0, 140);
    g.lineTo(80, 60);
    g.lineTo(160, 120);
    g.lineTo(240, 30);
    g.lineTo(320, 100);
    g.lineTo(440, 50);
    g.lineTo(520, 110);
    g.lineTo(600, 40);
    g.lineTo(720, 90);
    g.lineTo(840, 20);
    g.lineTo(GAME_WIDTH, 80);
    g.lineTo(GAME_WIDTH, mtnH);
    g.closePath();
    g.fillPath();
    g.generateTexture('mountains', GAME_WIDTH, mtnH);
    g.clear();

    // Hill silhouette tile
    const hillH = 120;
    g.fillStyle(COLOR_HILL);
    g.beginPath();
    g.moveTo(0, hillH);
    g.lineTo(0, 80);
    g.lineTo(120, 40);
    g.lineTo(240, 70);
    g.lineTo(360, 30);
    g.lineTo(480, 60);
    g.lineTo(600, 20);
    g.lineTo(720, 50);
    g.lineTo(840, 35);
    g.lineTo(GAME_WIDTH, 55);
    g.lineTo(GAME_WIDTH, hillH);
    g.closePath();
    g.fillPath();
    g.generateTexture('hills', GAME_WIDTH, hillH);
    g.destroy();
  }

  private generateGroundTexture(): void {
    const g = this.add.graphics().setVisible(false);
    const groundH = GAME_HEIGHT - GROUND_Y;
    g.fillStyle(COLOR_GROUND);
    g.fillRect(0, 0, GAME_WIDTH, groundH);
    // Grass detail
    g.fillStyle(0x4a7a2a);
    for (let x = 0; x < GAME_WIDTH; x += 12) {
      g.fillRect(x, 0, 6, 2);
    }
    g.generateTexture('ground', GAME_WIDTH, groundH);
    g.destroy();
  }
}
