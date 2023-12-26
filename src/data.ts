import type { RangeConstraint } from "./utility"
import p5 from "p5"

type Team = "player" | "enemy"

/**
 * @sizeX The x size of the bullet
 * @sizeY The y size of the bullet
 * @damage The damage the bullet deals
 * @immune Whether or not the bullet can be destroyed by hitting an enemy
 * @explodes Defaults to false. If specified, the particles that will emit from the bullet on destruction.
 * @graphic The bullet'team graphic
 */
interface Bullet {
  sizeX: RangeConstraint<0, 20>
  sizeY: RangeConstraint<0, 20>
  damage: number
  immune?: boolean
  explodes?: { 
    bulletType: Bullet
    bulletCount: RangeConstraint<0, 50>
    bulletLifetime: number
  } | Bullet
  graphic: (p: typeof p5) => void
}
interface Particle extends Bullet {};

/**
 * @name A short name
 * @description A short description
 * @price A price ranging from $5-$5000
 * @priority Whether or not this drone should be ignored by enemies
 * @sizeX The drone'team x size
 * @sizeY The drone's y size
 * @reloadTime The drone's reload time, can be any value greater than one. Infinity will cause a drone to never fire. Different values may be specified for each bullet
 * @bulletType The drone's type of bullet to fire. Can be any instance of a bullet. Different values may be specified if the drone can shoot multiple bullets
 * @range The drone's range for firing, can range from 0-infinity. Different values may be specified for each bullet
 * @bulletSpeed How quickly the bullet will fire. Different values may be specified for each bullet
 * @accuracy The drone's firing accuracy. 0 is perfect accuracy and 3.14 is worst accuracy. A value of 6.28 will result in the drone shooting in all directions
 * @speed The drone's movement speed. Can range from 0-10. 3 is the recommended cap for speed
 * @turnSpeed How quickly the drone can turn. Can range from 0-10, with the average being 1
 * @health How much health the drone has
 * @graphic The drone's graphic
 */
interface Drone {
  name: string
  description: string
  price: number
  priority?: boolean
  sizeX: RangeConstraint<0, 100>
  sizeY: RangeConstraint<0, 100>
  health: number
  firing?: {
    bulletType: {
      primaryBullet: Bullet
      secondaryBullet: Bullet
      tertiaryBullet?: Bullet
      quartenaryBullet?: Bullet  
    } | Bullet
    reloadTime: {
      primaryReload: number
      secondaryReload: number
      tertiaryReload?: number
      quartenaryReload?: number
    } | number
    range: {
      primaryRange: number
      secondaryRange: number
      tertiaryRange?: number
      quartenaryRange?: number
    } | number
    bulletSpeed: {
      primaryBulletSpeed: number
      secondaryBulletSpeed: number
      tertiaryBulletSpeed: number
      quartenaryBulletSpeed: number
    } | number
    accuracy: number
  }
  movement?: {
    speed: number
    turnSpeed: number
  }
  graphic: (p: p5, team: Team, size: number, time: number) => void
}

/** ALL OF THE PARTICLE DATA **/
export const Particles: { [key: string]: Particle } = {
  GasParticle: {
    sizeX: 6,
    sizeY: 6,
    damage: 0.05,
    immune: true,
    graphic() {}
  },
  ExplosionParticle: {
    sizeX: 4,
    sizeY: 4,
    damage: 0.25,
    immune: true,
    graphic() {}
  },
}

/** ALL OF THE BULLET DATA **/
export const Bullets: { [key: string]: Bullet } = {
  WeakDroneBullet: {
    sizeX: 2,
    sizeY: 2,
    damage: 0.5,
    graphic() {}
  },
  DroneBullet: {
    sizeX: 3,
    sizeY: 3,
    damage: 2,
    graphic() {}
  },
  StrongDroneBullet: {
    sizeX: 4,
    sizeY: 4,
    damage: 7.5,
    graphic() {}
  },
  PlaneBullet: {
    sizeX: 5,
    sizeY: 5,
    damage: 10,
    graphic() {}
  },
  PlaneBomb: {
    sizeX: 8,
    sizeY: 8,
    damage: 75,
    explodes: Particles.ExplosionParticle,
    graphic() {}
  },
}

