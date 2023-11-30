// lower values = less elastic speed
const ELASTICITY_SPEED = 0.05

class Dot {
    constructor(img, chunkSize, startingX, startingY) {
        this.chunkSize = chunkSize
        this.pixelIndices = Dot.generateIndices(img, startingX, startingY, chunkSize)
        this.averageGrayscale = Dot.averageGrayscale(img, this.pixelIndices)

        this.strength = (this.averageGrayscale) / 255

        this.position = Dot.findCenter(this.pixelIndices)
        this.velocity = createVector()
        this.acceleration = createVector()

        // the target is where the chunk "wants" to be
        this.target = this.position.copy()

    }

    update() {
        // each dot will try to get back to its "target"
        // the farther away the dot is from the target, the harder it will try to get back to it
        // think of it like a rubber band
        this.applyElasticForce()
        this.applyDamping()

        this.acceleration.mult(0)
        this.position.add(this.velocity)
    }

    display() {
        stroke(255)
        fill(255)

        // lerp the diameter based on how far the grayscale is from 255
        let diameter = this.strength * (this.chunkSize)
        circle(this.position.x, this.position.y, diameter)
    }

    debug() {
        stroke(this.averageGrayscale)
        fill(this.averageGrayscale)
        rect(this.position.x, this.position.y, this.chunkSize, this.chunkSize)
    }

    applyForce(force) {
        // maybe do this later idk
        //force.div(this.mass)

        this.acceleration.add(force)
    }

    applyDamping() {
        // maintain a wobble
        this.velocity.add(this.acceleration)
        if (this.velocity.mag() <= 0.05) {
            this.velocity.setMag(0.05)
        } else {
            this.velocity.mult(0.98)
        }
    }

    applyElasticForce() {

        let wanted = p5.Vector.sub(this.target, this.position)

        // square it, and then take 20% of it
        //wanted.mult(wanted.mag())
        wanted.mult(ELASTICITY_SPEED)

        this.applyForce(wanted)
    }

    static findCenter(pixelIndices) {
        let topLeft = pixelIndices[0]
        let bottomRight = pixelIndices[pixelIndices.length - 1]

        let center = p5.Vector.add(topLeft, bottomRight).div(2)
        return center
    }

    static generateIndices(img, startingX, startingY, n) {

        let topLeftX = startingX
        let topLeftY = startingY
        let bottomRightX = (startingX + (n - 1))
        let bottomRightY = (startingY + (n - 1))

        let pixelIndices = []
        for (let cy = topLeftY; cy <= bottomRightY; cy++) {
            for (let cx = topLeftX; cx <= bottomRightX; cx++) {
                pixelIndices.push(createVector(cx, cy))
            }
        }
        return pixelIndices
    }

    static averageGrayscale(img, pixelIndices) {
        img.loadPixels()
        let grayscaleValues = []
        for (let i = 0; i < pixelIndices.length; i++) {
            let x = pixelIndices[i].x
            let y = pixelIndices[i].y
            let index = (x + (y * img.width)) * 4;

            // we already preprocessed it to grayscale but we'll do it again since we'll remove preprocessing later
            let red = img.pixels[index];
            let green = img.pixels[index + 1];
            let blue = img.pixels[index + 2];
            let grayscale = (red + green + blue) / 3
            grayscaleValues.push(grayscale)
        }



        let temp = 0
        for (let i = 0; i < grayscaleValues.length; i++) {
            temp += grayscaleValues[i]
        }
        let average = temp / grayscaleValues.length;

        return average
    }

    static cap(num, max) {
        if (num > max) {
            return max
        } else {
            return num
        }
    }

}