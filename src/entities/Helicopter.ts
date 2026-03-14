import Phaser from 'phaser';
import {
  Facing, HELI_ACCEL, HELI_DRAG, HELI_GRAVITY, HELI_MAX_SPEED_X,
  HELI_MAX_SPEED_Y, HELI_WIDTH, HELI_HEIGHT, HELI_MAX_PASSENGERS,
  HELI_SAFE_LANDING_SPEED, BULLET_SPEED, BULLET_COOLDOWN,
  GROUND_Y, BASE_X, BASE_WIDTH,
} from '../constants';
import type { GameScene } from '../scenes/GameScene';

const DOUBLE_TAP_MS = 250; // max time between taps to count as double-tap
const MAX_TILT_DEG = 15;   // max tilt angle in degrees

export class Helicopter extends Phaser.Physics.Arcade.Sprite {
  facing: Facing = Facing.RIGHT;
  passengers = 0;
  isLanded = false;
  isDead = false;

  private rotorFrame = 1;
  private rotorTimer = 0;
  private lastFireTime = 0;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private fireKey!: Phaser.Input.Keyboard.Key;
  private gameScene: GameScene;

  // Double-tap tracking
  private lastLeftTapTime = 0;
  private lastRightTapTime = 0;
  private leftWasDown = false;
  private rightWasDown = false;

  constructor(scene: GameScene, x: number, y: number) {
    super(scene, x, y, 'heli-right-1');
    this.gameScene = scene;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(HELI_WIDTH - 8, HELI_HEIGHT - 4);
    body.setOffset(4, 2);
    body.setMaxVelocity(HELI_MAX_SPEED_X, HELI_MAX_SPEED_Y);
    body.setDrag(HELI_DRAG, 0);
    body.setGravityY(HELI_GRAVITY);
    body.setCollideWorldBounds(true);

    this.cursors = scene.input.keyboard!.createCursorKeys();
    this.fireKey = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    this.setDepth(7);
  }

  update(time: number, delta: number): void {
    if (this.isDead) return;

    const body = this.body as Phaser.Physics.Arcade.Body;

    // Rotor animation
    this.rotorTimer += delta;
    if (this.rotorTimer > 80) {
      this.rotorTimer = 0;
      this.rotorFrame = this.rotorFrame === 1 ? 2 : 1;
    }

    // Check landing
    if (body.blocked.down || body.touching.down) {
      if (Math.abs(body.velocity.y) < HELI_SAFE_LANDING_SPEED) {
        this.isLanded = true;
        body.setVelocityY(0);
        body.setGravityY(0);
      } else {
        // Crash landing
        this.gameScene.helicopterCrash();
        return;
      }
    }

    // Detect double-tap for facing changes
    this.handleDoubleTap(time);

    // Movement — left/right accelerates without changing facing
    if (this.cursors.up.isDown) {
      body.setAccelerationY(-HELI_ACCEL * 1.5);
      body.setGravityY(HELI_GRAVITY);
      this.isLanded = false;
    } else if (!this.isLanded) {
      body.setAccelerationY(0);
      body.setGravityY(HELI_GRAVITY);
    } else {
      body.setAccelerationY(0);
    }

    if (this.cursors.left.isDown) {
      body.setAccelerationX(-HELI_ACCEL);
      this.isLanded = false;
    } else if (this.cursors.right.isDown) {
      body.setAccelerationX(HELI_ACCEL);
      this.isLanded = false;
    } else {
      body.setAccelerationX(0);
    }

    if (this.cursors.down.isDown) {
      this.facing = Facing.FORWARD;
    }

    // Update texture based on facing and rotor frame
    this.updateTexture();

    // Tilt based on horizontal velocity (not when forward-facing or landed)
    this.updateTilt(body);

    // Shooting
    if (this.fireKey.isDown && time - this.lastFireTime > BULLET_COOLDOWN) {
      this.lastFireTime = time;
      this.shoot();
    }
  }

  private handleDoubleTap(time: number): void {
    const leftDown = this.cursors.left.isDown;
    const rightDown = this.cursors.right.isDown;

    // Detect fresh key press (was up, now down)
    if (leftDown && !this.leftWasDown) {
      if (time - this.lastLeftTapTime < DOUBLE_TAP_MS) {
        this.facing = Facing.LEFT;
      }
      this.lastLeftTapTime = time;
    }

    if (rightDown && !this.rightWasDown) {
      if (time - this.lastRightTapTime < DOUBLE_TAP_MS) {
        this.facing = Facing.RIGHT;
      }
      this.lastRightTapTime = time;
    }

    this.leftWasDown = leftDown;
    this.rightWasDown = rightDown;
  }

  private updateTilt(body: Phaser.Physics.Arcade.Body): void {
    if (this.facing === Facing.FORWARD || this.isLanded) {
      // No tilt when facing forward or landed
      this.setAngle(0);
      return;
    }

    // Tilt proportional to horizontal velocity
    // Positive vx (moving right) → tilt nose down (positive angle when facing right)
    const vxNorm = body.velocity.x / HELI_MAX_SPEED_X; // -1 to 1
    let tiltDeg = vxNorm * MAX_TILT_DEG;

    // If facing left, the sprite is flipped, so invert tilt direction
    if (this.facing === Facing.LEFT) {
      tiltDeg = -tiltDeg;
    }

    this.setAngle(tiltDeg);
  }

  private updateTexture(): void {
    switch (this.facing) {
      case Facing.LEFT:
        this.setTexture(`heli-right-${this.rotorFrame}`);
        this.setFlipX(true);
        break;
      case Facing.RIGHT:
        this.setTexture(`heli-right-${this.rotorFrame}`);
        this.setFlipX(false);
        break;
      case Facing.FORWARD:
        this.setTexture(`heli-forward-${this.rotorFrame}`);
        this.setFlipX(false);
        break;
    }
  }

  private shoot(): void {
    let vx = 0;
    let vy = 0;

    switch (this.facing) {
      case Facing.LEFT:
        vx = -BULLET_SPEED;
        break;
      case Facing.RIGHT:
        vx = BULLET_SPEED;
        break;
      case Facing.FORWARD:
        vy = BULLET_SPEED; // shoot downward
        break;
    }

    this.gameScene.spawnBullet(this.x, this.y, vx, vy);
    this.gameScene.soundManager.playShoot();
  }

  isAtBase(): boolean {
    return this.x >= BASE_X - 40 && this.x <= BASE_X + BASE_WIDTH + 40 && this.isLanded;
  }

  die(): void {
    this.isDead = true;
    this.passengers = 0;
    this.setVisible(false);
    this.setActive(false);
    (this.body as Phaser.Physics.Arcade.Body).enable = false;
  }

  respawn(x: number, y: number): void {
    this.isDead = false;
    this.setPosition(x, y);
    this.setVisible(true);
    this.setActive(true);
    (this.body as Phaser.Physics.Arcade.Body).enable = true;
    (this.body as Phaser.Physics.Arcade.Body).setVelocity(0, 0);
    (this.body as Phaser.Physics.Arcade.Body).setGravityY(HELI_GRAVITY);
    this.facing = Facing.RIGHT;
    this.isLanded = false;
    this.passengers = 0;
    this.setAngle(0);
  }
}
