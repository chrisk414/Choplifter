import Phaser from 'phaser';
import {
  JET_SPEED, JET_FIRE_RATE, JET_MISSILE_SPEED,
  JET_WIDTH, WORLD_WIDTH, HUD_HEIGHT, GROUND_Y,
} from '../constants';
import type { GameScene } from '../scenes/GameScene';

export class Jet extends Phaser.Physics.Arcade.Sprite {
  private gameScene: GameScene;
  private lastFireTime = -1; // -1 means not yet initialized
  private speed: number;
  private fireRate: number;

  constructor(scene: GameScene, fromRight: boolean, speed: number = JET_SPEED, fireRate: number = JET_FIRE_RATE) {
    const startX = fromRight ? WORLD_WIDTH + 50 : -50;
    const y = HUD_HEIGHT + 20 + Math.random() * (GROUND_Y - HUD_HEIGHT - 100);
    super(scene, startX, y, 'jet');

    this.gameScene = scene;
    this.speed = speed;
    this.fireRate = fireRate;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
    body.setVelocityX(fromRight ? -this.speed : this.speed);

    this.setFlipX(fromRight);
    this.setDepth(6);
  }

  update(time: number, _delta: number): void {
    // Remove if off-screen
    if (this.x < -100 || this.x > WORLD_WIDTH + 100) {
      this.destroy();
      return;
    }

    // Initialize fire timer on first visible update
    if (this.lastFireTime < 0) {
      this.lastFireTime = time;
    }

    // Shoot at helicopter
    const heli = this.gameScene.helicopter;
    if (heli && !heli.isDead && time - this.lastFireTime > this.fireRate) {
      const dist = Math.abs(this.x - heli.x);
      if (dist < 500) {
        this.lastFireTime = time;
        this.fire(heli.x, heli.y);
      }
    }
  }

  private fire(targetX: number, targetY: number): void {
    const angle = Math.atan2(targetY - this.y, targetX - this.x);
    const vx = Math.cos(angle) * JET_MISSILE_SPEED;
    const vy = Math.sin(angle) * JET_MISSILE_SPEED;
    this.gameScene.spawnMissile(this.x, this.y, vx, vy);
  }
}
