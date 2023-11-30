class Gust {
    constructor(position, velocity, strength, size) {
        this.position = position
        this.velocity = velocity
        this.strength = strength
        this.size = size
    }

    update(dots) {
        this.position.add(this.velocity)
        this.applyForceToNearbyMovers(dots)
    }

    draw() {

        circle(this.position.x, this.position.y, this.size)
    }

    applyForceToNearbyMovers(dots) {
        for (let i = 0; i < dots.length; i++) {
            let distance = p5.Vector.sub(dots[i].position, this.position).mag()
            if (distance > (this.size / 2)) {
                continue
            }

            dots[i].applyForce(this.velocity.copy().setMag(this.strength))
        }
    }

    isAlive() {
        let distanceFromCenter = p5.Vector.sub(this.position, createVector(width / 2, height / 2)).mag()
        return ((distanceFromCenter) < ((width / 2) * 1.35))
    }
}