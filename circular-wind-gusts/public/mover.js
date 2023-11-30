class Mover {
    constructor(position, mass, velocity, acceleration) {
        this.position = position
        this.mass = mass
        this.velocity = velocity
        this.acceleration = acceleration
    }

    update() {

        // add damping
        this.velocity.mult(0.99)

        this.velocity.add(this.acceleration)
        this.acceleration = createVector()
        this.position.add(this.velocity)

        if (this.position.x > width) {
            this.position.x = this.position.x - width
        } else if (this.position.x < 0) {
            this.position.x = width + this.position.x
        }

        if (this.position.y > height) {
            this.position.y = this.position.y - height
        } else if (this.position.y < 0) {
            this.position.y = height + this.position.y
        }
    }

    applyForce(force) {
        force.div(this.mass)
        this.acceleration.add(force)
    }

    draw() {
        circle(this.position.x, this.position.y, this.mass)
    }
}