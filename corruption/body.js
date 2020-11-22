var canvas1 = document.getElementById('canvas1'),
    ctx = canvas1.getContext('2d')
;
function randomInt( min, max ) {
    return Math.floor(Math.random() * ( max - min ) + min);
}

function randomFloat( min, max ) {
    return Math.random() * ( max - min ) + min;
}

class Corumption {
    constructor(x, y, color, size, speed, fertility, angle=undefined) {
        this.initialx = x
        this.initialy = y
        this.initialsize = y

        this.x = x
        this.y = y
        this.color = color
        this.size = size
        this.fertility = fertility
        this.speed = speed
        this.angle = angle
        this.setAngle()
        this.exist()
    }

    exist() {
        // if (this.size < 1 || this.x < 0 || this.y < 0 || this.x > canvas1.height || this.y > canvas1.width) {
        if (this.size < 1) {
            return this.die()
        }
        this.duplicate()
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fill();
    }

    duplicate() {
        if (this.fertility < 1) {
            return this.fertility = 0
        }
        this.fertility = this.fertility - randomFloat(0, this.fertility)
        this.angle += randomFloat(-10, +10)
        corruptions.push(new Corumption(this.x, this.y, this.color, this.size, this.speed, this.fertility, this.angle))
    }

    live() {
        if (this.size > 5)
            this.size = this.size - randomFloat(0, this.size / randomFloat(30, 50))
        else
            this.size = this.size - randomFloat(0, this.size / 100  )
        this.setAngle()
        this.y=this.speed*Math.cos(this.angle) + this.y
        this.x=this.speed*Math.sin(this.angle) + this.x
        this.exist()
    }

    die() {
        corruptions.splice(corruptions.indexOf(this), 1);
    }

    setAngle() {
        if (this.angle === undefined) {
            this.angle = randomInt(0, 360)
        } else {
            this.angle += randomFloat(-0.1, +0.1)
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

var corruptions = []

function createCorruption(evt) {
    let pos = getMousePos(canvas1, evt)
    corruptions.push(new Corumption(pos.x, pos.y, "#ffffff", 10, 1, 5))
}

var update = function () {
    var i = corruptions.length;
    while (i--) {
        corruptions[i].live();
    }
    requestAnimationFrame(update);
}

function init() {
    setCanvasSize(canvas1)
    console.log(canvas1.width, canvas1.height)
    canvas1.onclick = createCorruption;
    canvas1.ontouchstart = createCorruption;
    update()
}

init()