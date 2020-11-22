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
    constructor(x, y, color, size, speed, fertility) {
        this.x = x
        this.y = y
        this.color = color
        this.size = size
        this.fertility = fertility
        this.speed = speed
        this.setAngle()
        this.exist()
    }

    exist() {
        if (this.size < 1)
            return this.die()
        ctx.fillStyle = "rgba(255,0,0)";
        ctx.fillStyle = this.color;
        ctx.beginPath();
        console.log(this.angle, this.size)
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fill();
    }

    duplicate() {

    }

    live() {
        this.size = this.size - randomFloat(0, this.size / 20)
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
    let height = parseInt(style.height.slice(0, -2))

    canvas.width = parent.offsetWidth - left * 2
    canvas.height = parent.offsetHeight - height * 2
}

var corruptions = []

function createCorruption(evt) {
    let pos = getMousePos(canvas1, evt)
    corruptions.push(new Corumption(pos.x, pos.y, "#ffffff", 40, 2, 1))
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
    canvas1.onclick = createCorruption;
    update()
}

init()