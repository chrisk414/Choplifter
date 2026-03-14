import Phaser from 'phaser';
import { HOSTAGE_SPEED, HOSTAGE_BOARD_RANGE, GROUND_Y, HOSTAGE_HEIGHT } from '../constants';
import type { GameScene } from '../scenes/GameScene';

export enum HostageState {
  FREED = 'freed',
  FLEEING = 'fleeing',
  BOARDING = 'boarding',
  RESCUED = 'rescued',
  DEAD = 'dead',
}

export class Hostage extends Phaser.Physics.Arcade.Sprite {
  hostageState: HostageState = HostageState.FREED;
  private walkTimer = 0;
  private walkFrame = 1;
  private fleeDirection = 1;
  private gameScene: GameScene;

  constructor(scene: GameScene, x: number, y: number) {
    super(scene, x, y, 'hostage-walk-1');
    this.gameScene = scene;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setGravityY(300);
    body.setCollideWorldBounds(true);

    this.setDepth(5);

    // Random flee direction
    this.fleeDirection = Math.random() > 0.5 ? 1 : -1;
  }

  update(time: number, delta: number): void {
    if (this.hostageState === HostageState.DEAD || this.hostageState === HostageState.RESCUED) {
      return;
    }

    const body = this.body as Phaser.Physics.Arcade.Body;
    const heli = this.gameScene.helicopter;

    // Walk animation
    this.walkTimer += delta;
    if (this.walkTimer > 200) {
      this.walkTimer = 0;
      this.walkFrame = this.walkFrame === 1 ? 2 : 1;
      this.setTexture(`hostage-walk-${this.walkFrame}`);
    }

    switch (this.hostageState) {
      case HostageState.FREED:
        // Scatter from barracks
        body.setVelocityX(this.fleeDirection * HOSTAGE_SPEED * 2);
        this.hostageState = HostageState.FLEEING;
        break;

      case HostageState.FLEEING:
        // If helicopter is landed and nearby, move toward it
        if (heli && heli.isLanded && !heli.isDead) {
          const dist = Math.abs(this.x - heli.x);
          if (dist < HOSTAGE_BOARD_RANGE * 3) {
            // Move toward helicopter
            const dir = this.x < heli.x ? 1 : -1;
            body.setVelocityX(dir * HOSTAGE_SPEED * 1.5);
            this.setFlipX(dir < 0);

            if (dist < HOSTAGE_BOARD_RANGE) {
              this.hostageState = HostageState.BOARDING;
            }
          } else {
            // Wander slowly
            body.setVelocityX(this.fleeDirection * HOSTAGE_SPEED * 0.5);
          }
        } else {
          body.setVelocityX(this.fleeDirection * HOSTAGE_SPEED * 0.5);
          // Occasionally change direction
          if (Math.random() < 0.005) {
            this.fleeDirection *= -1;
          }
        }
        break;

      case HostageState.BOARDING:
        // Move toward helicopter
        if (heli && heli.isLanded && !heli.isDead) {
          const dir = this.x < heli.x ? 1 : -1;
          body.setVelocityX(dir * HOSTAGE_SPEED * 2);
        }
        break;
    }

    // Keep on ground
    if (this.y > GROUND_Y - HOSTAGE_HEIGHT / 2) {
      this.y = GROUND_Y - HOSTAGE_HEIGHT / 2;
      body.setVelocityY(0);
    }
  }

  kill(): void {
    this.hostageState = HostageState.DEAD;
    this.setTexture('hostage-dead');
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(0, 0);
    body.enable = false;

    this.gameScene.soundManager.playExplosion();

    // Fade out and destroy
    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      duration: 1000,
      onComplete: () => {
        this.destroy();
      },
    });
  }

  board(): void {
    this.hostageState = HostageState.RESCUED;
    this.setVisible(false);
    this.setActive(false);
    (this.body as Phaser.Physics.Arcade.Body).enable = false;
    this.destroy();
  }
}
