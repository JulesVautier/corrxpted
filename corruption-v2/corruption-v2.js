class CorruptionV2 {
    constructor(x, y, startColor, endColor, size, speed, divisionRate) {
        this.initialx = x
        this.initialy = y
        this.initialsize = size
        this.divisionRate = divisionRate
        this.startColor = startColor
        this.endColor = endColor

        this.color = undefined
        this.colorStep = undefined
        this.setColor()

        this.speed = speed

        this.childs = []
        this.create()
    }

    create() {
        this.nbParticles = this.getNbParticlesToCreate()
        for (let i = 0; i < this.nbParticles; i++) {
            this.childs.push(new ParticleCorruptionV2(this,
                this.initialx,
                this.initialy,
                this.color,
                this.initialsize,
                this.divisionRate))
        }
    }

    draw() {
        for (let i = 0; i < this.childs.length; i++) {
            this.childs[i].animate()
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

    getNbParticlesToCreate() {
        return 1
        return 1 + (this.initialsize / 3)
    }
}


class ParticleCorruptionV2 {
    constructor(mother, x, y, color, size, divisionRate, angle = undefined) {
        this.mother = mother

        this.x = x
        this.y = y
        this.size = size
        this.divisionRate = divisionRate
        this.angle = angle
        this.color = color
        this.setAngle()
        this.draw()
    }

    draw() {
        if (this.size < 1 || this.x < 0 || this.y < 0 || this.x > corruptionV2Canvas.width || this.y > corruptionV2Canvas.height) {
            return this.destroy()
        }
        this.duplicate()
        corruptionV2CTX.fillStyle = this.color;
        corruptionV2CTX.beginPath();
        corruptionV2CTX.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        corruptionV2CTX.fill();
    }

    duplicate() {
        let facteur = 450
        let condition = randomInt(0, 100 * facteur)
        if ((this.divisionRate * 1) > condition) {
            this.divisionRate /= 2
            this.mother.childs.push(new ParticleCorruptionV2(this.mother,
                this.x, this.y,
                this.color,
                this.size, this.divisionRate, this.angle))
        }
    }

    animate() {
        if (this.size > 3)
            this.size = this.size - randomFloat(0, this.size / randomFloat(30, 50))
        else
            this.size = this.size - randomFloat(0, this.size / 150)
        this.setAngle()
        let speed = (this.size / 7) + 1
        this.y = speed * Math.cos(this.angle) + this.y
        this.x = speed* Math.sin(this.angle) + this.x
        this.draw()
    }

    destroy() {
        this.mother.childs.splice(this.mother.childs.indexOf(this), 1);
        if (this.mother.childs.length < 50) {
            let newFertility = randomFloat(1, this.mother.initialsize / 2)
            let newColor = this.updateColor()
            this.mother.childs.push(new ParticleCorruptionV2(this.mother,
                this.mother.initialx, this.mother.initialy, newColor,
                this.mother.initialsize + 1,
                newFertility, undefined))
        }
    }

    updateColor() {
        let newColor = getRGB(this.color)
        for (let i = 0; i < 3; i++) {
            newColor[i] = Math.floor(newColor[i] + this.mother.colorStep[i])
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

window.addEventListener('resize', setCanvasSize.bind(corruptionV2Canvas));


function createCanvas() {
    let canvasContainer = document.getElementById('canvas-container')
    corruptionV2Canvas = document.createElement("CANVAS");
    canvasContainer.appendChild(corruptionV2Canvas)
    corruptionV2CTX = corruptionV2Canvas.getContext('2d')
}

var corruptionV2Canvas = undefined
var corruptions = []

function createCorruption(evt) {
    corruptions.push(new CorruptionV2(mouse.x, mouse.y, settings.startColor, settings.endColor, settings.size, settings.speed, settings.divisionRate * 50))
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

var update = function () {
    var i = corruptions.length;
    while (i--) {
        for (let speed = 0; speed < corruptions[i].speed; speed++) {
            corruptions[i].draw()
        }
    }
    requestAnimationFrame(update);
}

var settings = {
    background: '#000000',
    startColor: '#190a23',
    endColor: '#ff0aff',
    size: 10,
    speed: 1,
    divisionRate: 100,
    reset: reset
};

function initGui() {
    var gui = new dat.GUI();
    gui.add(settings, 'reset')
    gui.addColor(settings, 'background').onChange(function (color) {
        corruptionV2Canvas.style.backgroundColor = color
    })
    gui.add(settings, 'size', 1, 100).step(1)
    gui.add(settings, 'speed', 1, 10).step(0.5)
    gui.add(settings, 'divisionRate', 0, 100).step(1);
    gui.addColor(settings, 'startColor')
    gui.addColor(settings, 'endColor')
    gui.close()
}

init()

