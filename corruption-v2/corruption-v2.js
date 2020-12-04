class CorruptionV2 {
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
        this.childs.push(new ParticleCorruptionV2(this,
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


class ParticleCorruptionV2 {
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
        if (this.size < 1 || this.x < 0 || this.y < 0 || this.x > corruptionV2Canvas.width || this.y > corruptionV2Canvas.height) {
            return this.die()
        }
        this.duplicate()
        corruptionV2CTX.fillStyle = this.color;
        corruptionV2CTX.beginPath();
        corruptionV2CTX.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        corruptionV2CTX.fill();
    }

    duplicate() {
        if (this.fertility < 1) {
            return this.fertility = 0
        }
        this.fertility = this.fertility - randomFloat(0, this.fertility)
        this.angle += randomFloat(-10, +10)
        this.mother.childs.push(new ParticleCorruptionV2(this.mother,
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
            this.mother.childs.push(new ParticleCorruptionV2(this.mother,
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
    corruptions.push(new CorruptionV2(mouse.x, mouse.y, settings.startColor, settings.endColor, settings.size, settings.speed, settings.fertility))
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
    corruptionV2Canvas = document.createElement("CANVAS");
    canvasContainer.appendChild(corruptionV2Canvas)
    corruptionV2CTX = corruptionV2Canvas.getContext('2d')
}

function init() {
    createCanvas()
    setCanvasSize(corruptionV2Canvas)
    corruptionV2Canvas.onmousemove = getMousePos
    corruptionV2Canvas.ontouchmove = getMousePos
    corruptionV2Canvas.onclick = createCorruption;
    corruptionV2Canvas.ontouchstart = createCorruption;
    initGui()
    update()
}

function reset() {
    corruptions = []
    corruptionV2CTX.clearRect(0, 0, corruptionV2Canvas.width, corruptionV2Canvas.height)
}

var settings = {
    background: '#000000',
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
    gui.addColor(settings, 'background').onChange(function (color) {
        corruptionV2Canvas.style.backgroundColor = color
    })
    gui.add(settings, 'size', 1, 100).step(1).onC
    gui.add(settings, 'speed', 1, 10).step(0.5)
    gui.add(settings, 'fertility', 1, 50).step(0.5);
    gui.addColor(settings, 'startColor')
    gui.addColor(settings, 'endColor')
    gui.close()
}

init()

