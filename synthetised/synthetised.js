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

class Particle {
    constructor(x, y, color, size, enable) {
        this.initialx = x
        this.initialy = y

        this.x = x + 700
        this.y = y + 700
        this.density = Math.random() * 20 + 10

        this.size = size
        this.color = color
        this.imageData = ctx.createImageData(1, 1)
        for (let i = 0; i < 4; i++)
            this.imageData.data[i] = color[i]
        this.enable = enable
    }

    draw() {
        if (this.x && this.y)
            ctx.putImageData(this.imageData, this.x, this.y)
    }

    update() {
        if (!this.enable)
            return
        let dx = this.initialx - this.x
        let dy = this.initialy - this.y
        let distance = Math.sqrt(dx * dx + dy * dy)
        if (distance === 0) {
            return
        }
        let forceDirectionX = dx / distance
        let forceDirectionY = dy / distance
        let force = distance / 300
        let directionX = forceDirectionX * force * this.density
        let directionY = forceDirectionY * force * this.density
        this.x += directionX
        this.y += directionY
        if (this.x === this.initialx && this.y === this.density) {
            this.enable = false
        }
    }

}

function createLetters(text) {
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = "#d00000";
    ctx.font = "30px Arial"
    ctx.fillText(text, 30, 30)
    const data = ctx.getImageData(0, 0, canvas1.width, canvas1.height)
    convertImagesToParticles(data)
}

function convertImagesToParticles(imageData) {
    let squareSize = 10

    for (let x = 0; x * squareSize < imageData.width; x += squareSize) {
        for (let y = 0; y * squareSize < imageData.height; y += squareSize) {
            for (let squareY = y; squareY < imageData.height && squareY < (y + 1) * squareSize; squareY++) {
                for (let squareX = x; squareX < imageData.width && squareX < (x + 1) * squareSize; squareX++) {
                    let pixel1 = imageData.data[imageData.width * squareY + (squareX * 4)]
                    let pixel2 = imageData.data[imageData.width * squareY + (squareX * 4) + 1]
                    let pixel3 = imageData.data[imageData.width * squareY + (squareX * 4) + 2]
                    let pixel4 = imageData.data[imageData.width * squareY + (squareX * 4) + 3]
                    let color = [pixel1, pixel2, pixel3, pixel4]
                    if (pixel1 > 0 || pixel2 > 0 || pixel3 > 0 || pixel4 > 0) {
                        particles.push(new Particle(squareX, squareY, color, 1, false))
                    }
                }
            }
        }
    }
    console.log('finish', particles.length)


    // for (let y = 0; y < data.height; y++) {
    //     for (let x = 0; x < data.width; x += 4) {
    //         let pixel1 = data.data[data.width * y + x]
    //         let pixel2 = data.data[data.width * y + x + 1]
    //         let pixel3 = data.data[data.width * y + x + 2]
    //         let pixel4 = data.data[data.width * y + x + 3]
    //         let color = [pixel1, pixel2, pixel3, pixel4]
    //         if (pixel1 > 0 || pixel2 > 0 || pixel3 > 0 || pixel4 > 0) {
    //             particles.push(new Particle(x / 4, y / 4, color, 1))
    //         }
    //     }
    // }
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

var update = function () {
    ctx.clearRect(0, 0, canvas1.width, canvas1.height)
    for (let i = 0; i < enableParticles.length; i++) {
        enableParticles[i].draw();
        enableParticles[i].update();
    }
    enableParticles = particles.filter(x => x.enable)
    requestAnimationFrame(update);
}

var ctx = undefined
var canvas1 = undefined

function createCanvas() {
    let canvasContainer = document.getElementById('canvas-container')
    canvas1 = document.createElement("CANVAS");
    canvasContainer.appendChild(canvas1)
    ctx = canvas1.getContext('2d')
}

setInterval(function () {
    let nbParticulesOnClick = 100
    if (mouse.down) {
        for (let i = 0; i < particles.length && i < nbParticulesOnClick; i++) {
            particles[i].enable = true
            particles[i].x = mouse.x
            particles[i].y = mouse.y
            enableParticles.push(particles[i])
        }
        particles = particles.slice(nbParticulesOnClick)
        console.log(particles.length, enableParticles.length)
    }
}, 10)

function init() {
    createCanvas()
    setCanvasSize(canvas1)
    canvas1.onmousemove = getMousePos
    canvas1.onmousedown = function () {
        mouse.down = true
    }
    canvas1.onmouseup = function () {
        mouse.down = false
    }
    createLetters("ABCDE")
    update()
}

init()