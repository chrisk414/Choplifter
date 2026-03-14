import Phaser from 'phaser';

export class Explosion extends Phaser.GameObjects.Sprite {
  private frameIndex = 1;
  private frameTimer = 0;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'explosion-1');
    scene.add.existing(this);
    this.setDepth(8);
  }

  update(_time: number, delta: number): void {
    this.frameTimer += delta;
    if (this.frameTimer > 100) {
      this.frameTimer = 0;
      this.frameIndex++;
      if (this.frameIndex > 4) {
        this.destroy();
        return;
      }
      this.setTexture(`explosion-${this.frameIndex}`);
      this.setScale(1 + (this.frameIndex - 1) * 0.3);
    }
  }
}
