import Phaser from 'phaser';
import {
  GAME_WIDTH, GAME_HEIGHT, WORLD_WIDTH, GROUND_Y, HUD_HEIGHT,
  BASE_X, BARRACKS_POSITIONS, HELI_LIVES,
  COLOR_SKY, FUEL_MAX, FUEL_DRAIN_RATE, FUEL_REFUEL_RATE,
} from '../constants';
import { Helicopter } from '../entities/Helicopter';
import { Hostage, HostageState } from '../entities/Hostage';
import { Barracks } from '../entities/Barracks';
import { Tank } from '../entities/Tank';
import { Jet } from '../entities/Jet';
import { Ufo } from '../entities/Ufo';
import { Explosion } from '../entities/Explosion';
import { SpawnerSystem } from '../systems/SpawnerSystem';
import { RescueSystem } from '../systems/RescueSystem';
import { HUD } from '../ui/HUD';
import { SoundManager } from '../audio/SoundManager';

export class GameScene extends Phaser.Scene {
  helicopter!: Helicopter;
  hostageGroup!: Phaser.Physics.Arcade.Group;
  hud!: HUD;
  soundManager!: SoundManager;
  spawnerSystem!: SpawnerSystem;
  rescueSystem!: RescueSystem;
  lives = HELI_LIVES;
  fuel = FUEL_MAX;

  private bulletGroup!: Phaser.Physics.Arcade.Group;
  private missileGroup!: Phaser.Physics.Arcade.Group;
  private barracksGroup!: Phaser.Physics.Arcade.Group;
  private tankGroup!: Phaser.Physics.Arcade.Group;
  private jetGroup!: Phaser.Physics.Arcade.Group;
  private ufoGroup!: Phaser.Physics.Arcade.Group;
  private explosions: Explosion[] = [];
  private groundPlatform!: Phaser.Physics.Arcade.StaticGroup;
  private mountainBg!: Phaser.GameObjects.TileSprite;
  private hillBg!: Phaser.GameObjects.TileSprite;
  private clouds: Phaser.GameObjects.Image[] = [];
  private debugMode = false;
  private gameOverTriggered = false;

  constructor() {
    super({ key: 'GameScene' });
  }

  create(): void {
    this.lives = HELI_LIVES;
    this.fuel = FUEL_MAX;
    this.gameOverTriggered = false;

    // Sound
    this.soundManager = new SoundManager();
    this.soundManager.init();

    // Sky background (bright cyan)
    this.cameras.main.setBackgroundColor(COLOR_SKY);

    // Parallax mountain background
    this.mountainBg = this.add.tileSprite(0, GROUND_Y - 140, GAME_WIDTH, 180, 'mountains')
      .setOrigin(0, 0).setScrollFactor(0).setDepth(1);

    // Green hills in front of mountains
    this.hillBg = this.add.tileSprite(0, GROUND_Y - 60, GAME_WIDTH, 100, 'hills')
      .setOrigin(0, 0).setScrollFactor(0).setDepth(2);

    // Clouds scattered across the sky
    this.createClouds();

    // Ground (desert sand with grass strip)
    this.groundPlatform = this.physics.add.staticGroup();
    const groundTiles = Math.ceil(WORLD_WIDTH / GAME_WIDTH) + 1;
    for (let i = 0; i < groundTiles; i++) {
      const ground = this.groundPlatform.create(
        i * GAME_WIDTH + GAME_WIDTH / 2,
        GROUND_Y + (GAME_HEIGHT - GROUND_Y) / 2,
        'ground'
      ) as Phaser.Physics.Arcade.Sprite;
      ground.setDepth(3);
      ground.refreshBody();
    }

    // Scatter rocks across the desert ground
    this.createRocks();

    // Home base
    this.add.image(BASE_X + 20, GROUND_Y - 24, 'base').setDepth(4);

    // Barracks
    this.barracksGroup = this.physics.add.group({ classType: Barracks, runChildUpdate: false });
    for (const pos of BARRACKS_POSITIONS) {
      new Barracks(this, pos);
    }

    // Entity groups
    this.bulletGroup = this.physics.add.group({ defaultKey: 'bullet' });
    this.missileGroup = this.physics.add.group({ defaultKey: 'missile' });
    this.hostageGroup = this.physics.add.group({ classType: Hostage, runChildUpdate: false });
    this.tankGroup = this.physics.add.group({ classType: Tank, runChildUpdate: false });
    this.jetGroup = this.physics.add.group({ classType: Jet, runChildUpdate: false });
    this.ufoGroup = this.physics.add.group({ classType: Ufo, runChildUpdate: false });

    // Helicopter
    this.helicopter = new Helicopter(this, BASE_X + 130, GROUND_Y - 40);

    // Camera - offset to account for HUD panel at top
    this.cameras.main.setBounds(0, 0, WORLD_WIDTH, GAME_HEIGHT);
    this.cameras.main.startFollow(this.helicopter, true, 0.1, 0.1);

    // Physics world bounds
    this.physics.world.setBounds(0, HUD_HEIGHT, WORLD_WIDTH, GAME_HEIGHT - HUD_HEIGHT);

    // Collisions
    this.setupCollisions();

    // Systems
    this.spawnerSystem = new SpawnerSystem(this);
    this.rescueSystem = new RescueSystem(this);

    // HUD (drawn on top of everything)
    this.hud = new HUD(this);

    // Debug toggle
    this.input.keyboard!.on('keydown-BACKQUOTE', () => {
      this.debugMode = !this.debugMode;
      this.physics.world.drawDebug = this.debugMode;
      if (!this.debugMode) {
        this.physics.world.debugGraphic?.clear();
      }
    });

    // Expose game state for Playwright tests
    this.updateDebugState();
  }

