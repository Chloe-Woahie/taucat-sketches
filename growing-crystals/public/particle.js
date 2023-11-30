class Particle {
    constructor(position, mass) {
        this.position = position
        this.mass = mass
        this.color = color(255)
    }

    update() {
        let walk = createVector(randomFromInterval(-5, 5), randomFromInterval(-5, 5))
        walk.add(this.generateOffset())
        this.position.add(walk)
    }

    // nudges the particle towards the center
    generateOffset() {
        let positionCopy = this.position.copy()
        positionCopy.sub(createVector(width / 2, height / 2))
        positionCopy.mult(-1)
        positionCopy.setMag(1.5)
        return positionCopy
    }

    draw() {

        stroke(this.color)
        fill(this.color)
        circle(this.position.x, this.position.y, this.mass)
    }
}

function randomFromInterval(min, max) {
    return (Math.random() * (max - min)) + min
}