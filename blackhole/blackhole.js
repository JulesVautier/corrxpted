var particleSize = 10
var nbParticulesOnClick = 2000

class Particle {
    constructor(x, y, color, size, enable) {
        this.initialx = x
        this.initialy = y

        this.density = Math.random() * 20 + 30

        this.size = size
        this.color = color
        this.setInitialPos()
        this.imageData = blackHoleCTX.createImageData(particleSize, particleSize)
        for (let i = 0; i < 4 * particleSize * particleSize; i++)
            this.imageData.data[i] = color[i]
        this.enable = enable
    }

    setInitialPos() {
        this.x = this.initialx
        this.y = this.initialy
    }

    draw() {
        if (this.x && this.y)
            blackHoleCTX.putImageData(this.imageData, this.x, this.y)
    }

    getDistance(x, y) {
        let dx = x - this.x
        let dy = y - this.y
        return Math.sqrt(dx * dx + dy * dy)
    }

    update() {
        let dx = mouse.x - this.x
        let dy = mouse.y - this.y
        let distance = Math.sqrt(dx * dx + dy * dy)
        if (distance < 5) {
            enableParticles.splice(enableParticles.indexOf(this), 1);
        } else {
            let forceDirectionX = dx / distance
            let forceDirectionY = dy / distance
            let issouX = -forceDirectionY + (forceDirectionX)
            let issouY = forceDirectionX + (forceDirectionY)
            forceDirectionX = issouX / 10
            forceDirectionY = issouY / 10
            let force = 1
            let directionX = forceDirectionX * force * this.density
            let directionY = forceDirectionY * force * this.density
            this.x += directionX
            this.y += directionY
        }
    }
}

var update = function () {
    for (let i = 0; i < enableParticles.length; i++) {
        enableParticles[i].draw();
        enableParticles[i].update();
    }
    // blackHoleCTX.clearRect(0, 0, blackHoleCanvas.width, blackHoleCanvas.height)
    requestAnimationFrame(update);
}

function imgToCtx(src) {
    blackHoleCTX.clearRect(0, 0, blackHoleCanvas.width, blackHoleCanvas.height)
    drawing = new Image()
    drawing.src = src
    drawing.onload = function () {
        scaleToFit(blackHoleCTX, drawing)
    }
}

function createParticlesFromImage() {
    enableParticles = []
    particles = []
    const data = blackHoleCTX.getImageData(0, 0, blackHoleCanvas.width, blackHoleCanvas.height)
    convertImagesToParticles(data)
}

function scaleToFit(ctx, img) {
    var scale = Math.max(blackHoleCanvas.width / img.width, blackHoleCanvas.height / img.height);
    var x = (blackHoleCanvas.width / 2) - (img.width / 2) * scale;
    var y = (blackHoleCanvas.height / 2) - (img.height / 2) * scale;
    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
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
    let squareSize = particleSize
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
}

var particles = []
var enableParticles = []

var blackHoleCanvas = undefined
var blackHoleCTX = undefined

function setCanvasSize(canvas) {
    var parent = document.getElementById("canvas-container")

    let style = document.defaultView.getComputedStyle(canvas)
    let left = parseInt(style.left.slice(0, -2))
    let top = parseInt(style.top.slice(0, -2))

    canvas.width = parent.offsetWidth - left * 2
    canvas.height = parent.offsetHeight - top * 2
    // canvas.width = 0
    // canvas.height = 0
}

function createCanvas() {
    let canvasContainer = document.getElementById('canvas-container')

    blackHoleCanvas = document.createElement("CANVAS");
    canvasContainer.appendChild(blackHoleCanvas)
    blackHoleCTX = blackHoleCanvas.getContext('2d')
}

function createParticlesOnMousePos() {
    for (let i = 0; i < particles.length && i < nbParticulesOnClick; i++) {
        particles[i].enable = true
        particles[i].x = mouse.x
        particles[i].y = mouse.y
        enableParticles.push(particles[i])
    }
    particles = particles.slice(nbParticulesOnClick)
}

function createPariclesByUser() {
    blackHoleCanvas.ontouchmove = getMouvePos
    blackHoleCanvas.onmousemove = getMousePos
    blackHoleCanvas.onclick = function () {
        createParticlesByScript()
    }
}

function compare(a, b) {
    if (a.getDistance(mouse.x, mouse.y) < b.getDistance(mouse.x, mouse.y)) {
        return -1;
    }
    if (a.getDistance(mouse.x, mouse.y) > b.getDistance(mouse.x, mouse.y)) {
        return 1;
    }
    return 0;
}


function createParticlesByScript() {
    createParticlesFromImage()
    particles = particles.sort(compare)
    enableParticles = [...particles]
}

function init() {
    createCanvas()
    setCanvasSize(blackHoleCanvas)
    update()
    imgToCtx("./pics/irl3.jpg")
    createPariclesByUser()
}

document.getElementById('inp').onchange = function(e) {
    imgToCtx(URL.createObjectURL(this.files[0]));
};

init()