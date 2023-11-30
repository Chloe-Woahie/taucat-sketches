// Note: size is for the size of the bob, radius is the distance from the anchor
class CircularGust {
    constructor(position, strength, size, radius, startingAngle, rotationSpeed, cyclesToLive) {
        this.position = position
        this.strength = strength
        this.size = size
        this.radius = radius
        this.angle = startingAngle
        this.rotationSpeed = rotationSpeed
        this.cyclesToLive = cyclesToLive
    }

    update(mover) {
        this.angle += this.rotationSpeed
        this.cyclesToLive -= 1

        let reciprocalTerminalSlope = this.bobPosition()

        this.applyForceToNearbyMovers(movers)
    }

    applyForceToNearbyMovers(movers) {
        let bobPos = this.bobPosition()

        for (let i = 0; i < movers.length; i++) {
            let towardsBob = p5.Vector.sub(bobPos, movers[i].position)
            let distance = towardsBob.mag()
            if (distance > (this.size / 2)) {
                continue
            }

            //movers[i].applyForce(towardsBob.normalize().mult(this.strength * STRENGTH_MODIFIER))

            movers[i].applyForce(this.looking().mult(this.strength))
        }
    }

    isAlive() {
        return (this.cyclesToLive > 0)
    }

    draw() {
        let bobPos = this.bobPosition()
            //line(this.position.x, this.position.y, bobPosition.x, bobPosition.y)
            //circle(this.position.x, this.position.y, 5)
        circle(bobPos.x, bobPos.y, this.size)
    }

    looking() {
        // changes the angle being added depending on the direction it is going
        let angleToBeAdded = (this.rotationSpeed < 0) ? (PI / -2) : (PI / 2)
        let newAngle = this.angle + angleToBeAdded
        let looking = CircularGust.polar_to_cartesian(newAngle, 1)
        return looking
    }

    bobPosition() {
        let cart = CircularGust.polar_to_cartesian(this.angle, this.radius)
        let bobPosition = createVector(cart.x + this.position.x, cart.y + this.position.y)
        return bobPosition
    }

    static polar_to_cartesian(angle, radius) {
        let x = radius * cos(angle)
        let y = radius * sin(angle)
        return createVector(x, y)
    }
}