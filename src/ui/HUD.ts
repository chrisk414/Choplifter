import Phaser from 'phaser';
import {
  GAME_WIDTH, HUD_HEIGHT, FUEL_MAX,
  COLOR_HUD_BG, COLOR_HUD_BORDER,
} from '../constants';
import type { GameScene } from '../scenes/GameScene';

export class HUD {
  private scene: GameScene;

  // Text elements
  private topScoreLabel!: Phaser.GameObjects.Text;
  private topScoreValue!: Phaser.GameObjects.Text;
  private livesIcon!: Phaser.GameObjects.Image;
  private livesValue!: Phaser.GameObjects.Text;
  private scoreLabel!: Phaser.GameObjects.Text;
  private scoreValue!: Phaser.GameObjects.Text;
  private loadLabel!: Phaser.GameObjects.Text;
  private loadValue!: Phaser.GameObjects.Text;
  private safeLabel!: Phaser.GameObjects.Text;
  private safeValue!: Phaser.GameObjects.Text;
  private lostLabel!: Phaser.GameObjects.Text;
  private lostValue!: Phaser.GameObjects.Text;
  private rdLabel!: Phaser.GameObjects.Text;
  private rdValue!: Phaser.GameObjects.Text;
  private fuelLabel!: Phaser.GameObjects.Text;

  // Fuel gauge graphics
  private fuelBarBg!: Phaser.GameObjects.Rectangle;
  private fuelBarFill!: Phaser.GameObjects.Rectangle;

  // Instrument dials (decorative)
  private dials: Phaser.GameObjects.Graphics[] = [];

  // Message overlay
  private messageText!: Phaser.GameObjects.Text;

  constructor(scene: GameScene) {
    this.scene = scene;
    this.createPanel();
    this.createLabels();
    this.createFuelGauge();
    this.createDials();
    this.createMessageText();
  }

  private createPanel(): void {
    // Dark instrument panel background
    const bg = this.scene.add.rectangle(GAME_WIDTH / 2, HUD_HEIGHT / 2, GAME_WIDTH, HUD_HEIGHT, COLOR_HUD_BG)
      .setScrollFactor(0).setDepth(10);

    // Bottom border line
    this.scene.add.rectangle(GAME_WIDTH / 2, HUD_HEIGHT - 1, GAME_WIDTH, 2, COLOR_HUD_BORDER)
      .setScrollFactor(0).setDepth(10);

    // Vertical dividers
    const dividers = [190, 420, 580, 720];
    for (const x of dividers) {
      this.scene.add.rectangle(x, HUD_HEIGHT / 2, 2, HUD_HEIGHT - 8, COLOR_HUD_BORDER)
        .setScrollFactor(0).setDepth(10);
    }
  }

