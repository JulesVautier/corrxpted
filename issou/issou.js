var settings = {
    background: '#000000',
    color: '#ffffff',
};

let images_data = []
let FILE_NAME = "img_colors.json"

class Issou {
    constructor(sprite) {
        this.direction = 90
        this.speed = 2
        this.sprite = sprite
        this.sprite.height = 100
        this.sprite.width = 100
        this.x = mouse.x
        this.y = mouse.y
    }

    update() {
        this.direction += randomInt(-10, 10) % 360
        this.move()
    }

    move() {
        if (this.x + this.sprite.width > ctx.width || this.y + this.sprite.height > ctx.height || this.x < 0 || this.y < 0)
            this.direction += 180 % 360
        let angle = this.direction * Math.PI / 180;
        this.x += this.speed * Math.cos(angle)
        this.y += this.speed * Math.sin(angle)

    }
}

let issous = []

async function initPics() {
    let images_file = await fetch(FILE_NAME)
    let file_data = await images_file.text()
    images_data = JSON.parse(file_data);

}


async function loadPics() {
    for (let i = 0; i < images_data.length; i++) {
    // for (let i = 0; i < 100; i++) {
        await delay(50)
        var img = new Image(10, 10);
        img.src = './pics/' + images_data[i].name
        let issou = new Issou(img)
        issou.name = images_data[i].name
        issous.push(issou)
    }
}

function setCanvasSize(evt) {
    let imageData = ctx.getImageData(0, 0, canvas1.width, canvas1.height)
    canvas1.width = window.innerWidth
    canvas1.height = window.innerHeight
    ctx.putImageData(imageData, 0, 0)
}

var update = function () {
    issous.forEach(el => {
        el.update()
        ctx.drawImage(el.sprite, el.x, el.y, el.sprite.width , el.sprite.height);
    })
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

async function init() {
    createCanvas()
    setCanvasSize(canvas1)
    canvas1.onmousemove = getMousePos
    canvas1.ontouchmove = getMouvePos
    await initPics()
    loadPics()
    update()
    window.addEventListener('resize', setCanvasSize.bind(canvas1));
}


init()
