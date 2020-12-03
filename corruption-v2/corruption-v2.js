function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function randomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

function colorToInt(color) {
    return parseInt(color.slice(1, color.length), 16)
}
function intToColor(color) {
    return newColor = '#' + color.toString(16)
}

function getRGB(colorString) {
    let rgb = [colorString.slice(1, 3), colorString.slice(3, 5), colorString.slice(5, 7)]
    for (let i = 0; i < 3; i++) {
        rgb[i] = parseInt(rgb[i], 16)
    }
    return rgb
}

function arrayToRGB(colorArray) {
    return `#${colorArray[0].toString(16).padStart(2, '0')}${colorArray[1].toString(16).padStart(2, '0')}${colorArray[2].toString(16).padStart(2, '0')}`
}

class Corruption {
    constructor(x, y, startColor, endColor, size, speed, fertility) {
        this.initialx = x
        this.initialy = y
        this.initialsize = size
        this.initialfertility = fertility
        this.startColor = startColor
        this.endColor = endColor

        this.color = undefined
        this.colorStep = undefined
        this.setColor()

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

    setColor() {
        let rgb = [getRGB(this.startColor), getRGB(this.endColor)]
        this.colorStep = [0, 0, 0]
        for (let i = 0; i < 3; i++) {
            this.colorStep[i] = (parseInt(rgb[1][i], 16) - parseInt(rgb[0][i], 16)) / 40
        }
        this.color = this.startColor
    }
}


class ChildsOfCorrumption {
    constructor(mother, x, y, color, size, speed, fertility, angle = undefined) {
        this.mother = mother

        this.x = x
        this.y = y
        this.size = size
        this.fertility = fertility
        this.speed = speed
        this.angle = angle
        this.color = color
        this.setAngle()
        this.exist()
    }

    exist() {
        if (this.size < 1 || this.x < 0 || this.y < 0 || this.x > corruptionCanvas.width || this.y > corruptionCanvas.height) {
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
        this.mother.childs.push(new ChildsOfCorrumption(this.mother,
            this.mother.initialx, this.mother.initialy,
            this.color,
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
            let newColor = this.updateColor()
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

    updateColor() {
        let newColor = getRGB(this.color)
        for (let i = 0; i < 3; i++) {
            newColor[i] =  Math.floor(newColor[i] + this.mother.colorStep[i])
        }
        newColor = arrayToRGB(newColor)
        if (colorToInt(this.mother.startColor) < colorToInt(this.mother.endColor)) {
            if (colorToInt(newColor) < colorToInt(this.mother.endColor))
                return newColor
            else
                return this.color
        } else {
            if (colorToInt(newColor) > colorToInt(this.mother.endColor))
                return newColor
            else
                return this.color
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
    let pos = getMousePos(corruptionCanvas, evt)
    corruptions.push(new Corruption(pos.x, pos.y, settings.startColor, settings.endColor, settings.size, settings.speed, settings.fertility))
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
    corruptionCanvas = document.createElement("CANVAS");
    canvasContainer.appendChild(canvas1)
    corruptionCTX = canvas1.getContext('2d')
}

function init() {
    createCanvas()
    setCanvasSize(corruptionCanvas)
    corruptionCanvas.onclick = createCorruption;
    corruptionCanvas.ontouchstart = createCorruption;
    initGui()
    update()
}

function reset() {
    corruptions = []
    corruptionCTX.clearRect(0, 0, corruptionCanvas.width, corruptionCanvas.height)
}

var settings = {
    startColor: '#190a23',
    endColor: '#ff0aff',
    size: 10,
    speed: 1,
    fertility: 4,
    reset: reset
};

function initGui() {
    var gui = new dat.GUI();
    gui.add(settings, 'reset')
    gui.add(settings, 'size', 1, 100).step(1)
    gui.add(settings, 'speed', 1, 10).step(0.5)
    gui.add(settings, 'fertility', 1, 50).step(0.5);
    gui.addColor(settings, 'startColor')
    gui.addColor(settings, 'endColor')
    gui.open();
}

init()