  private createClouds(): void {
    this.clouds = [];
    const cloudTextures = ['cloud-1', 'cloud-2', 'cloud-3', 'cloud-4', 'cloud-5'];

    // Place clouds across the world
    for (let x = 100; x < WORLD_WIDTH; x += 150 + Math.random() * 300) {
      const tex = cloudTextures[Math.floor(Math.random() * cloudTextures.length)];
      const y = HUD_HEIGHT + 20 + Math.random() * (GROUND_Y - HUD_HEIGHT - 200);
      const cloud = this.add.image(x, y, tex)
        .setDepth(0.5)
        .setAlpha(0.8 + Math.random() * 0.2)
        .setScale(1 + Math.random() * 1.5);
      this.clouds.push(cloud);
    }
  }

  private createRocks(): void {
    const rockTextures = ['rock-1', 'rock-2', 'rock-3', 'rock-4'];

    for (let x = 300; x < WORLD_WIDTH; x += 60 + Math.random() * 200) {
      const tex = rockTextures[Math.floor(Math.random() * rockTextures.length)];
      const offsetY = 20 + Math.random() * (GAME_HEIGHT - GROUND_Y - 40);
      this.add.image(x, GROUND_Y + offsetY, tex)
        .setDepth(3.5)
        .setAlpha(0.7 + Math.random() * 0.3);
    }
  }

  update(time: number, delta: number): void {
    // Update helicopter
    this.helicopter.update(time, delta);

    // Fuel system
    this.updateFuel();

    // Update hostages
    const hostages = this.hostageGroup.getChildren().slice();
    for (const h of hostages) {
      if (h.active) (h as Hostage).update(time, delta);
    }

    // Update enemies
    const tanks = this.tankGroup.getChildren().slice();
    for (const t of tanks) {
      if (t.active) (t as Tank).update(time, delta);
    }

    const jets = this.jetGroup.getChildren().slice();
    for (const j of jets) {
      if (j.active) (j as Jet).update(time, delta);
    }

    const ufos = this.ufoGroup.getChildren().slice();
    for (const u of ufos) {
      if (u.active) (u as Ufo).update(time, delta);
    }

    // Update explosions
    this.explosions = this.explosions.filter(e => e.active);
    for (const e of this.explosions) {
      e.update(time, delta);
    }

    // Clean up off-screen bullets/missiles
    this.cleanupProjectiles();

    // Parallax scrolling
    const camX = this.cameras.main.scrollX;
    this.mountainBg.tilePositionX = camX * 0.3;
    this.hillBg.tilePositionX = camX * 0.6;

    // Systems
    this.spawnerSystem.update(time);
    this.rescueSystem.update();

    // HUD
    this.hud.update();

    // Check game over
    this.checkGameOver();

    // Debug state for tests
    this.updateDebugState();
  }

