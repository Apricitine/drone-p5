import p5 from "p5"
import { Drones } from "./data"
/* import type { Drone, Bullet, Particle } from "./data" */

new p5((p: p5) => {

  let scene: "home" | "game" | "how" | "drones" | "win" | "lose" = "home"

  const colors = { player: p.color(153, 255, 170), enemy: p.color(173, 196, 255) }

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
    p.cursor(p.ARROW)

    switch (scene) {
      case "home":
        home()
        break
      case "game":
        game()
        break;
      case "how":
        how()
        break;
      case "drones":
        drones()
        break;
      case "win":
        win()
        break;
      case "lose":
        lose()
        break;
    }
  }

  p.mousePressed = () => {
    switch (scene) {
      case "home":
        if (buttonCollision(195, 300, 225, 100)) scene = "game"
        if (buttonCollision(195, 400, 225, 100)) scene = "how"
        if (buttonCollision(195, 500, 225, 100)) scene = "drones"
        break
      // case "game":
      //   break;
      // case "how":
      //   break;
      // case "drones":
      //   break;
      // case "win":
      //   break;
      // case "lose":
      //   break;
    }
  }

  /** ALL MAIN CODE **/
  const home = () => {
    if (buttonCollision(195, 300, 225, 100)) p.cursor(p.HAND)
    if (buttonCollision(195, 400, 225, 100)) p.cursor(p.HAND)
    if (buttonCollision(195, 500, 225, 100)) p.cursor(p.HAND)

    p.background(p.lerpColor(colors.player, p.color(127), 0.4))
    p.noStroke()

    p.textFont("monospace")
    p.fill(0)
    p.textSize(1)
    p.textSize(400 / p.textWidth("You win!"))
    p.text("Drones", 300, 140)
    p.rect(300, 205, 380, 10)

    // buttons
    p.textAlign(p.LEFT, p.CENTER)
    p.textSize(1)
    p.textSize(250 / p.textWidth("You win!"))
    p.text("Play", 90, 300)
    p.rect(155, 345, 140, 7)
    p.text("How", 90, 400)
    p.rect(155, 445, 140, 7)
    p.text("Drones", 90, 500)
    p.rect(195, 545, 220, 7)
    p.textAlign(p.CENTER, p.CENTER)

    p.push()
    p.translate(400, 320)
    p.scale(2.5)
    p.rotate(90)
    Drones.Blimp.graphic(p, colors.player, p.frameCount)
    p.pop()

    p.push()
    p.translate(450, 500)
    p.scale(3)
    p.rotate(180)
    Drones.FighterDrone.graphic(p, colors.player, p.frameCount)
    p.pop()
  }
  const game = () => {
    p.background(0);
  }
  const how = () => {
    p.background(255, 0, 0);
  }
  const drones = () => {
    p.background(255, 255, 0);
  }
  const win = () => {
    p.background(0, 0, 255);
  }
  const lose = () => {
    p.background(0, 255, 255);
  }

  const buttonCollision = (x: number, y: number, w: number, h: number, displayRect?: boolean): boolean => {
    if (displayRect) p.noStroke().fill(255, 0, 0).rect(x, y, w, h)
    return (
      p.mouseX > x - w / 2 &&
      p.mouseX < x + w / 2 &&
      p.mouseY > y - h / 2 &&
      p.mouseY < y + h / 2
    )
  }
  /* const testGraphics = (
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
      p.scale(7)
      one[0].graphic(
        p,
        p.color(153, 255, 170),
        p.frameCount
      )
      p.pop()
    })

    if (showGrid || showGrid === undefined) {
      for (let i = 0; i <= 600; i += 50) {
        p.line(i, 0, i, 600)
        p.line(0, i, 600, i)
        p.text(i, i, 10)
        p.text(i, 10, i)
      }
    }
  } */
}, document.querySelector("#app") as HTMLElement)
