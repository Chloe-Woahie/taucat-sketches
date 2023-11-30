let particles;
let crystal;
let counter;
let startingSize;
let smallest;

function setup() {
    if (window.screen.availWidth < window.screen.availHeight) {
        smallest = window.screen.availWidth
    } else {
        // account for the task bar which is usually at the top or bottom of the screen
        smallest = window.screen.availHeight * 0.85
    }
    createCanvas(smallest, smallest, P2D)
    counter = 0;
    startingSize = 15;

    particles = []

    crystal = new Crystal(startingSize, new Particle(createVector(width / 2, height / 2), startingSize), smallest / 2)

    setInterval(() => {
        let nextSize = crystal.nextParticleSize()

        counter += (Math.pow((startingSize - nextSize), 2) / 20) + 0.2
        if (counter >= 1) {
            while (counter >= 1) {
                spawnParticle()
                counter -= 1
            }
        }
    }, 1)
}

function draw() {
    background(50)
        //translate(width / 2, height / 2)


    strokeWeight(0)
    stroke(255)

    // only retains the particles that are not stuck
    particles = particles.filter((particle, index, array) => {
        particle.update()

        if (crystal.particleIsStuck(particle)) {
            crystal.addParticle(particle)
            return false
        }

        particle.draw()
        return true
    })

    crystal.draw();
}


function randomFromInterval(min, max) {
    return (Math.random() * (max - min)) + min
}

/* function spawnParticle() {
    let size = crystal.nextParticleSize()

    let rand = Math.random()
    if (rand < 0.25) {
        // spawn on top side
        let p = new Particle(createVector(randomFromInterval(0, width), 0), size)
        particles.push(p)
    } else if (rand < 0.5) {
        // spawn on right side
        let p = new Particle(createVector(width, randomFromInterval(0, height)), size)
        particles.push(p)
    } else if (rand < 0.75) {
        // spawn on bottom side
        let p = new Particle(createVector(randomFromInterval(0, width), height), size)
        particles.push(p)
    } else {
        // spawn on left side
        let p = new Particle(createVector(0, randomFromInterval(0, height)), size)
        particles.push(p)
    }
} */

function spawnParticle() {
    let size = crystal.nextParticleSize()
    let randVec = createVector(randomFromInterval(-1, 1), randomFromInterval(-1, 1))
    randVec.setMag(smallest / 2)
    randVec.add(createVector(width / 2, height / 2))

    let p = new Particle(randVec, size)
    particles.push(p)
}