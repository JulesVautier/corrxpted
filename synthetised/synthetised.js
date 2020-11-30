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

        // this.x = x
        // this.y = y
        // this.x = x
        // this.y = y
        this.density = Math.random() * 20 + 10

        this.size = size
        this.color = color
        this.imageData = ctx1.createImageData(1, 1)
        for (let i = 0; i < 4; i++)
            this.imageData.data[i] = color[i]
        this.enable = enable

    }

    draw() {
        if (this.x && this.y)
            ctx1.putImageData(this.imageData, this.x, this.y)
    }

    update() {
        let dx = this.initialx - this.x
        let dy = this.initialy - this.y
        // let distance = Math.sqrt(dx * dx + dy * dy)
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

        // this.x += this.density
        // this.y += this.density
        this.x = Math.floor(this.x)
        this.y = Math.floor(this.y)
        if (this.x === this.initialx && this.y === this.initialy) {
            ctx2.putImageData(this.imageData, this.x, this.y)

            particles.splice(particles.indexOf(this), 1);
            enableParticles.splice(enableParticles.indexOf(this), 1);
            console.log(particles.length, enableParticles.length)
            // console.log(this.x, this.y)
            // this.enable = false
        }
    }
}


function createParticlesOnMousePos() {
    let nbParticulesOnClick = 10
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
        const data = ctx1.getImageData(0, 0, 100, 100)
        console.log(data.width * 4 * data.height, data.data.length)
        convertImagesToParticles(data)
        console.log('finished')
        console.log(particles.sort(function (a, b) {
            if (a.initialx > b.initialx)
                return 1
            else if (a.initialx < b.initialx)
                return -1
            else
                return 0
        }))
    }

    // ctx1.imageSmoothingEnabled = false;
    // ctx1.fillStyle = "#d00000";
    // ctx1.font = "30px Arial"
    // ctx1.fillText(text, 30, 30)
    // ctx1.fillRect(0, 0, 30, 30)
    // // const data = ctx.getImageData(0, 0, canvas1.width, canvas1.height)
    // const data = ctx1.getImageData(0, 0, 500, 200)
    // convertImagesToParticles(data)
}

function convertImagesToParticles(imageData) {
    let squareSize = 10
    for (let x = 0; x < imageData.width; x += squareSize) {
        console.log(x)
        for (let y = 0; y < imageData.height; y += squareSize) {
            for (let squareY = y; squareY < imageData.height && squareY < y + squareSize; squareY++) {
                for (let squareX = x; squareX < imageData.width && squareX < x + squareSize; squareX++) {
                    let pixel1 = imageData.data[imageData.width * squareY * 4 + (squareX * 4)]
                    let pixel2 = imageData.data[imageData.width * squareY * 4 + (squareX * 4) + 1]
                    let pixel3 = imageData.data[imageData.width * squareY * 4 + (squareX * 4) + 2]
                    let pixel4 = imageData.data[imageData.width * squareY * 4 + (squareX * 4) + 3]
                    let color = [pixel1, pixel2, pixel3, pixel4]
                    if (pixel1 > 0 || pixel2 > 0 || pixel3 > 0 || pixel4 > 0) {
                        particles.push(new Particle(squareX, squareY, color, 1, false))
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

var update = function () {
    ctx1.clearRect(0, 0, canvas1.width, canvas1.height)
    for (let i = 0; i < enableParticles.length; i++) {
        enableParticles[i].draw();
        enableParticles[i].update();
    }
    // enableParticles = particles.filter(x => x.enable)

    requestAnimationFrame(update);
}

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