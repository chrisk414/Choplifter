import {
  TANK_SPAWN_INTERVAL, JET_SPAWN_INTERVAL, UFO_SPAWN_INTERVAL,
  UFO_UNLOCK_TRIPS, DIFFICULTY_SPAWN_MULTIPLIER, DIFFICULTY_SPEED_BONUS,
  TANK_SPEED, TANK_FIRE_RATE, JET_SPEED, JET_FIRE_RATE,
  UFO_SPEED, UFO_FIRE_RATE, WORLD_WIDTH,
} from '../constants';
import type { GameScene } from '../scenes/GameScene';

export class SpawnerSystem {
  rescueTrips = 0;
  private scene: GameScene;
  private lastTankSpawn = 0;
  private lastJetSpawn = 0;
  private lastUfoSpawn = 0;
  private initialized = false;

  constructor(scene: GameScene) {
    this.scene = scene;
  }

  update(time: number): void {
    // Initialize spawn timers on first update so enemies don't spawn immediately
    if (!this.initialized) {
      this.initialized = true;
      this.lastTankSpawn = time;
      this.lastJetSpawn = time;
      this.lastUfoSpawn = time;
      return;
    }

    const diff = this.rescueTrips;
    const spawnMult = Math.pow(DIFFICULTY_SPAWN_MULTIPLIER, diff);

    // Spawn tanks
    const tankInterval = TANK_SPAWN_INTERVAL * spawnMult;
    if (time - this.lastTankSpawn > tankInterval) {
      this.lastTankSpawn = time;
      this.spawnTank(diff);
    }

    // Spawn jets
    const jetInterval = JET_SPAWN_INTERVAL * spawnMult;
    if (time - this.lastJetSpawn > jetInterval) {
      this.lastJetSpawn = time;
      this.spawnJet(diff);
    }

    // Spawn UFOs after enough rescue trips
    if (diff >= UFO_UNLOCK_TRIPS) {
      const ufoInterval = UFO_SPAWN_INTERVAL * spawnMult;
      if (time - this.lastUfoSpawn > ufoInterval) {
        this.lastUfoSpawn = time;
        this.spawnUfo(diff);
      }
    }
  }

  private spawnTank(diff: number): void {
    const x = 600 + Math.random() * (WORLD_WIDTH - 800);
    const fireRate = Math.max(800, TANK_FIRE_RATE - diff * 200);
    this.scene.spawnTank(x, fireRate);
  }

  private spawnJet(diff: number): void {
    const fromRight = Math.random() > 0.5;
    const speed = JET_SPEED + diff * DIFFICULTY_SPEED_BONUS;
    const fireRate = Math.max(600, JET_FIRE_RATE - diff * 150);
    this.scene.spawnJet(fromRight, speed, fireRate);
  }

  private spawnUfo(diff: number): void {
    const speed = UFO_SPEED + diff * DIFFICULTY_SPEED_BONUS * 0.5;
    const fireRate = Math.max(500, UFO_FIRE_RATE - diff * 100);
    this.scene.spawnUfo(speed, fireRate);
  }
}
