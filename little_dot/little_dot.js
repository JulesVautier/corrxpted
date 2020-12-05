
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

function setCanvasSize(canvas) {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
}

var particles = []

var update = function () {
    if (settings.transparency) {
        if (update.counter % (Math.floor(10 /settings.transparency)) === 0) {
            ctx.fillStyle = 'rgba(0,0,0,0.05)'
            ctx.fillRect(0, 0, canvas1.width, canvas1.height)
        }
        update.counter++
    }
    var i = particles.length;
    while (i--) {
        particles[i].draw();
        particles[i].update();
    }
    requestAnimationFrame(update);
}
update.counter = 0

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
        particles.push(new Particle(mouse.x, mouse.y, getRGB(settings.color), 30))
    }
    initGui()
    update()
}


function reset() {
    particles = []
    ctx.clearRect(0, 0, canvas1.width, canvas1.height)
}

var settings = {
    background: '#000000',
    color: '#ffffff',
    rainbowMode: false,
    size: 1,
    speed: 1,
    transparency: 0.5,
    reset: reset
};


function initGui() {
    var gui = new dat.GUI();
    gui.add(settings, 'reset')
    gui.addColor(settings, 'background').onChange(function (background) {
        canvas1.style.backgroundColor = background
    })
    gui.addColor(settings, 'color')
    gui.add(settings, 'rainbowMode')
    gui.add(settings, 'transparency', 0, 10).step(0.5)
    gui.add(settings, 'size', 1, 10).step(0.5)
    gui.add(settings, 'speed', 1, 100).step(1)
    gui.close()
}

init()
window.addEventListener('resize', setCanvasSize.bind(canvas1));
