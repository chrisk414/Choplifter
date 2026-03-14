import Phaser from 'phaser';
import {
  UFO_SPEED, UFO_FIRE_RATE, UFO_HEALTH,
  UFO_SIZE, WORLD_WIDTH, GAME_WIDTH, HUD_HEIGHT, GROUND_Y,
} from '../constants';
import type { GameScene } from '../scenes/GameScene';

export class Ufo extends Phaser.Physics.Arcade.Sprite {
  health: number = UFO_HEALTH;
  private gameScene: GameScene;
  private lastFireTime = -1;
  private speed: number;
  private fireRate: number;
  private sineOffset: number;
  private sineAmplitude: number;
  private baseY: number;
  private moveAngle = 0;

  constructor(scene: GameScene, speed: number = UFO_SPEED, fireRate: number = UFO_FIRE_RATE) {
    const startX = Math.random() > 0.5 ? WORLD_WIDTH + 50 : -50;
    const y = HUD_HEIGHT + 30 + Math.random() * (GROUND_Y - HUD_HEIGHT - 120);
    super(scene, startX, y, 'ufo');

    this.gameScene = scene;
    this.speed = speed;
    this.fireRate = fireRate;
    this.baseY = y;
    this.sineOffset = Math.random() * Math.PI * 2;
    this.sineAmplitude = 40 + Math.random() * 40;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);

    // Move toward center of world
    const dir = startX > WORLD_WIDTH / 2 ? -1 : 1;
    body.setVelocityX(dir * this.speed);

    this.setDepth(6);
  }

  update(time: number, delta: number): void {
    // Remove if far off-screen
    if (this.x < -200 || this.x > WORLD_WIDTH + 200) {
      this.destroy();
      return;
    }

    // Sine wave movement
    this.moveAngle += delta * 0.003;
    this.y = this.baseY + Math.sin(this.moveAngle + this.sineOffset) * this.sineAmplitude;

    // Initialize fire timer
    if (this.lastFireTime < 0) this.lastFireTime = time;

    // Only fire when on-screen
    const cam = this.gameScene.cameras.main;
    const onScreen = this.x > cam.scrollX - 20 && this.x < cam.scrollX + GAME_WIDTH + 20;

    const heli = this.gameScene.helicopter;
    if (onScreen && heli && !heli.isDead && time - this.lastFireTime > this.fireRate) {
      const dist = Math.abs(this.x - heli.x);
      if (dist < 600) {
        this.lastFireTime = time;
        this.fireSpread(heli.x, heli.y);
      }
    }
  }

  private fireSpread(targetX: number, targetY: number): void {
    const baseAngle = Math.atan2(targetY - this.y, targetX - this.x);
    const spread = 0.3;
    const missileSpeed = 180;

    for (let i = -1; i <= 1; i++) {
      const angle = baseAngle + i * spread;
      const vx = Math.cos(angle) * missileSpeed;
      const vy = Math.sin(angle) * missileSpeed;
      this.gameScene.spawnMissile(this.x, this.y, vx, vy);
    }
  }

  hit(): boolean {
    this.health--;
    this.setTintFill(0xffffff);
    this.scene.time.delayedCall(100, () => {
      this.clearTint();
    });
    return this.health <= 0;
  }
}
