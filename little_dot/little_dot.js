function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function randomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

var mouse = {
    x: 0,
    y: 0
}

class Particle {
    constructor(x, y, color, size) {
        this.initialx = x
        this.initialy = y

        this.x = x
        this.y = y
        this.density = 0.5

        this.size = size
        this.color = color
        this.imageData = ctx.createImageData(1, 1)
        for (let i = 0; i < 4; i++)
            this.imageData.data[i] = color[i]
        this.directionX = 0
        this.directionY = 0
    }

    draw() {
        ctx.putImageData(this.imageData, this.x, this.y)
    }

    update() {
        let dx = mouse.x - this.x
        let dy = mouse.y - this.y
        if (mouse.x === this.x || mouse.y === this.y) {
            return
        }
        let distance = Math.sqrt(dx * dx + dy * dy)
        let forceDirectionX = dx / distance
        let forceDirectionY = dy / distance
        let force = distance / 300
        this.directionX += forceDirectionX * force * this.density
        this.directionY += forceDirectionY * force * this.density
        this.x += this.directionX
        this.y += this.directionY
    }

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

var update = function () {
    // ctx.clearRect(0, 0, canvas1.width, canvas1.height)
    var i = particles.length;
    while (i--) {
        particles[i].draw();
        particles[i].update();
    }
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

function init() {
    createCanvas()
    setCanvasSize(canvas1)
    canvas1.onmousemove = getMousePos
    canvas1.onclick = function () {
        particles.push(new Particle(mouse.x, mouse.y, [255, 255, 255, 255], 30))
    }
    update()
}

init()
window.addEventListener('resize', setCanvasSize.bind(canvas1));
