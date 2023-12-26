import p5 from "p5"
import { Drones, Bullets, Particles } from "./data"
import type { Drone, Bullet, Particle } from "./data";

new p5((p: p5) => {
  p.setup = () => {
    p.createCanvas(600, 600)
    p.rectMode(p.CENTER)
    p.ellipseMode(p.CENTER)
    p.imageMode(p.CENTER)
    p.textAlign(p.CENTER, p.CENTER)
    p.strokeCap(p.ROUND)
    p.angleMode(p.RADIANS)
  }

  p.draw = () => {
    testGraphics(true, [Drones.Tank, 300], [Bullets.TankBullet, 550])
  }

  const testGraphics = (
    showGrid?: boolean,
    ...graphicToTest: Array<[Particle | Bullet | Drone, number]>
  ) => {
    p.background(255)
    
    graphicToTest.forEach((one) => {
      p.push()
        p.translate(
          300, 
          one[1]
        )
        p.scale(7);
        one[0].graphic(
          p,
          p.color(153, 255, 170),
          p.frameCount
        );
      p.pop();
    })

    if (showGrid || showGrid === undefined) {
      for (let i = 0; i <= 600; i += 50) {
        p.line(i, 0, i, 600);
        p.line(0, i, 600, i);
        p.text(i, i, 10);
        p.text(i, 10, i);
      }
    }
  }
}, document.querySelector("#app") as HTMLElement)
