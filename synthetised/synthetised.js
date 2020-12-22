
particleSize = 3

class Particle {
    constructor(x, y, color, size, enable) {
        this.initialx = x
        this.initialy = y

        this.density = Math.random() * 20 + 30

        this.size = size
        this.color = color
        this.setInitialPos()
        this.imageData = synthetisedCTX.createImageData(particleSize, particleSize)
        for (let i = 0; i < 4 * particleSize * particleSize; i++)
            this.imageData.data[i] = color[i]
        this.enable = enable

    }

    setInitialPos() {
        this.x = randomInt(0, synthetisedCanvas1.width)
        this.y = randomInt(0, synthetisedCanvas1.height)
    }

    draw() {
        if (this.x && this.y)
            synthetisedCTX.putImageData(this.imageData, this.x, this.y)
    }

    update() {
        let dx = this.initialx - this.x
        let dy = this.initialy - this.y
        let distance = Math.sqrt(dx * dx + dy * dy)
        if ((distance > 0 && distance < 10) || (distance < 0 && distance > -10)) {
            this.x = this.initialx
            this.y = this.initialy
        } else {
            let forceDirectionX = dx
            let forceDirectionY = dy
            let force = 1 / 300
            let directionX = forceDirectionX * force * this.density
            let directionY = forceDirectionY * force * this.density
            this.x += directionX
            this.y += directionY
            this.x = Math.round(this.x)
            this.y = Math.round(this.y)
        }

        if (this.x === this.initialx && this.y === this.initialy) {
            ctx2.putImageData(this.imageData, this.x, this.y)
            enableParticles.splice(enableParticles.indexOf(this), 1);
        }
    }
}


var update = function () {
    // if (enableParticles.length === 0)
    //     ctx1.fillStyle = "rgba(0,0,0)";
    // else
    //     ctx1.fillStyle = "rgba(0,0,0, 0.02)";
    // ctx1.fillRect(0, 0, synthetisedCanvas1.width, synthetisedCanvas1.height);
    for (let i = 0; i < enableParticles.length; i++) {
        enableParticles[i].draw();
        enableParticles[i].update();
    }
    requestAnimationFrame(update);
}

// setInterval(function () {
//     let nbParticulesOnClick = 100
//     if (particles.length > 0) {
//         for (let counter = 0; counter < nbParticulesOnClick; counter++) {
//             let i = randomInt(0, particles.length)
//             // console.log(i, particles.length)
//             particles[i].enable = true
//             particles[i].setInitialPos()
//             enableParticles.push(particles[i])
//             particles.splice(i, 1)
//         }
//     }
// }, 100)

function createParticlesOnMousePos() {
    let nbParticulesOnClick = 1000
    for (let i = 0; i < particles.length && i < nbParticulesOnClick; i++) {
        particles[i].enable = true
        particles[i].x = mouse.x
        particles[i].y = mouse.y
        enableParticles.push(particles[i])
    }
    particles = particles.slice(nbParticulesOnClick)
}

function createLetters(text) {
    drawing = new Image()
    drawing.src = "../pics/trou.jpg"
    drawing.onload = function () {
        synthetisedCTX.drawImage(drawing, 0, 0);
        const data = synthetisedCTX.getImageData(0, 0, drawing.width - drawing.width % particleSize, drawing.height - drawing.height % particleSize)
        convertImagesToParticles(data)
        synthetisedCTX.fillStyle = "rgba(0,0,0)";
        synthetisedCTX.fillRect(0,0, synthetisedCanvas1.width, synthetisedCanvas1.height)
    }
}

function getPixel(imageData, x, y) {
    let index = imageData.width * y * 4 + (x * 4)
    if (index >= imageData.data.length - 4)
        return [0, 0, 0, 0]
    let pixel1 = imageData.data[index]
    let pixel2 = imageData.data[index + 1]
    let pixel3 = imageData.data[index + 2]
    let pixel4 = imageData.data[index + 3]
    return [pixel1, pixel2, pixel3, pixel4]
}

function getPixels(imageData, x, y, size) {
    let pixels = []
    for (let j = 0; j < size; j++) {
        for (let i = 0; i < size; i++) {
            pixels.push(...getPixel(imageData, x + i, y + j))
        }
    }
    return pixels
}

function convertImagesToParticles(imageData) {
    let squareSize = 100
    for (let y = 0; y < imageData.height; y += squareSize) {
        for (let x = 0; x < imageData.width; x += squareSize) {
            for (let squareY = y; squareY < imageData.height && squareY < y + squareSize; squareY += particleSize) {
                for (let squareX = x; squareX < imageData.width && squareX < x + squareSize; squareX += particleSize) {
                    let pixels = getPixels(imageData, squareX, squareY, particleSize)
                    if (pixels.reduce((a, b) => a + b) > 0) {
                        particles.push(new Particle(squareX, squareY, pixels, 1, false))
                    }
                }
            }
        }
    }
    enableParticles = particles.filter(x => x.enable)
}

function setCanvasSize(canvas) {
    var parent = document.getElementById("canvas-container")

    let style = document.defaultView.getComputedStyle(canvas)
    let left = parseInt(style.left.slice(0, -2))
    let top = parseInt(style.top.slice(0, -2))

    canvas.width = parent.offsetWidth - left * 2
    canvas.height = parent.offsetHeight - top * 2
}

var particles = []
var enableParticles = []

var topCanvas = undefined

function createCanvas() {
    let canvasContainer = document.getElementById('canvas-container')


    synthetisedCanvas2 = document.createElement("CANVAS");
    canvasContainer.appendChild(synthetisedCanvas2)
    ctx2 = synthetisedCanvas2.getContext('2d')

    synthetisedCanvas1 = document.createElement("CANVAS");
    canvasContainer.appendChild(synthetisedCanvas1)
    synthetisedCTX = synthetisedCanvas1.getContext('2d')

    topCanvas = synthetisedCanvas1
}


function init() {
    createCanvas()
    setCanvasSize(synthetisedCanvas1)
    setCanvasSize(synthetisedCanvas2)
    topCanvas.onclick = createParticlesOnMousePos
    topCanvas.onmousemove = getMousePos
    topCanvas.onmousedown = function () {
        mouse.down = true
    }
    topCanvas.onmouseup = function () {
        mouse.down = false
    }
    createLetters("ABCDE")
    setInterval(function () {
        if (mouse.down)
            createParticlesOnMousePos()
    }, 100)
    update()
}

document.getElementById('inp').onchange = function(e) {
    imgToCtx(URL.createObjectURL(this.files[0]));
};

init()