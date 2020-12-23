particleSize = 7

class Particle {
    constructor(x, y, imgData, size, enable) {
        this.initialx = x
        this.initialy = y

        this.density = Math.random() * 20 + 30

        this.size = size
        this.setInitialPos()
        this.imageData = imgData
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
            enableParticles.splice(enableParticles.indexOf(this), 1);
        }
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

function convertImagesToParticles(ctx, width, height) {
    let squareSize = 100
    for (let y = 0; y < height; y += squareSize) {
        for (let x = 0; x < width; x += squareSize) {
            for (let squareY = y; squareY < height && squareY < y + squareSize; squareY += particleSize) {
                for (let squareX = x; squareX < width && squareX < x + squareSize; squareX += particleSize) {
                    particles.push(new Particle(squareX, squareY, ctx.getImageData(squareX, squareY, particleSize, particleSize), 1, false))
                }
            }
        }
    }
}

var update = function () {
    for (let i = 0; i < enableParticles.length; i++) {
        enableParticles[i].draw();
        enableParticles[i].update();
    }
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

function imgToCtx(src) {
    drawing = new Image()
    drawing.src = src
    return new Promise(resolve => {
        drawing.onload = function () {
            let data = synthetisedCTX.getImageData(0, 0, synthetisedCanvas1.width, synthetisedCanvas1.height)
            scaleToFit(synthetisedCTX, drawing)
            convertImagesToParticles(synthetisedCTX, synthetisedCanvas1.width, synthetisedCanvas1.height)
            synthetisedCTX.putImageData(data, 0, 0)
            resolve()
        }
    })
}

function scaleToFit(ctx, img) {
    var scale = Math.max(synthetisedCanvas1.width / img.width, synthetisedCanvas1.height / img.height);
    var x = (synthetisedCanvas1.width / 2) - (img.width / 2) * scale;
    var y = (synthetisedCanvas1.height / 2) - (img.height / 2) * scale;
    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
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

    synthetisedCanvas1 = document.createElement("CANVAS");
    canvasContainer.appendChild(synthetisedCanvas1)
    synthetisedCTX = synthetisedCanvas1.getContext('2d')
    setCanvasSize(synthetisedCanvas1)

    topCanvas = synthetisedCanvas1
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function init() {
    createCanvas()
    topCanvas.onclick = createParticlesOnMousePos
    topCanvas.onmousemove = getMousePos
    topCanvas.onmousedown = function () {
        mouse.down = true
    }
    topCanvas.onmouseup = function () {
        mouse.down = false
    }
    const images = ["lake.jpg", "battle.jpg", "peinture.jpg", "roma.jpg", "trafalgar.jpg", "vercingetorix.jpg",
        "citynight.jpg", "deadhorse.jpg", "jesus.jpg", "allaitement.jpg", "navire.jpg", "spectre.jpg", "eye.jpg", "waaaa.jpg"
    ]
    for (const img of images) {
        await imgToCtx("./pics/" + img)
    }
    setInterval(function () {
        if (mouse.down)
            createParticlesOnMousePos()
    }, 100)
    update()
}

document.getElementById('inp').onchange = async function (e) {
    particles = []
    enableParticles = []
    for (let i = 0; i < this.files.length; i++)
        await imgToCtx(URL.createObjectURL(this.files[i]));
};

init()
x(URL.createObjectURL(file));