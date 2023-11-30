let gustColor;
let gusts;
let movers;

function setup() {
    createCanvas(800, 800, P2D)
    gustColor = color("rgba(255, 255, 255, 0.2)")
    gusts = []
    movers = []

    // initialize field of movers
    for (let i = 0; i < 500; i++) {
        let position = createVector(randomFromInterval(0, width), randomFromInterval(0, height))
        let mass = randomFromInterval(4, 10)
        let velocity = createVector()
        let acceleration = createVector()
        let mover = new Mover(position, mass, velocity, acceleration)
        movers.push(mover)
    }

    setInterval(function() {
        let position = createVector(randomFromInterval(0, width), randomFromInterval(0, height))
        spawnRandomGust(position)
    }, 1000)
}

function draw() {
    background(50)

    stroke(255)
    fill(255)

    for (let i = 0; i < movers.length; i++) {
        movers[i].update()
        movers[i].draw()
    }

    stroke(gustColor)
    fill(gustColor)

    // updates and draws each gust, and removes them if their lifetime is up
    gusts = gusts.filter((gust, index, array) => {
        gust.update(movers)
        gust.draw();
        return gust.isAlive()
    })
}


function spawnRandomGust(position) {
    let strength = randomFromInterval(1, 5)
    let size = randomFromInterval(50, 250)
    let radius = randomFromInterval(50, 150)
    let startingAngle = randomFromInterval(0, TAU)

    // choose from two random intervals
    let speed;
    if (Math.random() < 0.5) {
        speed = randomFromInterval(0.05, 0.2)
    } else {
        speed = randomFromInterval(-0.2, -0.05)
    }


    let timeToLive = randomFromInterval(25, 200)
    let gust = new CircularGust(position, strength, size, radius, startingAngle, speed, timeToLive)
    gusts.push(gust)
}

// this creates a gust when a click happens
function mouseClicked() {
    let position = createVector(mouseX, mouseY)
    spawnRandomGust(position)
}

function randomFromInterval(min, max) {
    return (Math.random() * (max - min)) + min
}