  private updateFuel(): void {
    if (this.helicopter.isDead) return;

    if (this.helicopter.isAtBase()) {
      // Refuel at base
      this.fuel = Math.min(FUEL_MAX, this.fuel + FUEL_REFUEL_RATE);
    } else if (!this.helicopter.isLanded) {
      // Drain fuel while flying
      this.fuel -= FUEL_DRAIN_RATE;
    }

    // Out of fuel = crash
    if (this.fuel <= 0) {
      this.fuel = 0;
      this.helicopterCrash();
    }
  }

  private setupCollisions(): void {
    // Helicopter lands on ground
    this.physics.add.collider(this.helicopter, this.groundPlatform);

    // Hostages on ground
    this.physics.add.collider(this.hostageGroup, this.groundPlatform);

    // Tanks on ground
    this.physics.add.collider(this.tankGroup, this.groundPlatform);

    // Bullets hit barracks
    this.physics.add.overlap(this.bulletGroup, this.barracksGroup, (_bullet, _barracks) => {
      const bullet = _bullet as Phaser.Physics.Arcade.Sprite;
      const barracks = _barracks as Barracks;
      bullet.destroy();
      barracks.hit();
    });

    // Bullets hit tanks
    this.physics.add.overlap(this.bulletGroup, this.tankGroup, (_bullet, _tank) => {
      const bullet = _bullet as Phaser.Physics.Arcade.Sprite;
      const tank = _tank as Tank;
      bullet.destroy();
      this.spawnExplosion(tank.x, tank.y);
      this.soundManager.playExplosion();
      tank.destroy();
    });

    // Bullets hit jets
    this.physics.add.overlap(this.bulletGroup, this.jetGroup, (_bullet, _jet) => {
      const bullet = _bullet as Phaser.Physics.Arcade.Sprite;
      const jet = _jet as Jet;
      bullet.destroy();
      this.spawnExplosion(jet.x, jet.y);
      this.soundManager.playExplosion();
      jet.destroy();
    });

    // Bullets hit UFOs
    this.physics.add.overlap(this.bulletGroup, this.ufoGroup, (_bullet, _ufo) => {
      const bullet = _bullet as Phaser.Physics.Arcade.Sprite;
      const ufo = _ufo as Ufo;
      bullet.destroy();
      if (ufo.hit()) {
        this.spawnExplosion(ufo.x, ufo.y);
        this.soundManager.playExplosion();
        ufo.destroy();
      }
    });

    // Missiles hit helicopter
    this.physics.add.overlap(this.missileGroup, this.helicopter, (_heli, _missile) => {
      const missile = _missile as Phaser.Physics.Arcade.Sprite;
      missile.destroy();
      this.helicopterCrash();
    });

    // Missiles hit hostages
    this.physics.add.overlap(this.missileGroup, this.hostageGroup, (_missile, _hostage) => {
      const missile = _missile as Phaser.Physics.Arcade.Sprite;
      const hostage = _hostage as Hostage;
      missile.destroy();
      if (hostage.hostageState !== HostageState.DEAD) {
        hostage.kill();
        this.rescueSystem.hostageKilled();
      }
    });

    // Helicopter overlaps hostages (for boarding)
    this.physics.add.overlap(this.helicopter, this.hostageGroup, (_heli, _hostage) => {
      const hostage = _hostage as Hostage;
      const heli = this.helicopter;

      // If helicopter is landing fast, kill hostages underneath
      if (!heli.isLanded && (heli.body as Phaser.Physics.Arcade.Body).velocity.y > 50) {
        if (hostage.hostageState !== HostageState.DEAD) {
          hostage.kill();
          this.rescueSystem.hostageKilled();
        }
      }
    });
  }

