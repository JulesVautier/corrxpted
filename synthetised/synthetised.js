function randomInt( min, max ) {
    return Math.floor(Math.random() * ( max - min ) + min);
}

function randomFloat( min, max ) {
    return Math.random() * ( max - min ) + min;
}

class Particle {
    constructor(x, y, color, size) {
        this.destinaltionx = x
        this.destinaltiony = y

        this.x = x
        this.y = y

        this.size = size
        this.color = color
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fill();
    }

}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
        y: (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
    };
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

function createParticles(evt) {
    let pos = getMousePos(canvas1, evt)
    particles.push(new Particle(pos.x, pos.y, "#787676", 1))
}

var update = function () {
    var i = particles.length;
    while (i--) {
        particles[i].draw();
    }
    requestAnimationFrame(update);
}

function createCanvas() {
    let canvasContainer = document.getElementById('canvas-container')
    canvas1 = document.createElement("CANVAS");
    canvasContainer.appendChild(canvas1)
    ctx = canvas1.getContext('2d')
}

function init() {
    createCanvas()
    setCanvasSize(canvas1)
    canvas1.onclick = createParticles;
    canvas1.ontouchstart = createParticles;
    update()
}

init()