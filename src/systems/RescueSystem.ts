import { HELI_MAX_PASSENGERS, HOSTAGES_PER_BARRACKS, BARRACKS_POSITIONS } from '../constants';
import type { GameScene } from '../scenes/GameScene';
import { HostageState } from '../entities/Hostage';

export class RescueSystem {
  rescued = 0;
  dead = 0;
  private scene: GameScene;

  get remaining(): number {
    const total = HOSTAGES_PER_BARRACKS * BARRACKS_POSITIONS.length;
    return total - this.rescued - this.dead;
  }

  get isGameComplete(): boolean {
    return this.remaining <= 0 && this.scene.helicopter.passengers <= 0;
  }

  constructor(scene: GameScene) {
    this.scene = scene;
  }

  update(): void {
    const heli = this.scene.helicopter;
    if (heli.isDead || !heli.isLanded) return;

    // Check for hostage boarding
    if (heli.passengers < HELI_MAX_PASSENGERS) {
      const hostages = this.scene.hostageGroup.getChildren() as Phaser.Physics.Arcade.Sprite[];
      for (const hostage of hostages) {
        if (!hostage.active) continue;
        const h = hostage as any;
        if (h.hostageState === HostageState.BOARDING || h.hostageState === HostageState.FLEEING) {
          const dist = Phaser.Math.Distance.Between(heli.x, heli.y, hostage.x, hostage.y);
          if (dist < 30 && heli.passengers < HELI_MAX_PASSENGERS) {
            heli.passengers++;
            h.board();
            this.scene.soundManager.playPickup();
          }
        }
      }
    }

    // Check for delivery at base
    if (heli.isAtBase() && heli.passengers > 0) {
      this.rescued += heli.passengers;
      this.scene.spawnerSystem.rescueTrips++;
      this.scene.soundManager.playDelivery();
      heli.passengers = 0;
      this.scene.hud.showDeliveryMessage();
    }
  }

  hostageKilled(): void {
    this.dead++;
  }
}
