import p5 from "p5"
import { Bullet, Bullets, Drone, Drones, Particle, Particles } from "./data"
import { abs, getHexagon, smoothStep } from "./utility"

new p5((p: p5) => {
  console.info("%ccanvas started!", "color: lightblue; font-weight: bold;")

  p.disableFriendlyErrors = true

  type DroneTypes = "Drones" | "Tanks" | "Turrets" | "Towers" | "Walls"

  let scene: "home" | "game" | "how" | "drones" | "win" | "lose" = "home"
  let currentDroneSlide = 0
  let transition: { duration: number, scene?: string } = { duration: 0 }

  let characters: {
    player: Array<{
      character: Drone,
      x: number,
      y: number,
      xVelocity: number,
      yVelocity: number,
      time: number,
      health: number
    }>, enemy: Array<{
      character: Drone,
      x: number,
      y: number,
      xVelocity: number,
      yVelocity: number,
      time: number,
      health: number
    }>
  } = { player: [], enemy: [] }
  let bullets: { player: any, enemy: any } = { player: [], enemy: [] }

  let shopSelectedDrone: Drone | null = null
  let shopSelectedDroneTransition: number
  let shopSelectedDroneType: DroneTypes = "Drones"

  const OrderedDrones: Drone[] = Object.values(Drones)
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
    switch (transition.duration <= 1 ? scene : transition.scene) {
      case "home":
        home()
        break
      case "game":
        game()
        break
      case "how":
        how()
        break
      case "drones":
        drones()
        break
      case "win":
        win()
        break
      case "lose":
        lose()
        break
    }
    if (transition.duration > 0) {
      transition.duration -= 0.05
      var tr = smoothStep(1 - abs(transition.duration - 1))
      p.fill(0, 255 * tr)
      p.rect(300, 300, 600, 600)
    }
  }

  p.mousePressed = () => {
    switch (scene) {
      case "home":
        if (buttonCollision(195, 300, 225, 100)) scene = "game"
        if (buttonCollision(195, 400, 225, 100)) scene = "how"
        if (buttonCollision(195, 500, 225, 100)) scene = "drones"
        break
      case "drones":
        if (buttonCollision(300, 520, 160, 100)) scene = "home"
        if (buttonCollision(125, 300, 100, 100)) currentDroneSlide--
        if (buttonCollision(475, 300, 100, 100)) currentDroneSlide++
        break
      case "how":
        if (buttonCollision(300, 520, 160, 100)) scene = "home"
        break
    }
  }

  /* COMPONENT FUNCTIONS */
  const shop = () => {
    p.fill(255, 175)
    p.rect(300, 550, 600, 100)
  }

  /* SCENE FUNCTIONS */
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
    Drones.Blimp.graphic(p, colors.enemy, p.frameCount)
    p.pop()

    p.push()
    p.translate(450, 500)
    p.scale(3)
    p.rotate(180)
    Drones.FighterDrone.graphic(p, colors.player, p.frameCount)
    p.pop()
  }
  const game = () => {

    p.push()
    let translationY = smoothStep(700 - (p.constrain(p.mouseY, 50, 500) - 50) * 14 / 9, 0, 700) - 100
    p.translate(0, translationY)

    p.background(p.lerpColor(colors.enemy, p.color(200), 0.9))
    p.noStroke()
    p.fill(p.lerpColor(colors.player, p.color(200), 0.9))
    p.rect(300, 350, 600, 700)

    if (p.mouseY < 500 && p.mouseY > 250) {
      let tile = getHexagon(p.mouseY - translationY, p.mouseX)

      if (tile[1] < 15 && tile[1] > 0 && tile[0] > 0 && tile[0] < 30) {
        p.fill(255, 150)
        p.noStroke()
        p.beginShape()
        for (let i = 0; i < 6; i++) {
          p.vertex(20 * tile[0] + 25 * Math.sin(p.PI * i / 3), 40 * tile[1] + 25 * Math.cos(p.PI * i / 3))
        }
        p.endShape()
        p.cursor(p.CROSS)
      }
    }

    p.pop()

    shop()
  }
  const how = () => {
    p.background(p.lerpColor(colors.player, p.color(127), 0.4))

    p.noStroke()
    p.fill(0)
    p.textSize(1)
    p.textSize(300 / p.textWidth("You win!"))
    p.text("How", 300, 60)
    p.rect(300, 115, 240, 10)

    p.textSize(1)
    p.textSize(200 / p.textWidth("You win!"))
    p.text("Back", 300, 520)
    p.rect(300, 565, 160, 7)

    p.textSize(1)
    p.textSize(110 / p.textWidth("You win!"))
    p.text("\nMove your mouse up and\ndown to navigate the map.\nThe shop is on the\nbottom of the screen.\nClick an item to select it.\nThen click the map to\nplace the item.", 300, 300)

    p.push()
    p.translate(500, 80)
    p.rotate(1.1)
    p.scale(2)
    Drones.BurnerTank.graphic(p, colors.enemy, p.frameCount)
    p.pop()

    if (buttonCollision(300, 520, 160, 100)) {
      p.cursor(p.HAND)
    }
  }
  const drones = () => {
    if (currentDroneSlide < 0) currentDroneSlide = OrderedDrones.length - 1
    if (currentDroneSlide > OrderedDrones.length - 1) currentDroneSlide = 0

    p.background(p.lerpColor(colors.player, p.color(127), 0.4))
    // Title
    p.noStroke()
    p.fill(0)
    p.textSize(1)
    p.textSize(225 / p.textWidth("You win!"))
    p.text("Drones", 300, 60)
    p.rect(300, 105, 240, 10)

    // Back button
    p.textSize(1)
    p.textSize(200 / p.textWidth("You win!"))
    p.text("Back", 300, 520)
    p.rect(300, 565, 160, 7)

    // Price &info of drone
    p.textAlign(p.CENTER, p.TOP)
    p.textSize(1)
    p.textSize(70 / p.textWidth("You win!"))
    p.text(`$ ${OrderedDrones[currentDroneSlide].price} \n ${OrderedDrones[currentDroneSlide].description}`, 300, 360)

    // name
    p.textAlign(p.CENTER, p.CENTER)
    p.textSize(1)
    p.textSize(90 / p.textWidth("You win!"))
    p.text(OrderedDrones[currentDroneSlide].name, 300, 150)

    // Back button
    p.textSize(1)
    p.textSize(250 / p.textWidth("You win!"))
    p.text("«", 125, 300)

    // Forward button
    p.textSize(1)
    p.textSize(250 / p.textWidth("You win!"))
    p.text("»", 475, 300)

    // Display current drone
    p.push()
    p.translate(300, 250)
    p.scale(130 / OrderedDrones[currentDroneSlide].sizeX)
    p.rotate(p.frameCount / 50)
    OrderedDrones[currentDroneSlide].graphic(p, colors.player, p.frameCount)
    p.pop()

    // Button hov cursor change
    if (buttonCollision(300, 520, 160, 100) ||
      buttonCollision(125, 300, 100, 100) ||
      buttonCollision(475, 300, 100, 100)) {
      p.cursor(p.HAND)
    }
  }
  const win = () => {
    p.background(0, 0, 255)
  }
  const lose = () => {
    p.background(0, 255, 255)
  }

  /* CHARACTER/BULLET MANAGEMENT FUNCTIONS */
  const pushCharacter = (
    side: keyof typeof characters,
    character: Drone,
    x: number,
    y: number,
    xVelocity?: number,
    yVelocity?: number,
  ) => {
    characters[side].push({
      character,
      x,
      y,
      xVelocity: xVelocity || p.random(-1, 1),
      yVelocity: yVelocity || p.random(-1, 1),
      time: 0,
      health: character.health
    })
  }
  const drawCharacter = (which: number, side: keyof typeof characters) => {
    let type: Drone = characters[side][which].character
    let size = type.sizeX
    let time: number = characters[side][which].time

    p.push()
    p.translate(characters[side][which].x, characters[side][which].y)
    type.graphic(p, colors[side], time)
    p.pop()
  }
  const runCharacter = (which: number, side: keyof typeof characters) => {
    drawCharacter(which, side)

    let speed: number = characters[side][which].character.movement?.speed ?? 0
    let turn = 0

    let closestEnemyType: Drone
    let distanceToClosestEnemy = Infinity

    // TODO: add logic for certain characters, line 1959
    if (getCharacterCount(side === "player" ? "enemy" : "player")) {
      for (let i = 0; i < getCharacterCount(side === "player" ? "enemy" : "player"); i++) {
        const distance = p.dist(
          characters[side][which].x,
          characters[side][which].y,
          characters[side === "player" ? "enemy" : "player"][i].x,
          characters[side === "player" ? "enemy" : "player"][i].y
        )
        if (distance < distanceToClosestEnemy) {
          distanceToClosestEnemy = distance
          closestEnemyType = characters[side === "player" ? "enemy" : "player"][i].character
        }
      }
      
      if (distanceToClosestEnemy < 400 || characters[side][which].character === Drones.Base) {
        speed = 0
        turn = p.atan2(
          characters[side === "player" ? "enemy" : "player"][which].y - characters[side][which].y,
          characters[side === "player" ? "enemy" : "player"][which].x - characters[side][which].x
        )
      }
    }
  }

  /* UTILITY FUNCTIONS */
  /**
 * Checks if the mouse cursor is within the boundaries of a button.
 * @param x - The x-coordinate of the button's center.
 * @param y - The y-coordinate of the button's center.
 * @param w - The width of the button.
 * @param h - The height of the button.
 * @param displayRect - Optional. If true, displays a rectangle representing the button's boundaries.
 * @returns True if the mouse cursor is within the button's boundaries, false otherwise.
 */
  const buttonCollision = (x: number, y: number, w: number, h: number, displayRect?: boolean): boolean => {
    if (displayRect) p.noStroke().fill(255, 0, 0).rect(x, y, w, h)
    return (
      p.mouseX > x - w / 2 &&
      p.mouseX < x + w / 2 &&
      p.mouseY > y - h / 2 &&
      p.mouseY < y + h / 2
    )
  }
  const getCharacterCount = (side: keyof typeof characters) => {
    return characters[side].length
  }
  const getBulletCount = (side: keyof typeof bullets) => {
    return bullets[side].length
  }

  /* TEST FUNCTIONS */
  /**
   * Renders the graphics of particles, bullets, and drones on the canvas.
   * 
   * @param showGrid - Optional parameter to indicate whether to show the grid. Defaults to true.
   * @param graphicToTest - An array of tuples, where each tuple contains a graphic object (Particle, Bullet, or Drone) and a y-coordinate.
   */
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
  }
  /**
   * Executes the game and displays a hexagonal grid with coordinates.
   */
  const testHexGrid = () => {
    game()
    for (let i = 0; i < 600; i += 20) {
      for (let j = 0; j < 600; j += 20) {
        let tile = getHexagon(i, j)
        p.textSize(7.5)
        p.text(tile[0] + ", " + tile[1], i, j)
      }
    }
  }
}, document.querySelector("#app") as HTMLElement)
