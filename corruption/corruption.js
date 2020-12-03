class Corruption {
    constructor(x, y, color, size, speed, fertility, angle = undefined) {
        this.initialx = x
        this.initialy = y
        this.initialsize = size
        this.initialfertility = fertility

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
        // if (this.size < 1 || this.x < 0 || this.y < 0 || this.x > canvas1.width || this.y > canvas1.height) {
        if (this.size < 1) {
            return this.die()
        }
        this.duplicate()
        corruptionCTX.fillStyle = this.color;
        corruptionCTX.beginPath();
        corruptionCTX.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        corruptionCTX.fill();
    }

    duplicate() {
        if (this.fertility < 1) {
            return this.fertility = 0
        }
        this.fertility = this.fertility - randomFloat(0, this.fertility)
        this.angle += randomFloat(-10, +10)
        corruptions.push(new Corruption(this.x, this.y, this.color, this.size, this.speed, this.fertility, this.angle))
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
        corruptions.splice(corruptions.indexOf(this), 1);
        if (corruptions.length < 50) {
            let newFertility = randomFloat(1, this.initialsize / 2)
            let newColor = parseInt(this.color.slice(1, this.color.length), 16) + parseInt("050005", 16)
            newColor = '#' + newColor.toString(16)
            corruptions.push(new Corruption(this.initialx, this.initialy, newColor, this.initialsize + 1, this.speed + randomFloat(-0.5, +0.5), newFertility, undefined))
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


function setCanvasSize(canvas) {
    var parent = document.getElementById("canvas-container")

    let style = document.defaultView.getComputedStyle(canvas)
    let left = parseInt(style.left.slice(0, -2))
    let top = parseInt(style.top.slice(0, -2))


    canvas.width = parent.offsetWidth - left * 2
    canvas.height = parent.offsetHeight - top * 2
}

var update = function () {
    var i = corruptions.length;
    while (i--) {
        corruptions[i].live();
    }
    requestAnimationFrame(update);
}

function createCanvas(containerName) {
    let canvasContainer = document.getElementById(containerName)
    corruptionCanvas = document.createElement("CANVAS");
    canvasContainer.appendChild(corruptionCanvas)
    corruptionCTX = corruptionCanvas.getContext('2d')
}

var corruptions = []
var corruptionCanvas = undefined
var corruptionCTX = undefined

class CorruptionModule {
    init(containerName) {
        createCanvas(containerName)
        setCanvasSize(corruptionCanvas)
    }

    start() {
        console.log('start')
        corruptions.push(new Corruption(window.innerWidth / 2, window.innerHeight / 2, "#190a23", 1, 1, 4))
        update()
    }
}

