import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../constants';

interface GameOverData {
  rescued: number;
  dead: number;
  remaining: number;
}

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene' });
  }

  create(data: GameOverData): void {
    this.cameras.main.setBackgroundColor(0x000000);

    this.add.text(GAME_WIDTH / 2, 100, 'GAME OVER', {
      fontSize: '48px',
      fontFamily: 'monospace',
      color: '#ff4444',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    const rescued = data.rescued ?? 0;
    const dead = data.dead ?? 0;
    const remaining = data.remaining ?? 0;

    const lines = [
      `Hostages Rescued:   ${rescued}`,
      `Hostages Lost:      ${dead}`,
      `Hostages Remaining: ${remaining}`,
    ];

    lines.forEach((line, i) => {
      this.add.text(GAME_WIDTH / 2, 220 + i * 36, line, {
        fontSize: '20px',
        fontFamily: 'monospace',
        color: '#ffffff',
      }).setOrigin(0.5);
    });

    // Rating
    let rating = 'FAILED';
    let ratingColor = '#ff4444';
    if (rescued >= 60) {
      rating = 'LEGENDARY!';
      ratingColor = '#ffff00';
    } else if (rescued >= 48) {
      rating = 'EXCELLENT!';
      ratingColor = '#44ff44';
    } else if (rescued >= 32) {
      rating = 'GOOD';
      ratingColor = '#88cc88';
    } else if (rescued >= 16) {
      rating = 'FAIR';
      ratingColor = '#cccc88';
    }

    this.add.text(GAME_WIDTH / 2, 360, rating, {
      fontSize: '36px',
      fontFamily: 'monospace',
      color: ratingColor,
      fontStyle: 'bold',
    }).setOrigin(0.5);

    const startText = this.add.text(GAME_WIDTH / 2, 460, 'PRESS ENTER TO PLAY AGAIN', {
      fontSize: '20px',
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