  private createLabels(): void {
    const labelStyle: Phaser.Types.GameObjects.Text.TextStyle = {
      fontSize: '11px',
      fontFamily: 'monospace',
      color: '#44ff44',
    };
    const valueStyle: Phaser.Types.GameObjects.Text.TextStyle = {
      fontSize: '14px',
      fontFamily: 'monospace',
      color: '#ffff00',
      fontStyle: 'bold',
    };
    const bigValueStyle: Phaser.Types.GameObjects.Text.TextStyle = {
      fontSize: '18px',
      fontFamily: 'monospace',
      color: '#ffff00',
      fontStyle: 'bold',
    };

    // --- Left section: TOP score + RD ---
    this.topScoreLabel = this.txt(10, 6, 'TOP', labelStyle);
    this.topScoreValue = this.txt(45, 4, '0050000', bigValueStyle);

    this.rdLabel = this.txt(10, 40, 'RD', labelStyle);
    this.rdValue = this.txt(35, 38, '01', { ...valueStyle, fontSize: '16px' });

    // Helicopter icon for lives
    this.livesIcon = this.scene.add.image(100, 52, 'heli-right-1')
      .setScale(0.5).setScrollFactor(0).setDepth(10);
    this.livesValue = this.txt(120, 42, '03', { ...valueStyle, fontSize: '16px' });

    // --- Middle-left: FUEL gauge ---
    this.fuelLabel = this.txt(200, 8, 'FUEL', labelStyle);

    // --- Center: Instrument dials (decorative) ---
    // (created in createDials)

    // --- Right section: 1UP score + LOAD/SAFE/LOST ---
    this.scoreLabel = this.txt(590, 6, '1UP', labelStyle);
    this.scoreValue = this.txt(625, 4, '0000000', bigValueStyle);

    // LOAD
    this.loadLabel = this.txt(730, 6, 'LOAD', { ...labelStyle, color: '#44ff44' });
    this.loadValue = this.txt(790, 4, '00', { ...bigValueStyle, color: '#ffffff' });

    // SAFE
    this.safeLabel = this.txt(730, 28, 'SAFE', { ...labelStyle, color: '#44ff44' });
    this.safeValue = this.txt(790, 26, '00', { ...bigValueStyle, color: '#44ff44' });

    // LOST
    this.lostLabel = this.txt(730, 50, 'LOST', { ...labelStyle, color: '#ff4444' });
    this.lostValue = this.txt(790, 48, '00', { ...bigValueStyle, color: '#ff4444' });
  }

  private createFuelGauge(): void {
    const x = 200;
    const y = 32;
    const w = 180;
    const h = 16;

    // Background
    this.fuelBarBg = this.scene.add.rectangle(x + w / 2, y + h / 2, w, h, 0x000000)
      .setScrollFactor(0).setDepth(10);
    this.scene.add.rectangle(x + w / 2, y + h / 2, w + 2, h + 2, COLOR_HUD_BORDER)
      .setScrollFactor(0).setDepth(9.9);

    // Fill (starts full, red on left, blue on right)
    this.fuelBarFill = this.scene.add.rectangle(x + 1, y + 1, w - 2, h - 2, 0x4488ff)
      .setOrigin(0, 0).setScrollFactor(0).setDepth(10.1);

    // Red danger zone marker on left side
    this.scene.add.rectangle(x + 1, y + 1, 40, h - 2, 0xcc3333)
      .setOrigin(0, 0).setScrollFactor(0).setDepth(10.05);
  }

  private createDials(): void {
    // Decorative instrument dials in center section
    const dialPositions = [470, 520, 560];
    const dialRadius = 18;

    for (const cx of dialPositions) {
      const cy = HUD_HEIGHT / 2;

      // Dial background circle
      const g = this.scene.add.graphics().setScrollFactor(0).setDepth(10);
      g.fillStyle(0x111111);
      g.fillCircle(cx, cy, dialRadius);
      g.lineStyle(2, COLOR_HUD_BORDER);
      g.strokeCircle(cx, cy, dialRadius);

      // Tick marks
      g.lineStyle(1, 0x666666);
      for (let angle = -140; angle <= 140; angle += 35) {
        const rad = (angle * Math.PI) / 180;
        const inner = dialRadius - 4;
        const outer = dialRadius - 1;
        g.lineBetween(
          cx + Math.cos(rad) * inner, cy + Math.sin(rad) * inner,
          cx + Math.cos(rad) * outer, cy + Math.sin(rad) * outer,
        );
      }

      this.dials.push(g);
    }
  }

  private createMessageText(): void {
    this.messageText = this.scene.add.text(GAME_WIDTH / 2, HUD_HEIGHT + 40, '', {
      fontSize: '28px',
      fontFamily: 'monospace',
      color: '#ffff00',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 4,
    }).setOrigin(0.5).setScrollFactor(0).setDepth(10).setAlpha(0);
  }

  private txt(x: number, y: number, text: string, style: Phaser.Types.GameObjects.Text.TextStyle): Phaser.GameObjects.Text {
    return this.scene.add.text(x, y, text, style)
      .setScrollFactor(0).setDepth(10);
  }

