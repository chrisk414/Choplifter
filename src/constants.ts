// Display
export const GAME_WIDTH = 960;
export const GAME_HEIGHT = 540;

// World
export const WORLD_WIDTH = 4096;
export const WORLD_HEIGHT = GAME_HEIGHT;
export const GROUND_Y = GAME_HEIGHT - 60;

// Home base
export const BASE_X = 128;
export const BASE_WIDTH = 180;

// Barracks positions (4 barracks in enemy territory)
export const BARRACKS_POSITIONS = [1000, 1700, 2400, 3100];
export const BARRACKS_WIDTH = 64;
export const BARRACKS_HEIGHT = 48;
export const BARRACKS_HEALTH = 3;
export const HOSTAGES_PER_BARRACKS = 16;

// Helicopter physics
export const HELI_ACCEL = 400;
export const HELI_DRAG = 200;
export const HELI_GRAVITY = 300;
export const HELI_MAX_SPEED_X = 250;
export const HELI_MAX_SPEED_Y = 200;
export const HELI_WIDTH = 48;
export const HELI_HEIGHT = 24;
export const HELI_MAX_PASSENGERS = 16;
export const HELI_SAFE_LANDING_SPEED = 100;
export const HELI_LIVES = 3;

// Bullet
export const BULLET_SPEED = 500;
export const BULLET_COOLDOWN = 200; // ms
export const BULLET_SIZE = 4;

// Hostage
export const HOSTAGE_WIDTH = 8;
export const HOSTAGE_HEIGHT = 14;
export const HOSTAGE_SPEED = 30;
export const HOSTAGE_BOARD_RANGE = 80;

// Tank
export const TANK_WIDTH = 32;
export const TANK_HEIGHT = 20;
export const TANK_SPEED = 30;
export const TANK_FIRE_RATE = 2500; // ms
export const TANK_BULLET_SPEED = 200;

// Jet
export const JET_WIDTH = 40;
export const JET_HEIGHT = 12;
export const JET_SPEED = 200;
export const JET_FIRE_RATE = 1500; // ms
export const JET_MISSILE_SPEED = 250;

// UFO
export const UFO_SIZE = 24;
export const UFO_SPEED = 120;
export const UFO_FIRE_RATE = 1200; // ms
export const UFO_HEALTH = 3;

// Spawner
export const TANK_SPAWN_INTERVAL = 8000; // ms
export const JET_SPAWN_INTERVAL = 12000; // ms
export const UFO_SPAWN_INTERVAL = 15000; // ms
export const UFO_UNLOCK_TRIPS = 2;

// Difficulty scaling per rescue trip
export const DIFFICULTY_SPAWN_MULTIPLIER = 0.85; // multiply spawn interval by this per trip
export const DIFFICULTY_SPEED_BONUS = 15; // add to enemy speed per trip

// Colors
export const COLOR_SKY = 0x3a6ea5;
export const COLOR_GROUND = 0x5a8a3a;
export const COLOR_MOUNTAIN = 0x2a4a6a;
export const COLOR_HILL = 0x3a6a4a;
export const COLOR_HELI_BODY = 0x4a9e4a;
export const COLOR_HELI_COCKPIT = 0x88ccff;
export const COLOR_BARRACKS = 0x8b6914;
export const COLOR_HOSTAGE = 0xffcc88;
export const COLOR_TANK = 0x666666;
export const COLOR_JET = 0x888888;
export const COLOR_UFO = 0xcc44cc;
export const COLOR_BULLET = 0xffff00;
export const COLOR_MISSILE = 0xff4444;
export const COLOR_EXPLOSION = 0xff8800;
export const COLOR_BASE = 0x4488cc;

// Facing directions
export enum Facing {
  LEFT = 'left',
  RIGHT = 'right',
  FORWARD = 'forward',
}
