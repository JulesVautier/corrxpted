
class Particle {
    constructor(x, y, color, size, speed, rainbowMode) {
        this.initialx = x
        this.initialy = y

        this.x = x
        this.y = y
        this.density = 0.5
        this.speed = speed
        this.rainbowMode = rainbowMode

        this.size = size
        this.color = color
        this.imageData = ctx.createImageData(1, 1)
        for (let i = 0; i < 4; i++)
            this.imageData.data[i] = color[i]
        this.directionX = 0
        this.directionY = 0
        if (this.rainbowMode) {
            this.rainbowColor = 0
            this.setColor()
        }

    }

    draw() {
        if (this.rainbowMode) {
            ctx.fillStyle = this.color
        } else {
            ctx.fillStyle = 'rgb(' + this.color[0] + ',' + this.color[1] + ',' + this.color[2] + ')'
        }
        if (this.size > 1) {
            ctx.beginPath()
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
            ctx.closePath()
            ctx.fill()
        } else {
            ctx.fillRect(this.x, this.y, 1, 1)
        }
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
        let force = distance / 900 * this.speed
        this.directionX += forceDirectionX * force * this.density
        this.directionY += forceDirectionY * force * this.density
        this.x += this.directionX
        this.y += this.directionY
    }

    setColor() {
        this.color = 'hsl('+this.rainbowColor+', 100%, 50%)';
        setInterval(function () {
            this.rainbowColor++
            this.color = 'hsl('+this.rainbowColor+', 100%, 50%)';
        }.bind(this), 70)

    }

}

function setCanvasSize(evt) {
    let imageData = ctx.getImageData(0, 0, canvas1.width, canvas1.height)
    canvas1.width = window.innerWidth
    canvas1.height = window.innerHeight
    ctx.putImageData(imageData, 0, 0)
}

var particles = []

var update = function () {
    if (settings.transparency) {
        if (update.counter % (Math.floor(10 /settings.transparency)) === 0) {
            let rgb = getRGB(settings.background)
            rgb[3] = 0.07
            ctx.fillStyle = 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',' + rgb[3] + ')'
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
    canvas1.ontouchmove = getMouvePos
    canvas1.onclick = function () {
        particles.push(new Particle(mouse.x, mouse.y, getRGB(settings.color), settings.size, settings.speed, settings.rainbowMode))
    }
    initGui()
    update()
    window.addEventListener('resize', setCanvasSize.bind(canvas1));
}


function reset() {
    particles = []
    ctx.clearRect(0, 0, canvas1.width, canvas1.height)
}

var settings = {
    background: '#000000',
    color: '#ffffff',
    rainbowMode: true,
    size: 1.1,
    speed: 3,
    transparency: 0.0,
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
    gui.add(settings, 'size', 1, 5).step(0.1)
    gui.add(settings, 'speed', 1, 10).step(0.1)
    gui.close()
}

init()
