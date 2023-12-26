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
    testGraphics([Bullets.WeakDroneBullet, Drones.WeakDrone])

  }

  const testGraphics = (
    graphicToTest: Array<Drone | Bullet | Particle>, 
    showGrid?: boolean
  ) => {
    p.background(255)
    
    for (let i = 0; i < graphicToTest.length; i++) {
      p.push()
        p.translate(
          300, 
          (typeof graphicToTest[i] === typeof Bullets.DroneBullet ? 550 : 300)
        )
        p.scale(13);
        graphicToTest[i].graphic(
          p,
          p.color(153, 255, 170),
          graphicToTest[i].sizeX,
          p.frameCount
        );
      p.pop();
    }

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
