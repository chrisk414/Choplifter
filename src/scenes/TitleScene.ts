import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, COLOR_SKY } from '../constants';

export class TitleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TitleScene' });
  }

  create(): void {
    this.cameras.main.setBackgroundColor(COLOR_SKY);

    // Title
    this.add.text(GAME_WIDTH / 2, 120, 'CHOPLIFTER', {
      fontSize: '64px',
      fontFamily: 'monospace',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Subtitle
    this.add.text(GAME_WIDTH / 2, 190, 'Rescue the hostages!', {
      fontSize: '20px',
      fontFamily: 'monospace',
      color: '#88ccff',
    }).setOrigin(0.5);

    // Controls
    const controls = [
      'ARROW KEYS - Fly helicopter',
      'DOWN ARROW - Face forward',
      'SPACE - Fire',
      '',
      'Destroy barracks to free hostages',
      'Land near hostages to pick them up',
      'Fly them back to base to rescue them',
    ];

    controls.forEach((line, i) => {
      this.add.text(GAME_WIDTH / 2, 260 + i * 28, line, {
        fontSize: '16px',
        fontFamily: 'monospace',
        color: '#cccccc',
      }).setOrigin(0.5);
    });

    // Start prompt (blinking)
    const startText = this.add.text(GAME_WIDTH / 2, 480, 'PRESS ENTER TO START', {
      fontSize: '24px',
      fontFamily: 'monospace',
      color: '#ffff00',
    }).setOrigin(0.5);

    this.tweens.add({
      targets: startText,
      alpha: 0,
      duration: 500,
      yoyo: true,
      repeat: -1,
    });

    this.input.keyboard!.on('keydown-ENTER', () => {
      this.scene.start('GameScene');
    });
  }
}