  update(): void {
    const rescue = this.scene.rescueSystem;
    const heli = this.scene.helicopter;
    const fuel = this.scene.fuel;

    // Score (rescued * 100 points each)
    const score = rescue.rescued * 500 + (this.scene.spawnerSystem.rescueTrips * 1000);
    this.scoreValue.setText(String(score).padStart(7, '0'));

    // Lives
    this.livesValue.setText(String(this.scene.lives).padStart(2, '0'));

    // Round
    this.rdValue.setText(String(this.scene.spawnerSystem.rescueTrips + 1).padStart(2, '0'));

    // LOAD (passengers on board)
    this.loadValue.setText(String(heli.passengers).padStart(2, '0'));

    // SAFE (rescued)
    this.safeValue.setText(String(rescue.rescued).padStart(2, '0'));

    // LOST
    this.lostValue.setText(String(rescue.dead).padStart(2, '0'));

    // Fuel gauge
    const fuelPct = Math.max(0, fuel / FUEL_MAX);
    const maxW = 178;
    this.fuelBarFill.setSize(maxW * fuelPct, 14);

    // Fuel color: blue when ok, flashes when low
    if (fuelPct < 0.2) {
      this.fuelBarFill.setFillStyle(
        Math.floor(this.scene.time.now / 200) % 2 === 0 ? 0xcc3333 : 0xff6666
      );
    } else {
      this.fuelBarFill.setFillStyle(0x4488ff);
    }

    // Update dial needles (decorative - based on heli speed/altitude)
    this.updateDials();
  }

  private updateDials(): void {
    const heli = this.scene.helicopter;
    const body = heli.body as Phaser.Physics.Arcade.Body;

    // Speed dial, altitude dial, compass dial
    const values = [
      Math.abs(body.velocity.x) / 250, // speed normalized
      1 - (heli.y / 400),              // altitude normalized
      (body.velocity.x + 250) / 500,   // heading normalized
    ];

    const dialPositions = [470, 520, 560];
    const dialRadius = 18;

    for (let i = 0; i < this.dials.length; i++) {
      const g = this.dials[i];
      const cx = dialPositions[i];
      const cy = HUD_HEIGHT / 2;
      const val = Math.max(0, Math.min(1, values[i]));

      // Redraw dial
      g.clear();
      g.fillStyle(0x111111);
      g.fillCircle(cx, cy, dialRadius);
      g.lineStyle(2, COLOR_HUD_BORDER);
      g.strokeCircle(cx, cy, dialRadius);

      // Tick marks
      g.lineStyle(1, 0x666666);
      for (let angle = -140; angle <= 140; angle += 35) {
        const rad = (angle * Math.PI) / 180;
        g.lineBetween(
          cx + Math.cos(rad) * (dialRadius - 4), cy + Math.sin(rad) * (dialRadius - 4),
          cx + Math.cos(rad) * (dialRadius - 1), cy + Math.sin(rad) * (dialRadius - 1),
        );
      }

      // Needle
      const needleAngle = -140 + val * 280;
      const rad = (needleAngle * Math.PI) / 180;
      g.lineStyle(2, 0xff4444);
      g.lineBetween(cx, cy, cx + Math.cos(rad) * (dialRadius - 5), cy + Math.sin(rad) * (dialRadius - 5));

      // Center dot
      g.fillStyle(0xffffff);
      g.fillCircle(cx, cy, 2);
    }
  }

  showDeliveryMessage(): void {
    this.messageText.setText('HOSTAGES DELIVERED!');
    this.messageText.setAlpha(1);
    this.scene.tweens.add({
      targets: this.messageText,
      alpha: 0,
      duration: 2000,
      ease: 'Power2',
    });
  }

  showMessage(text: string): void {
    this.messageText.setText(text);
    this.messageText.setAlpha(1);
    this.scene.tweens.add({
      targets: this.messageText,
      alpha: 0,
      duration: 2000,
      ease: 'Power2',
    });
  }
}
