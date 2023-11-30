// a higher total increases the resolution of the sphere
// 25 is easy for debugging
const total = 50
const globe = []
const radius = 200

let easycam
let angleX = 0
let angleY = 0

function setup() {
    let smallest;
    if (window.screen.availWidth < window.screen.availHeight) {
        smallest = window.screen.availWidth
    } else {
        // account for the task bar which is usually at the top or bottom of the screen
        smallest = window.screen.availHeight * 0.85
    }
    createCanvas(smallest, smallest, WEBGL)
    strokeWeight(0)
    stroke(200)



    easycam = createEasyCam()

    // calculate all the points that make the sphere
    for (let i = 0; i < total + 1; i++) {
        globe[i] = []

        // calculate the latitudes that all the points will fall on
        const lat = map(i, 0, total, 0, PI)


        // h doesn't mean anything special, i just dont want to use j
        for (let h = 0; h < total + 1; h++) {

            // calculate a range of longitudes for each latitude
            const lon = map(h, 0, total, 0, TWO_PI)

            // convert the latitudes and longitudes into a point on the cartesian coordinate system
            // https://en.wikipedia.org/wiki/Spherical_coordinate_system 

            globe[i][h] = sphericalToCartesian(lat, lon)
        }
    }


}

function draw() {
    background(50)

    // prepare to rotate the sphere
    rotateX(angleX)
    rotateY(angleY)

    // render the sphere
    for (let i = 0; i < total; i++) {
        beginShape(TRIANGLE_STRIP)
        for (let h = 0; h < total + 1; h++) {
            if ((i % 2) == 0) {
                continue
            }
            // this code is derived from this formula https://www.desmos.com/calculator/aprx0zpcpf
            const c = (127.5 * cos(2 * PI * ((i / (total - 1)) + 0.5))) + 127.5
            stroke(c)
            fill(c)
            const v1 = globe[i][h]
            vertex(v1.x, v1.y, v1.z)
            const v2 = globe[i + 1][h]
            vertex(v2.x, v2.y, v2.z)
        }
        endShape()
    }

    // increment the angles if the mouse isnt pressed
    if (!mouseIsPressed) {
        angleX += 0.005
        angleY += 0.006
    }
}

function sphericalToCartesian(lat, lon) {
    const x = radius * sin(lat) * cos(lon)
    const y = radius * sin(lat) * sin(lon)
    const z = radius * cos(lat)
    return createVector(x, y, z)
}

// TESTS
function TEST_sphericalToCartesian() {
    // This produces a point that lies on the "equator", the x value will be the same as the radius of the sphere 
    console.log(sphericalToCartesian(PI / 2, TWO_PI))

    // This produces a point that lies at the "south pole"
    // This is because sin(PI) == 0, and anything times 0 is 0
    console.log(sphericalToCartesian(PI, TWO_PI))

    // This produces a point that lies on the "north pole"
    // This is because sin(0) == 0, and anything times 0 is 0
    console.log(sphericalToCartesian(0, 0))
}