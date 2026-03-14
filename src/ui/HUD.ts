import Phaser from 'phaser';
import {
  GAME_WIDTH, HUD_HEIGHT, FUEL_MAX,
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

  // Fuel tick marks
  private fuelTickGraphics!: Phaser.GameObjects.Graphics;

  // Instrument dials (decorative)
  private dials: Phaser.GameObjects.Graphics[] = [];

  // Dial labels
  private dialLabels: Phaser.GameObjects.Text[] = [];

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
    // Dark instrument panel background with subtle gradient effect
    this.scene.add.rectangle(GAME_WIDTH / 2, HUD_HEIGHT / 2, GAME_WIDTH, HUD_HEIGHT, 0x1a1a1a)
      .setScrollFactor(0).setDepth(10);

    // Top highlight line (subtle metallic look)
    this.scene.add.rectangle(GAME_WIDTH / 2, 1, GAME_WIDTH, 2, 0x333333)
      .setScrollFactor(0).setDepth(10);

    // Bottom border line (brighter for panel edge)
    this.scene.add.rectangle(GAME_WIDTH / 2, HUD_HEIGHT - 1, GAME_WIDTH, 3, 0x555555)
      .setScrollFactor(0).setDepth(10);

    // Vertical dividers with beveled look
    const dividers = [190, 420, 580, 720];
    for (const x of dividers) {
      this.scene.add.rectangle(x - 1, HUD_HEIGHT / 2, 1, HUD_HEIGHT - 8, 0x333333)
        .setScrollFactor(0).setDepth(10);
      this.scene.add.rectangle(x, HUD_HEIGHT / 2, 1, HUD_HEIGHT - 8, 0x555555)
        .setScrollFactor(0).setDepth(10);
      this.scene.add.rectangle(x + 1, HUD_HEIGHT / 2, 1, HUD_HEIGHT - 8, 0x333333)
        .setScrollFactor(0).setDepth(10);
    }

    // Recessed panel areas around dials
    const g = this.scene.add.graphics().setScrollFactor(0).setDepth(9.9);
    g.fillStyle(0x111111);
    g.fillRoundedRect(428, 4, 144, HUD_HEIGHT - 10, 6);
    g.lineStyle(1, 0x333333);
    g.strokeRoundedRect(428, 4, 144, HUD_HEIGHT - 10, 6);
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
    this.fuelLabel = this.txt(200, 8, 'FUEL', { ...labelStyle, color: '#88ccff' });

    // --- Center: Instrument dials (decorative) ---
    // (created in createDials)

    // --- Right section: 1UP score + LOAD/SAFE/LOST ---
    this.scoreLabel = this.txt(590, 6, '1UP', { ...labelStyle, color: '#ff4444' });
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
    const y = 28;
    const w = 200;
    const h = 18;

    // Border frame (beveled)
    this.scene.add.rectangle(x + w / 2, y + h / 2, w + 4, h + 4, 0x555555)
      .setScrollFactor(0).setDepth(9.9);
    this.scene.add.rectangle(x + w / 2, y + h / 2, w + 2, h + 2, 0x333333)
      .setScrollFactor(0).setDepth(9.95);

    // Background
    this.fuelBarBg = this.scene.add.rectangle(x + w / 2, y + h / 2, w, h, 0x000000)
      .setScrollFactor(0).setDepth(10);

    // Fill bar
    this.fuelBarFill = this.scene.add.rectangle(x + 1, y + 1, w - 2, h - 2, 0x4488ff)
      .setOrigin(0, 0).setScrollFactor(0).setDepth(10.1);

    // Red danger zone on left
    this.scene.add.rectangle(x + 1, y + 1, 44, h - 2, 0xcc3333)
      .setOrigin(0, 0).setScrollFactor(0).setDepth(10.05);

    // Tick marks on fuel gauge
    this.fuelTickGraphics = this.scene.add.graphics().setScrollFactor(0).setDepth(10.15);
    this.fuelTickGraphics.lineStyle(1, 0x000000, 0.5);
    for (let i = 1; i < 10; i++) {
      const tx = x + (w / 10) * i;
      this.fuelTickGraphics.lineBetween(tx, y + 1, tx, y + h - 1);
    }

    // "E" and "F" labels
    this.txt(x + 2, y + h + 2, 'E', { fontSize: '9px', fontFamily: 'monospace', color: '#cc3333' });
    this.txt(x + w - 8, y + h + 2, 'F', { fontSize: '9px', fontFamily: 'monospace', color: '#4488ff' });
  }

  private createDials(): void {
    // Three arcade-style instrument dials in center section
    const dialConfigs = [
      { cx: 456, label: 'SPD', colorStart: 0x22aa22, colorEnd: 0xcc3333 },
      { cx: 500, label: 'ALT', colorStart: 0x2244cc, colorEnd: 0x22aacc },
      { cx: 544, label: 'HDG', colorStart: 0xcc8822, colorEnd: 0xcccc22 },
    ];
    const dialRadius = 20;

    for (const cfg of dialConfigs) {
      const cy = HUD_HEIGHT / 2 - 2;

      const g = this.scene.add.graphics().setScrollFactor(0).setDepth(10);

      // Draw the initial dial
      this.drawDial(g, cfg.cx, cy, dialRadius, 0, cfg.colorStart, cfg.colorEnd);

      this.dials.push(g);

      // Dial label below
      this.dialLabels.push(
        this.txt(cfg.cx - 8, cy + dialRadius + 2, cfg.label, {
          fontSize: '8px',
          fontFamily: 'monospace',
          color: '#666666',
        })
      );
    }
  }

  private drawDial(
    g: Phaser.GameObjects.Graphics,
    cx: number, cy: number, r: number,
    value: number,
    colorStart: number, colorEnd: number
  ): void {
    g.clear();

    // Dial background
    g.fillStyle(0x0a0a0a);
    g.fillCircle(cx, cy, r);

    // Colored arc sectors
    const arcStart = -140;
    const arcEnd = 140;
    const segments = 8;
    const segAngle = (arcEnd - arcStart) / segments;
    for (let s = 0; s < segments; s++) {
      const t = s / (segments - 1);
      const sr = ((colorStart >> 16) & 0xff);
      const sg = ((colorStart >> 8) & 0xff);
      const sb = (colorStart & 0xff);
      const er = ((colorEnd >> 16) & 0xff);
      const eg = ((colorEnd >> 8) & 0xff);
      const eb = (colorEnd & 0xff);
      const cr = Math.round(sr + (er - sr) * t);
      const cg = Math.round(sg + (eg - sg) * t);
      const cb = Math.round(sb + (eb - sb) * t);
      const color = (cr << 16) | (cg << 8) | cb;

      const a1 = arcStart + s * segAngle;
      const a2 = a1 + segAngle;
      g.lineStyle(3, color, 0.6);
      g.beginPath();
      g.arc(cx, cy, r - 3, Phaser.Math.DegToRad(a1), Phaser.Math.DegToRad(a2));
      g.strokePath();
    }

    // Outer ring
    g.lineStyle(2, 0x555555);
    g.strokeCircle(cx, cy, r);

    // Major tick marks
    g.lineStyle(1, 0x888888);
    for (let angle = arcStart; angle <= arcEnd; angle += 35) {
      const rad = Phaser.Math.DegToRad(angle);
      g.lineBetween(
        cx + Math.cos(rad) * (r - 6), cy + Math.sin(rad) * (r - 6),
        cx + Math.cos(rad) * (r - 2), cy + Math.sin(rad) * (r - 2),
      );
    }

    // Minor tick marks
    g.lineStyle(1, 0x444444);
    for (let angle = arcStart; angle <= arcEnd; angle += 17.5) {
      const rad = Phaser.Math.DegToRad(angle);
      g.lineBetween(
        cx + Math.cos(rad) * (r - 5), cy + Math.sin(rad) * (r - 5),
        cx + Math.cos(rad) * (r - 2), cy + Math.sin(rad) * (r - 2),
      );
    }

    // Needle
    const needleAngle = arcStart + Math.max(0, Math.min(1, value)) * (arcEnd - arcStart);
    const rad = Phaser.Math.DegToRad(needleAngle);
    g.lineStyle(2, 0xff3333);
    g.lineBetween(
      cx - Math.cos(rad) * 3, cy - Math.sin(rad) * 3,
      cx + Math.cos(rad) * (r - 6), cy + Math.sin(rad) * (r - 6)
    );

    // Center hub
    g.fillStyle(0xcccccc);
    g.fillCircle(cx, cy, 3);
    g.fillStyle(0x888888);
    g.fillCircle(cx, cy, 1.5);
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

    // Score (rescued * 500 + trip bonus)
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
    const maxW = 198;
    this.fuelBarFill.setSize(maxW * fuelPct, 16);

    // Fuel color: blue when ok, flashes when low
    if (fuelPct < 0.2) {
      this.fuelBarFill.setFillStyle(
        Math.floor(this.scene.time.now / 200) % 2 === 0 ? 0xcc3333 : 0xff6666
      );
    } else {
      this.fuelBarFill.setFillStyle(0x4488ff);
    }

    // Update dial needles
    this.updateDials();
  }

  private updateDials(): void {
    const heli = this.scene.helicopter;
    const body = heli.body as Phaser.Physics.Arcade.Body;

    const values = [
      Math.abs(body.velocity.x) / 250,
      1 - (heli.y / 400),
      (body.velocity.x + 250) / 500,
    ];

    const dialConfigs = [
      { cx: 456, colorStart: 0x22aa22, colorEnd: 0xcc3333 },
      { cx: 500, colorStart: 0x2244cc, colorEnd: 0x22aacc },
      { cx: 544, colorStart: 0xcc8822, colorEnd: 0xcccc22 },
    ];
    const dialRadius = 20;

    for (let i = 0; i < this.dials.length; i++) {
      const cy = HUD_HEIGHT / 2 - 2;
      this.drawDial(
        this.dials[i], dialConfigs[i].cx, cy, dialRadius,
        values[i], dialConfigs[i].colorStart, dialConfigs[i].colorEnd
      );
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
