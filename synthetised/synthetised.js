function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function randomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

class Particle {
    constructor(x, y, color, size) {
        this.destinaltionx = x
        this.destinaltiony = y

        this.x = x
        this.y = y

        this.size = size
        this.color = color
        this.imageData = ctx.createImageData(1, 1)
        for (let i = 0; i < 4; i++)
            this.imageData.data[i] = color[i]
    }

    draw() {
        // console.log(this.color)
        // ctx.fillStyle = this.color;
        // ctx.fillStyle = `rgba(255,0,0,25)`;

        // ctx.fi(new ImageData(this.color, 1, 1), this.x, this.y)
        // ctx.fillRect(this.x, this.y, 1, 1)
        ctx.putImageData(this.imageData, this.x, this.y)
        // ctx.beginPath();
        // ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        // ctx.fill();
    }

}

// https://stackoverflow.com/questions/47703320/draw-text-pixel-by-pixel-on-canvas

function createLetters(text) {
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = "#d00000";
    ctx.font = "14px Ubuntu"
    ctx.fillText(text, 30, 30)
    // const data = ctx.getImageData(0, 0, canvas1.width, canvas1.height)
    const data = ctx.getImageData(0, 0, 1000, 1000)
    console.log(data.data, data.width, data.height)
    console.log(data.width)
    for (let y = 0; y < data.height; y++) {
        for (let x = 0; x < data.width; x += 4) {
            let pixel1 = data.data[data.width * y + x]
            let pixel2 = data.data[data.width * y + x + 1]
            let pixel3 = data.data[data.width * y + x + 2]
            let pixel4 = data.data[data.width * y + x + 3]
            let color = [pixel1, pixel2, pixel3, pixel4]
            // console.log(pixel1, pixel2, pixel3, pixel4)
            if (pixel1 > 0 || pixel2 > 0 || pixel3 > 0 || pixel4 > 0) {
                console.log(pixel1, pixel2, pixel3, pixel4)
                particles.push(new Particle(x / 4 + 100, y / 4 + 100, color, 1))
                // let color = "rgba(pixel1, pixel2, pixel3, pixel4)"
                // console.log(color)
            }
            // console.log(pixel1)
            //     if (pixel1 > 1)
            //         console.log(pixel1)
        }
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
    canvas1.onclick = createParticles;
    canvas1.ontouchstart = createParticles;
    createLetters("A")
    update()
}

init()