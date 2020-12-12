var particleSize = 50
var nbParticulesOnClick = 1
var creationRefreshRate = 500
var center = {x: 770, y: 640}

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
        this.x = this.initialx
        this.y = this.initialy
        // this.x = randomInt(0, synthetisedCanvas1.width)
        // this.y = randomInt(0, synthetisedCanvas1.height)
    }

    draw() {
        if (this.x && this.y)
            synthetisedCTX.putImageData(this.imageData, this.x, this.y)
    }

    update() {
        // let dx = this.initialx - Math.round(this.x)
        // let dy = this.initialy - Math.round(this.y)
        // go center
        let dx = center.x - this.x
        let dy = center.y - this.y
        let distance = Math.sqrt(dx * dx + dy * dy)
        if (distance < 50) {
            ctx2.putImageData(this.imageData, this.x, this.y)
            enableParticles.splice(enableParticles.indexOf(this), 1);
        } else {
            let forceDirectionX = dx / distance
            let forceDirectionY = dy / distance
            let issouX = -forceDirectionY + (forceDirectionX / 1)
            let issouY = forceDirectionX + (forceDirectionY / 1)
            forceDirectionX = issouX
            forceDirectionY = issouY
            // forceDirectionx = Math.cos(90) - Math.sin(90)
            // | sin(a) cos(a)|
            let force = 1
            let directionX = forceDirectionX * force * this.density
            let directionY = forceDirectionY * force * this.density
            this.x += directionX
            this.y += directionY
        }

        // if (this.x === this.initialx && this.y === this.initialy) {
        //     ctx2.putImageData(this.imageData, this.x, this.y)
        //     enableParticles.splice(enableParticles.indexOf(this), 1);
        // }
        // if (this.x === center.x && this.y === center.y) {
        //     ctx2.putImageData(this.imageData, this.x, this.y)
        //     enableParticles.splice(enableParticles.indexOf(this), 1);
        // }
    }
}

var update = function () {
    for (let i = 0; i < enableParticles.length; i++) {
        enableParticles[i].draw();
        enableParticles[i].update();
    }
    requestAnimationFrame(update);
}

function createParticlesFromImage() {
    drawing = new Image()
    drawing.src = "./blackhole.jpg"
    drawing.onload = function () {
        scaleToFit(synthetisedCTX, drawing)
        const data = synthetisedCTX.getImageData(0, 0, drawing.width, drawing.height)
        convertImagesToParticles(data)
    }
}

function scaleToFit(ctx, img) {
    var scale = Math.max(synthetisedCanvas1.width / img.width, synthetisedCanvas1.height / img.height);
    var x = (synthetisedCanvas1.width / 2) - (img.width / 2) * scale;
    var y = (synthetisedCanvas1.height / 2) - (img.height / 2) * scale;
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
    enableParticles = particles.filter(x => x.enable)
}

var particles = []
var enableParticles = []

var topCanvas = undefined

function setCanvasSize(canvas) {
    var parent = document.getElementById("canvas-container")

    let style = document.defaultView.getComputedStyle(canvas)
    let left = parseInt(style.left.slice(0, -2))
    let top = parseInt(style.top.slice(0, -2))

    canvas.width = parent.offsetWidth - left * 2
    canvas.height = parent.offsetHeight - top * 2
}

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
    // topCanvas.onclick = createParticlesOnMousePos
    topCanvas.ontouchmove = getMouvePos
    topCanvas.onmousemove = getMousePos
    topCanvas.onmousedown = function () {
        mouse.down = true
    }
    topCanvas.onmouseup = function () {
        mouse.down = false
    }
    topCanvas.ontouchstart = function () {
        mouse.down = true
    }
    topCanvas.ontouchend = function () {
        mouse.down = false
    }
    setInterval(function () {
        if (mouse.down)
            createParticlesOnMousePos()
    }, 100)
}

function compare( a, b ) {
    if ( a.last_nom < b.last_nom ){
        return -1;
    }
    if ( a.last_nom > b.last_nom ){
        return 1;
    }
    return 0;
}


function createParticlesByScript() {
    setTimeout(function () {
        for (let i = 0; i < particles.length; i++) {
            particles[i].enable = true
            enableParticles.push(particles[i])
        }
        particles = []
    }, 500)

    setInterval(function () {
        // nbParticulesOnClick = 100
        // for (let i = 0; i < particles.length && i < nbParticulesOnClick; i++) {
        //     particles[i].enable = true
        //     enableParticles.push(particles[i])
        // }
        // particles = particles.slice(nbParticulesOnClick)
        console.log(enableParticles.length)
        // console.log(particles.length, enableParticles.length)
    }, 10)
}

function init() {
    createCanvas()
    setCanvasSize(synthetisedCanvas1)
    setCanvasSize(synthetisedCanvas2)
    update()
    createParticlesFromImage()
    // createPariclesByUser()
    createParticlesByScript()
}

init()