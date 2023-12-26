import p5 from "p5"
import { Drones } from "./data"

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
    p.background(255)

    p.translate(300, 250)
    p.scale(13)
    Drones.BomberPlane.graphic(
      p, 
      p.color(153, 255, 170), 
      Drones.BomberPlane.sizeX, 
      p.frameCount
    )
  }

}, document.querySelector("#app") as HTMLElement)
