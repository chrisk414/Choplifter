import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, GROUND_Y, COLOR_GROUND, COLOR_MOUNTAIN, COLOR_HILL } from '../constants';
import { renderSprite, renderSilhouette } from '../sprites/SpriteRenderer';
import {
  HELI_RIGHT_1, HELI_RIGHT_2, HELI_FORWARD_1, HELI_FORWARD_2,
  HOSTAGE_WALK_1, HOSTAGE_WALK_2, HOSTAGE_WAVE, HOSTAGE_DEAD,
  BARRACKS_INTACT, BARRACKS_DAMAGED, BARRACKS_DESTROYED,
  HOME_BASE, TANK_SPRITE, JET_SPRITE, UFO_SPRITE,
  BULLET_SPRITE, MISSILE_SPRITE,
  EXPLOSION_1, EXPLOSION_2, EXPLOSION_3, EXPLOSION_4,
  MOUNTAIN_HEIGHTS, HILL_HEIGHTS,
} from '../sprites/SpriteData';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  create(): void {
    // Helicopter textures
    renderSprite(this, 'heli-right-1', HELI_RIGHT_1);
    renderSprite(this, 'heli-right-2', HELI_RIGHT_2);
    renderSprite(this, 'heli-forward-1', HELI_FORWARD_1);
    renderSprite(this, 'heli-forward-2', HELI_FORWARD_2);

    // Hostage textures
    renderSprite(this, 'hostage-walk-1', HOSTAGE_WALK_1);
    renderSprite(this, 'hostage-walk-2', HOSTAGE_WALK_2);
    renderSprite(this, 'hostage-wave', HOSTAGE_WAVE);
    renderSprite(this, 'hostage-dead', HOSTAGE_DEAD);

    // Barracks textures
    renderSprite(this, 'barracks-intact', BARRACKS_INTACT);
    renderSprite(this, 'barracks-damaged', BARRACKS_DAMAGED);
    renderSprite(this, 'barracks-destroyed', BARRACKS_DESTROYED);

    // Home base
    renderSprite(this, 'base', HOME_BASE);

    // Enemy textures
    renderSprite(this, 'tank', TANK_SPRITE);
    renderSprite(this, 'jet', JET_SPRITE);
    renderSprite(this, 'ufo', UFO_SPRITE);

    // Projectile textures
    renderSprite(this, 'bullet', BULLET_SPRITE);
    renderSprite(this, 'missile', MISSILE_SPRITE);

    // Explosion textures
    renderSprite(this, 'explosion-1', EXPLOSION_1);
    renderSprite(this, 'explosion-2', EXPLOSION_2);
    renderSprite(this, 'explosion-3', EXPLOSION_3);
    renderSprite(this, 'explosion-4', EXPLOSION_4);

    // Background silhouettes
    renderSilhouette(this, 'mountains', MOUNTAIN_HEIGHTS, GAME_WIDTH, 200, COLOR_MOUNTAIN);
    renderSilhouette(this, 'hills', HILL_HEIGHTS, GAME_WIDTH, 120, COLOR_HILL);

    // Ground texture
    this.generateGroundTexture();

    this.scene.start('TitleScene');
  }

  private generateGroundTexture(): void {
    const g = this.add.graphics().setVisible(false);
    const groundH = GAME_HEIGHT - GROUND_Y;
    g.fillStyle(COLOR_GROUND);
    g.fillRect(0, 0, GAME_WIDTH, groundH);
    // Grass detail on top edge
    g.fillStyle(0x6aaa3a);
    for (let x = 0; x < GAME_WIDTH; x += 6) {
      const h = 2 + Math.floor(Math.random() * 3);
      g.fillRect(x, 0, 3, h);
    }
    g.fillStyle(0x4a7a2a);
    for (let x = 3; x < GAME_WIDTH; x += 8) {
      g.fillRect(x, 0, 2, 2);
    }
    g.generateTexture('ground', GAME_WIDTH, groundH);
    g.destroy();
  }
}