  helicopterCrash(): void {
    if (this.helicopter.isDead) return;

    // Kill carried hostages
    const lostPassengers = this.helicopter.passengers;
    for (let i = 0; i < lostPassengers; i++) {
      this.rescueSystem.hostageKilled();
    }

    this.spawnExplosion(this.helicopter.x, this.helicopter.y);
    this.soundManager.playCrash();
    this.cameras.main.shake(300, 0.02);

    this.helicopter.die();
    this.lives--;

    if (this.lives > 0) {
      // Respawn after delay
      this.time.delayedCall(2000, () => {
        this.helicopter.respawn(BASE_X + 130, GROUND_Y - 60);
        this.fuel = FUEL_MAX;
        this.hud.showMessage('GET READY!');
      });
    }
  }

  private checkGameOver(): void {
    if (this.gameOverTriggered) return;

    if (this.lives <= 0 && this.helicopter.isDead) {
      this.gameOverTriggered = true;
      this.time.delayedCall(2000, () => {
        this.scene.start('GameOverScene', {
          rescued: this.rescueSystem.rescued,
          dead: this.rescueSystem.dead,
          remaining: this.rescueSystem.remaining,
        });
      });
    }

    if (this.rescueSystem.isGameComplete) {
      this.gameOverTriggered = true;
      this.time.delayedCall(1000, () => {
        this.scene.start('GameOverScene', {
          rescued: this.rescueSystem.rescued,
          dead: this.rescueSystem.dead,
          remaining: this.rescueSystem.remaining,
        });
      });
    }
  }

  private cleanupProjectiles(): void {
    for (const bullet of this.bulletGroup.getChildren()) {
      const b = bullet as Phaser.Physics.Arcade.Sprite;
      if (b.x < -50 || b.x > WORLD_WIDTH + 50 || b.y < -50 || b.y > GAME_HEIGHT + 50) {
        b.destroy();
      }
    }
    for (const missile of this.missileGroup.getChildren()) {
      const m = missile as Phaser.Physics.Arcade.Sprite;
      if (m.x < -50 || m.x > WORLD_WIDTH + 50 || m.y < -50 || m.y > GAME_HEIGHT + 50) {
        m.destroy();
      }
    }
  }

  private updateDebugState(): void {
    (window as any).__gameState = {
      helicopterX: this.helicopter.x,
      helicopterY: this.helicopter.y,
      helicopterDead: this.helicopter.isDead,
      hostagesRescued: this.rescueSystem.rescued,
      hostagesRemaining: this.rescueSystem.remaining,
      hostagesDead: this.rescueSystem.dead,
      passengers: this.helicopter.passengers,
      lives: this.lives,
      fuel: this.fuel,
      scene: this.scene.key,
    };
  }

  // --- Spawn helpers (called by entities and systems) ---

  spawnBullet(x: number, y: number, vx: number, vy: number): void {
    const bullet = this.bulletGroup.create(x, y, 'bullet') as Phaser.Physics.Arcade.Sprite;
    bullet.setDepth(8);
    const body = bullet.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
    body.setVelocity(vx, vy);
  }

  spawnMissile(x: number, y: number, vx: number, vy: number): void {
    const missile = this.missileGroup.create(x, y, 'missile') as Phaser.Physics.Arcade.Sprite;
    missile.setDepth(8);
    const body = missile.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
    body.setVelocity(vx, vy);
  }

  spawnHostage(x: number, y: number): void {
    const hostage = new Hostage(this, x, y);
    this.hostageGroup.add(hostage);
  }

  spawnExplosion(x: number, y: number): void {
    const explosion = new Explosion(this, x, y);
    this.explosions.push(explosion);
  }

  spawnTank(x: number, fireRate: number): void {
    const tank = new Tank(this, x, fireRate);
    this.tankGroup.add(tank);
  }

  spawnJet(fromRight: boolean, speed: number, fireRate: number): void {
    const jet = new Jet(this, fromRight, speed, fireRate);
    this.jetGroup.add(jet);
  }

  spawnUfo(speed: number, fireRate: number): void {
    const ufo = new Ufo(this, speed, fireRate);
    this.ufoGroup.add(ufo);
  }
}
