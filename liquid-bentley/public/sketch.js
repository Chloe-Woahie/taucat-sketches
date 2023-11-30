//const COLOR_AMOUNT = 7;

let img;
let dots;
let loaded = false;
let gusts;
let gustColor;

function setup() {
    createCanvas(600, 600, P2D)
    gusts = []
    gustColor = color("rgba(255, 255, 255, 0.2)")
    loadImage("bentley2_cleanup.jpg", _img => {
        img = _img
        img.resize(width, height)
        convertToGrayscale(img)
        dots = divideIntoDots(12)

        // give all the dots a little wobble
        for (let i = 0; i < dots.length; i++) {
            dots[i].velocity = randomVector(0.02)
        }
        loaded = true
    })

    //spawnRandomGust()
    setInterval(function() {
        if (!loaded) {
            return
        }

        spawnRandomGust()
    }, 4000)

}

function draw() {
    if (!loaded) {
        background(50)
        return
    }
    background(0)

    fill(255)
    stroke(255)
    for (let i = 0; i < dots.length; i++) {
        dots[i].update()
        dots[i].display()
    }

    fill(gustColor)
    stroke(gustColor)
    gusts = gusts.filter((gust, index, array) => {
        gust.update(dots)
        gust.draw();
        return gust.isAlive()
    })
}

function divideIntoDots(n) {
    if (((img.width % n) !== 0) || ((img.height % n) !== 0)) {
        throw "Canvas not divisible by dot size!"
    }
    let dots = []
    for (y = 0; y < img.height; y += (n)) {
        for (x = 0; x < img.width; x += (n)) {
            let dot = new Dot(img, n, x, y)
            dots.push(dot)
        }
    }
    return dots
}

function convertToGrayscale(img) {
    img.loadPixels()
    for (y = 0; y < img.height; y++) {
        for (x = 0; x < img.width; x++) {
            let index = (x + (y * img.width)) * 4;
            let red = img.pixels[index];
            let green = img.pixels[index + 1];
            let blue = img.pixels[index + 2];

            let grayscale = (red + green + blue) / 3

            img.pixels[index] = grayscale
            img.pixels[index + 1] = grayscale
            img.pixels[index + 2] = grayscale
            img.pixels[index + 3] = 255
        }
    }
    img.updatePixels()
    image(img, 0, 0, width, height)
}

function randomVector(mag) {
    let v = createVector(random(-1, 1), random(-1, 1))
    v.setMag(mag)
    return v
}

function spawnRandomGust() {
    let position = randomVectorHDistanceFromCenter((width / 2) * 1.3)
    let velocity = vectorPointingRoughlyToTheCenter(position).setMag(randomFromInterval(3, 7))
    let strength = randomFromInterval(.07, 0.2)
    let size = randomFromInterval(100, 250)

    let gust = new Gust(position, velocity, strength, size)
    gusts.push(gust)
}

function randomVectorHDistanceFromCenter(h) {
    let random = createVector(randomFromInterval(-1, 1), randomFromInterval(-1, 1))
    random.setMag(h)
    random.add(createVector(width / 2, height / 2))
    return random
}

function vectorPointingRoughlyToTheCenter(position) {
    let center = createVector(width / 2, height / 2)
    let positionRelativeToCenter = p5.Vector.sub(position, center)
    let direction = createVector((randomFromInterval(0.01, 1) * -1 * Math.sign(positionRelativeToCenter.x)), (randomFromInterval(0.01, 1) * -1 * Math.sign(positionRelativeToCenter.y)))
    return direction
}

function randomFromInterval(min, max) {
    return (Math.random() * (max - min)) + min
}

/* function convertToGrayscale(img) {
    img.loadPixels()
    for (y = 0; y < img.height; y++) {
        for (x = 0; x < img.width; x++) {
            let index = (x + (y * img.width)) * 4;
            let red = img.pixels[index];
            let green = img.pixels[index + 1];
            let blue = img.pixels[index + 2];

            let grayscale = (red + green + blue) / 3

            img.pixels[index] = grayscale
            img.pixels[index + 1] = grayscale
            img.pixels[index + 2] = grayscale
            img.pixels[index + 3] = 255
        }
    }
    img.updatePixels()
    image(img, 0, 0, width, height)
}

function applyBasicDithering() {
    img.loadPixels()
    for (y = 0; y < img.height; y++) {
        for (x = 0; x < img.width; x++) {
            let index = (x + (y * img.width)) * 4;
            let grayscale = grayscaleSegmented(img, index, COLOR_AMOUNT)
            img.pixels[index] = grayscale
            img.pixels[index + 1] = grayscale
            img.pixels[index + 2] = grayscale
            img.pixels[index + 3] = 255
        }
    }
    img.updatePixels()
}

// segments the colors n amount of times between 0 and 255
function grayscaleSegmented(img, index, n) {
    let red = img.pixels[index];
    let green = img.pixels[index + 1];
    let blue = img.pixels[index + 2];
    let average = (red + green + blue) / 3

    // an n value of 4 would only allow 4 values:
    // 0, 85, 170, 255

    let allowed = []
    let step = 255 / (n - 1)
    for (let i = 0; i < n; i++) {
        allowed.push(i * step)
    }

    // we round to the nearest allowed value
    let newGrayscale = roundToNearestNumberInArray(average, allowed)
    return newGrayscale
}

function roundToNearestNumberInArray(target, arr) {
    let closest = Number.MAX_SAFE_INTEGER;
    let index = 0;

    //noLoop()

    arr.forEach((num, i) => {
        let dist = Math.abs(target - num);

        if (dist < closest) {
            index = i;
            closest = dist;
        }
    });

    return arr[index];
}

function averageGrayscaleOfChunk(chunk) {
    img.loadPixels()
    grayscaleValues = []
    for (i = 0; i < chunk.length; i += 2) {
        let x = chunk[i]
        let y = chunk[i + 1];
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

    // not sure if i need this but im putting it here
    img.updatePixels()

    return average
}

// divides into n x n chunks
// retuns an array of arrays that contain the x and y value (in the same array) for pixels
function divideIntoChunks(n) {
    if (((img.width % n) !== 0) || ((img.height % n) !== 0)) {
        throw "Canvas not divisible by chunk size!"
    }
    let chunks = []
    for (y = 0; y < img.height; y += (n)) {
        for (x = 0; x < img.width; x += (n)) {
            let topLeftX = x
            let topLeftY = y
            let bottomRightX = cap((x + (n - 1)), (width - 1))
            let bottomRightY = cap((y + (n - 1)), (height - 1))

            let chunk = []
            for (let cy = topLeftY; cy <= bottomRightY; cy++) {
                for (let cx = topLeftX; cx <= bottomRightX; cx++) {
                    chunk.push(cx)
                    chunk.push(cy)
                }
            }
            chunks.push(chunk)
        }
    }

    return chunks
}



function cap(num, max) {
    if (num > max) {
        return max
    } else {
        return num
    }
} */