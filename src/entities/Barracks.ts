import Phaser from 'phaser';
import { BARRACKS_HEALTH, HOSTAGES_PER_BARRACKS, GROUND_Y, BARRACKS_HEIGHT } from '../constants';
import type { GameScene } from '../scenes/GameScene';

export class Barracks extends Phaser.Physics.Arcade.Sprite {
  health: number = BARRACKS_HEALTH;
  isDestroyed = false;
  private hostagesInside: number = HOSTAGES_PER_BARRACKS;
  private gameScene: GameScene;

  constructor(scene: GameScene, x: number) {
    super(scene, x, GROUND_Y - BARRACKS_HEIGHT / 2, 'barracks-intact');
    this.gameScene = scene;

    scene.add.existing(this);
    scene.physics.add.existing(this, true); // static body

    this.setDepth(4);
  }

  hit(): void {
    if (this.isDestroyed) return;

    this.health--;

    if (this.health <= 1 && this.health > 0) {
      this.setTexture('barracks-damaged');
    }

    if (this.health <= 0) {
      this.destroy_barracks();
    }

    // Flash white on hit
    this.setTintFill(0xffffff);
    this.scene.time.delayedCall(100, () => {
      this.clearTint();
    });
  }

  private destroy_barracks(): void {
    this.isDestroyed = true;
    this.setTexture('barracks-destroyed');

    // Spawn hostages
    for (let i = 0; i < this.hostagesInside; i++) {
      const offsetX = (Math.random() - 0.5) * 40;
      this.gameScene.spawnHostage(this.x + offsetX, GROUND_Y - 10);
    }
    this.hostagesInside = 0;

    // Explosion effect
    this.gameScene.spawnExplosion(this.x, this.y);
    this.gameScene.soundManager.playExplosion();
  }
}
