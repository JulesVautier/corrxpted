function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function randomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

class Corruption {
    constructor(x, y, color, size, speed, fertility) {
        this.initialx = x
        this.initialy = y
        this.initialsize = size
        this.initialfertility = fertility

        this.color = color
        this.speed = speed

        this.childs = []
        this.birth()
    }

    birth() {
        this.childs.push(new ChildsOfCorrumption(this,
            this.initialx,
            this.initialy,
            this.color,
            this.initialsize,
            this.speed,
            this.initialfertility))
    }

    corrupt() {
        for (let i = 0; i < this.childs.length; i++) {
            this.childs[i].live()
        }
    }
}

class ChildsOfCorrumption {
    constructor(mother, x, y, color, size, speed, fertility, angle = undefined) {
        this.mother = mother

        this.x = x
        this.y = y
        this.color = color
        this.size = size
        this.fertility = fertility
        this.speed = speed
        this.angle = angle
        this.colorMutiplicator = 1
        this.setAngle()
        this.exist()
    }

    exist() {
        if (this.size < 1 || this.x < 0 || this.y < 0 || this.x > canvas1.width || this.y > canvas1.height) {
            return this.die()
        }
        this.duplicate()
        ctx1.fillStyle = this.color;
        ctx1.beginPath();
        ctx1.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx1.fill();
    }

    duplicate() {
        if (this.fertility < 1) {
            return this.fertility = 0
        }
        this.fertility = this.fertility - randomFloat(0, this.fertility)
        this.angle += randomFloat(-10, +10)
        this.mother.childs.push(new ChildsOfCorrumption(this.mother,
            this.mother.initialx, this.mother.initialy, this.color,
            this.size, this.speed, this.fertility, this.angle))
    }

    live() {
        if (this.size > 3)
            this.size = this.size - randomFloat(0, this.size / randomFloat(30, 50))
        else
            this.size = this.size - randomFloat(0, this.size / 150)
        this.setAngle()
        this.y = this.speed * Math.cos(this.angle) + this.y
        this.x = this.speed * Math.sin(this.angle) + this.x
        this.exist()
    }

    die() {
        this.mother.childs.splice(this.mother.childs.indexOf(this), 1);
        if (this.mother.childs.length < 50) {
            let newFertility = randomFloat(1, this.mother.initialsize / 2)
            let newColor = parseInt(this.color.slice(1, this.color.length), 16)
            if (newColor > parseInt("C600FF", 16)) {
                this.colorMutiplicator = -1
            } else if (newColor < parseInt("250030", 16)) {
                this.colorMutiplicator = 1
            }
            newColor += this.colorMutiplicator * parseInt("050005", 16)
            newColor = '#' + newColor.toString(16)
            let newSpeed = this.speed + randomFloat(-0.5, +0.5)
            if (newSpeed > 3) {
                newSpeed = 3
            } else if (newSpeed < 1) {
                newSpeed = 1
            }
            this.mother.childs.push(new ChildsOfCorrumption(this.mother,
                this.mother.initialx, this.mother.initialy, newColor,
                this.mother.initialsize + 1, newSpeed,
                newFertility, undefined))
        }
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
    corruptions.push(new Corruption(pos.x, pos.y, "#190a23", 10, 1, 4))
}

var update = function () {
    var i = corruptions.length;
    while (i--) {
        corruptions[i].corrupt();
    }
    requestAnimationFrame(update);
}

function createCanvas() {
    let canvasContainer = document.getElementById('canvas-container')
    canvas1 = document.createElement("CANVAS");
    canvasContainer.appendChild(canvas1)
    ctx1 = canvas1.getContext('2d')
}

function init() {
    createCanvas()
    setCanvasSize(canvas1)
    canvas1.onclick = createCorruption;
    canvas1.ontouchstart = createCorruption;
    update()
}

init()