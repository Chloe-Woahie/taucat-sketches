let LOG_BASE = 40
let HUE_SHIFT = 180

class Crystal {
    constructor(startingSize, startingParticle, maxRadius) {
        this.stuckParticles = []
        this.startingSize = startingSize
        this.maxRadius = maxRadius

        startingParticle.color = this.getColorFromDistance(0)
        this.stuckParticles.push(startingParticle)
    }

    draw() {
        for (let i = 0; i < this.stuckParticles.length; i++) {
            this.stuckParticles[i].draw()
        }
    }

    particleIsStuck(particle) {
        let particleRadius = particle.mass / 2
        let particlePosition = particle.position

        for (let i = 0; i < this.stuckParticles.length; i++) {
            let stuckParticleRadius = this.stuckParticles[i].mass / 2
            let stuckParticlePosition = this.stuckParticles[i].position
            let distance = p5.Vector.dist(stuckParticlePosition, particlePosition)
            if ((distance - particleRadius) < stuckParticleRadius) {
                return true
            }
        }

        return false
    }

    addParticle(particle) {
        let distanceFromStart = p5.Vector.dist(this.stuckParticles[0].position, particle.position)

        particle.color = this.getColorFromDistance(distanceFromStart)

        this.stuckParticles.push(particle)
    }

    getColorFromDistance(distance) {
        let hue = Math.floor(((distance) + HUE_SHIFT) % 359)
        return color(`hsb(${hue}, 100%, 100%)`)
    }

    nextParticleSize() {

        // this will cause undefined behavior if we do not filter 0 and 1
        if ((this.stuckParticles.length === 0) || (this.stuckParticles.length === 1)) {
            return this.startingSize
        } else if (this.stuckParticles.length <= LOG_BASE) {
            // if the amount of particles is lower than the base, 
            // then it will actually give a larger value overall as you divide by a number less than 1
            return this.startingSize
        } else {
            let lenlog = Math.log10(this.stuckParticles.length) / Math.log10(LOG_BASE)
            return this.startingSize / lenlog
        }
    }
}