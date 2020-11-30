function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function randomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

var mouse = {
    x: 0,
    y: 0,
    down: false,
}

particleSize = 3

class Particle {
    constructor(x, y, color, size, enable) {
        this.initialx = x
        this.initialy = y

        this.density = Math.random() * 20 + 30

        this.size = size
        this.color = color
        this.imageData = ctx1.createImageData(particleSize, particleSize)
        for (let i = 0; i < 4 * particleSize * particleSize; i++)
            this.imageData.data[i] = color[i]
        if (this.initialx === 0 && this.initialy === 0)
            console.log(this.imageData.data, this.imageData.data.length)
        this.enable = enable

    }

    draw() {
        if (this.x && this.y)
            ctx1.putImageData(this.imageData, this.x, this.y)
    }

    update() {
        let dx = this.initialx - Math.round(this.x)
        let dy = this.initialy - Math.round(this.y)
        let distance = Math.sqrt(dx * dx + dy * dy)
        if ((distance > 0 && distance < 10) || (distance < 0 && distance > -10)) {
            this.x = this.initialx
            this.y = this.initialy
        } else {
            // let forceDirectionX = dx / distance
            // let forceDirectionY = dy / distance

            let forceDirectionX = dx
            let forceDirectionY = dy

            // let force = distance / 300
            let force = 1 / 300
            let directionX = forceDirectionX * force * this.density
            let directionY = forceDirectionY * force * this.density
            this.x += directionX
            this.y += directionY
            this.x = Math.round(this.x)
            this.y = Math.round(this.y)
            // this.x += this.density
            // this.y += this.density
        }

        if (this.x === this.initialx && this.y === this.initialy) {
            ctx2.putImageData(this.imageData, this.x, this.y)

            // particles.splice(particles.indexOf(this), 1);
            enableParticles.splice(enableParticles.indexOf(this), 1);
            // console.log(this.x, this.y)
            // this.enable = false
        }
    }
}


var update = function () {
    ctx1.clearRect(0, 0, canvas1.width, canvas1.height)
    for (let i = 0; i < enableParticles.length; i++) {
        enableParticles[i].draw();
        enableParticles[i].update();
    }
    // enableParticles = particles.filter(x => x.enable)

    requestAnimationFrame(update);
}

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
        console.log(drawing)
        ctx1.drawImage(drawing, 0, 0);
        const data = ctx1.getImageData(0, 0, drawing.width, drawing.height)
        console.log(data.width * 4 * data.height, data.data.length)
        convertImagesToParticles(data)
    }
}

function getPixel(imageData, x, y) {
    let pixel1 = imageData.data[imageData.width * y * 4 + (x * 4)]
    let pixel2 = imageData.data[imageData.width * y * 4 + (x * 4) + 1]
    let pixel3 = imageData.data[imageData.width * y * 4 + (x * 4) + 2]
    let pixel4 = imageData.data[imageData.width * y * 4 + (x * 4) + 3]
    let pixel = [pixel1, pixel2, pixel3, pixel4]
    if (x < 10 && y < 10)
        console.log(x, y, pixel, pixel1, pixel2, pixel3, pixel4)
    return pixel
}

function getPixels(imageData, x, y, size) {
    let pixels = []
    for (let j = 0; j < size; j++) {
        for (let i = 0; i < size; i++) {
            pixels.push(...getPixel(imageData, x + i, y + j))
        }
    }
    if (x < 10 && y < 10)
        console.log("______", pixels)
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
    console.log('finish', particles.length)
}

function getMousePos(evt) {
    mouse.x = evt.clientX
    mouse.y = evt.clientY
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

var ctx1 = undefined
var canvas1 = undefined

function createCanvas() {
    let canvasContainer = document.getElementById('canvas-container')

    canvas2 = document.createElement("CANVAS");
    canvasContainer.appendChild(canvas2)
    ctx2 = canvas2.getContext('2d')

    canvas1 = document.createElement("CANVAS");
    canvasContainer.appendChild(canvas1)
    ctx1 = canvas1.getContext('2d')

}


function init() {
    createCanvas()
    setCanvasSize(canvas1)
    setCanvasSize(canvas2)
    canvas1.onclick = createParticlesOnMousePos
    canvas1.onmousemove = getMousePos
    canvas1.onmousedown = function () {
        mouse.down = true
    }
    canvas1.onmouseup = function () {
        mouse.down = false
    }
    createLetters("ABCDE")
    setInterval(function () {
        if (mouse.down)
            createParticlesOnMousePos()
    }, 100)
    update()
}

init()