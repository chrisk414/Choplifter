import Phaser from 'phaser';
import {
  TANK_SPEED, TANK_FIRE_RATE, TANK_BULLET_SPEED,
  GROUND_Y, TANK_HEIGHT, TANK_WIDTH,
} from '../constants';
import type { GameScene } from '../scenes/GameScene';

export class Tank extends Phaser.Physics.Arcade.Sprite {
  private gameScene: GameScene;
  private lastFireTime = -1;
  private moveDirection = 1;
  private fireRate: number;

  constructor(scene: GameScene, x: number, fireRate: number = TANK_FIRE_RATE) {
    super(scene, x, GROUND_Y - TANK_HEIGHT / 2, 'tank');
    this.gameScene = scene;
    this.fireRate = fireRate;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setCollideWorldBounds(true);
    body.setImmovable(true);
    body.setAllowGravity(false);

    this.setDepth(5);
    this.moveDirection = Math.random() > 0.5 ? 1 : -1;
  }

  update(time: number, _delta: number): void {
    const body = this.body as Phaser.Physics.Arcade.Body;

    // Move slowly
    body.setVelocityX(this.moveDirection * TANK_SPEED);

    // Reverse at edges or randomly
    if (body.blocked.left || body.blocked.right || Math.random() < 0.002) {
      this.moveDirection *= -1;
    }
    this.setFlipX(this.moveDirection < 0);

    // Initialize fire timer
    if (this.lastFireTime < 0) this.lastFireTime = time;

    // Shoot at helicopter
    const heli = this.gameScene.helicopter;
    if (heli && !heli.isDead) {
      const dist = Math.abs(this.x - heli.x);
      if (dist < 400 && heli.y < this.y && time - this.lastFireTime > this.fireRate) {
        this.lastFireTime = time;
        this.fire(heli.x, heli.y);
      }
    }
  }

  private fire(targetX: number, targetY: number): void {
    const angle = Math.atan2(targetY - this.y, targetX - this.x);
    const vx = Math.cos(angle) * TANK_BULLET_SPEED;
    const vy = Math.sin(angle) * TANK_BULLET_SPEED;
    this.gameScene.spawnMissile(this.x, this.y - TANK_HEIGHT / 2, vx, vy);
  }
}
