import Phaser from 'phaser';
import { GAME_WIDTH } from '../constants';
import type { GameScene } from '../scenes/GameScene';

export class HUD {
  private scene: GameScene;
  private rescuedText: Phaser.GameObjects.Text;
  private remainingText: Phaser.GameObjects.Text;
  private livesText: Phaser.GameObjects.Text;
  private passengersText: Phaser.GameObjects.Text;
  private messageText: Phaser.GameObjects.Text;

  constructor(scene: GameScene) {
    this.scene = scene;

    const style: Phaser.Types.GameObjects.Text.TextStyle = {
      fontSize: '16px',
      fontFamily: 'monospace',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3,
    };

    this.rescuedText = scene.add.text(10, 10, '', style)
      .setScrollFactor(0).setDepth(10);

    this.remainingText = scene.add.text(GAME_WIDTH / 2, 10, '', style)
      .setOrigin(0.5, 0).setScrollFactor(0).setDepth(10);

    this.livesText = scene.add.text(GAME_WIDTH - 10, 10, '', style)
      .setOrigin(1, 0).setScrollFactor(0).setDepth(10);

    this.passengersText = scene.add.text(10, 30, '', style)
      .setScrollFactor(0).setDepth(10);

    this.messageText = scene.add.text(GAME_WIDTH / 2, 80, '', {
      ...style,
      fontSize: '24px',
      color: '#ffff00',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(10).setAlpha(0);
  }

  update(): void {
    const rescue = this.scene.rescueSystem;
    const heli = this.scene.helicopter;

    this.rescuedText.setText(`RESCUED: ${rescue.rescued}`);
    this.remainingText.setText(`REMAINING: ${rescue.remaining}`);
    this.livesText.setText(`LIVES: ${this.scene.lives}`);
    this.passengersText.setText(
      heli.passengers > 0 ? `CARRYING: ${heli.passengers}` : ''
    );
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