/** ALL OF THE DRONE DATA **/
export const Drones: { [key: string]: Drone } = {
  DumbDrone: {
    name: "Dumb Drone",
    description: "A pathetically weak drone that isn't even worth acknowledging.",
    price: 5,
    priority: false,
    sizeX: 20,
    sizeY: 20,
    health: 0.1,
    firing: {
      bulletType: Bullets.WeakBullet,
      reloadTime: 400,
      range: 60,
      bulletSpeed: 4,
      accuracy: 0.1
    },
    movement: {
      speed: 2,
      turnSpeed: 1,
    },
    graphic(p: p5, team, size, time) {
      let sf = Math.sin(time / 2);
      let cf = Math.cos(time / 2);
      p.stroke(p.lerpColor(p.color(153, 255, 170), p.color(255), 0.6));
      p.strokeWeight(4);
      p.line(-size*0.25, -size*0.25, size*0.25, size*0.25);
      p.line(size*0.25, -size*0.25, -size*0.25, size*0.25);
      p.noStroke();
      p.fill(p.lerpColor(p.color(153, 255, 170), p.color(255), 0.6));
      p.rect(0, 0, size * 0.25, size * 0.5, 50);
      p.fill(p.lerpColor(p.color(153, 255, 170), p.color(255), 0.4));
      p.ellipse(0, 0, size*0.2, size*0.3);
      p.stroke(p.lerpColor(p.color(153, 255, 170), p.color(0), 0.5));
      p.strokeWeight(2);
      p.line(-size*(0.25 + 0.15*sf), -size*(0.25 + 0.15*cf), -size*(0.25 - 0.15*sf), -size*(0.25 - 0.15*cf));
      p.line(size*(0.25 + 0.15*sf), -size*(0.25 + 0.15*cf), size*(0.25 - 0.15*sf), -size*(0.25 - 0.15*cf));
      p.line(-size*(0.25 + 0.15*sf), size*(0.25 + 0.15*cf), -size*(0.25 - 0.15*sf), size*(0.25 - 0.15*cf));
      p.line(size*(0.25 + 0.15*sf), size*(0.25 + 0.15*cf), size*(0.25 - 0.15*sf), size*(0.25 - 0.15*cf));
    }
  },  
  WeakDrone: {
    name: "Weak Drone",
    description: "A weak drone that is more intelligent and slightly better than the dumb drone but still has bad stats.",
    price: 10,
    priority: false,
    sizeX: 30,
    sizeY: 30,
    health: 5,
    firing: {
      bulletType: Bullets.WeakBullet,
      reloadTime: 200,
      range: 80,
      bulletSpeed: 5,
      accuracy: 0.1
    },
    movement: {
      speed: 1,
      turnSpeed: 1,
    },
    graphic() {}
  },
  Drone: {
    name: "Drone",
    description: "A below average drone that has better stats than the dumb and weak drones but is still quite bad.",
    price: 25,
    priority: false,
    sizeX: 40,
    sizeY: 40,
    health: 20,
    firing: {
      bulletType: Bullets.DroneBullet,
      reloadTime: 150,
      range: 80,
      bulletSpeed: 5,
      accuracy: 0
    },
    movement: {
      speed: 1,
      turnSpeed: 1,
    },
    graphic() {}
  },
  SwarmDrone: {
    name: "Swarm Drone",
    description: "A drone that has similar stats to the Weak Drone but is capable of traveling in large groups.",
    price: 15,
    priority: false,
    sizeX: 30,
    sizeY: 30,
    health: 5,
    firing: {
      bulletType: Bullets.WeakBullet,
      reloadTime: 200,
      range: 60,
      bulletSpeed: 6,
      accuracy: 0.1
    },
    movement: {
      speed: 1.25,
      turnSpeed: 1,
    },
    graphic() {}
  },
  FighterDrone: {
    name: "Fighter Drone",
    description: "A more powerful drone that deals higher damage than the rest.",
    price: 50,
    priority: false,
    sizeX: 45,
    sizeY: 45,
    health: 30,
    firing: {
      bulletType: Bullets.StrongDroneBullet,
      reloadTime: 125,
      range: 200,
      bulletSpeed: 7.5,
      accuracy: 0
    },
    movement: {
      speed: 1.25,
      turnSpeed: 1,
    },
    graphic() {}
  },
  GunnerDrone: {
    name: "Gunner Drone",
    description: "A powerful drone that shoots quick but weak shots. It has higher health and defense than the rest.",
    price: 75,
    sizeX: 40,
    sizeY: 40,
    health: 40,
    firing: {
      bulletType: Bullets.WeakDroneBullet,
      reloadTime: 10,
      range: 275,
      bulletSpeed: 4,
      accuracy: 0.05
    },
    movement: {
      speed: 0.75,
      turnSpeed: 1,
    },
    graphic() {}
  },
  Plane: {
    name: "Plane",
    description: "A fast and light craft that shoots at enemies from above.",
    price: 125,
    sizeX: 45,
    sizeY: 55,
    health: 80,
    firing: {
      bulletType: Bullets.PlaneBullet,
      reloadTime: 60,
      range: 200,
      bulletSpeed: 5,
      accuracy: 0
    },
    movement: {
      speed: 2,
      turnSpeed: 1,
    },
    graphic() {}
  },
  GasserPlane: {
    name: "Gasser Plane",
    description: "A fairly quick craft that drops toxic gas from above.",
    price: 175,
    sizeX: 45,
    sizeY: 45,
    health: 60,
    firing: {
      bulletType: Bullets.GasParticle,
      reloadTime: 1,
      range: 10,
      bulletSpeed: 0.8,
      accuracy: 6.28
    },
    movement: {
      speed: 1.25,
      turnSpeed: 1,
    },
    graphic() {}
  },
  BomberPlane: {
    name: "Bomber Plane",
    description: "A plane with incredible destructive capabilities- it shoots exploding bombs that deal splash damage.",
    price: 75,
    sizeX: 45,
    sizeY: 55,
    health: 100,
    firing: {
      bulletType: Bullets.WeakDroneBullet,
      reloadTime: 350,
      range: 150,
      bulletSpeed: 4,
      accuracy: 0
    },
    movement: {
      speed: 1,
      turnSpeed: 1,
    },
    graphic() {}
  },
}

console.log(Drones)

