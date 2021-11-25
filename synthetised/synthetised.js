particleSize = 7
particlesSpawnTime = 100

window.mobileCheck = function() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};
if (window.mobileCheck() === true) {
    particleSize = 12
    particlesSpawnTime = 300
}
console.log(particleSize)

class Particle {
    constructor(x, y, imgData, size, enable) {
        this.initialx = x
        this.initialy = y

        this.density = Math.random() * 20 + 30

        this.size = size
        this.setInitialPos()
        this.imageData = imgData
        this.enable = enable

    }

    setInitialPos() {
        this.x = randomInt(0, synthetisedCanvas1.width)
        this.y = randomInt(0, synthetisedCanvas1.height)
    }

    draw() {
        if (this.x && this.y)
            synthetisedCTX.putImageData(this.imageData, this.x, this.y)
    }

    update() {
        let dx = this.initialx - this.x
        let dy = this.initialy - this.y
        let distance = Math.sqrt(dx * dx + dy * dy)
        if ((distance > 0 && distance < 10) || (distance < 0 && distance > -10)) {
            this.x = this.initialx
            this.y = this.initialy
        } else {
            let forceDirectionX = dx
            let forceDirectionY = dy
            let force = 1 / 300
            let directionX = forceDirectionX * force * this.density
            let directionY = forceDirectionY * force * this.density
            this.x += directionX
            this.y += directionY
            this.x = Math.round(this.x)
            this.y = Math.round(this.y)
        }

        if (this.x === this.initialx && this.y === this.initialy) {
            enableParticles.splice(enableParticles.indexOf(this), 1);
        }
    }
}


function getPixel(imageData, x, y) {
    let index = imageData.width * y * 4 + (x * 4)
    if (index >= imageData.data.length - 4)
        return [0, 0, 0, 0]
    let pixel1 = imageData.data[index]
    let pixel2 = imageData.data[index + 1]
    let pixel3 = imageData.data[index + 2]
    let pixel4 = imageData.data[index + 3]
    return [pixel1, pixel2, pixel3, pixel4]
}

function getPixels(imageData, x, y, size) {
    let pixels = []
    for (let j = 0; j < size; j++) {
        for (let i = 0; i < size; i++) {
            pixels.push(...getPixel(imageData, x + i, y + j))
        }
    }
    return pixels
}

function convertImagesToParticles(ctx, width, height) {
    let squareSize = 100
    for (let y = 0; y < height; y += squareSize) {
        for (let x = 0; x < width; x += squareSize) {
            for (let squareY = y; squareY < height && squareY < y + squareSize; squareY += particleSize) {
                for (let squareX = x; squareX < width && squareX < x + squareSize; squareX += particleSize) {
                    particles.push(new Particle(squareX, squareY, ctx.getImageData(squareX, squareY, particleSize, particleSize), 1, false))
                }
            }
        }
    }
}

var update = function () {
    for (let i = 0; i < enableParticles.length; i++) {
        enableParticles[i].draw();
        enableParticles[i].update();
    }
    requestAnimationFrame(update);
}

function createParticlesOnMousePos() {
    let nbParticulesOnClick = 1000
    for (let i = 0; i < particles.length && i < nbParticulesOnClick; i++) {
        particles[i].enable = true
        particles[i].x = mouse.x
        particles[i].y = mouse.y
        enableParticles.push(particles[i])
    }
    particles = particles.slice(nbParticulesOnClick)
}

function imgToCtx(src) {
    drawing = new Image()
    drawing.src = src
    return new Promise(resolve => {
        drawing.onload = function () {
            let data = synthetisedCTX.getImageData(0, 0, synthetisedCanvas1.width, synthetisedCanvas1.height)
            scaleToFit(synthetisedCTX, drawing)
            convertImagesToParticles(synthetisedCTX, synthetisedCanvas1.width, synthetisedCanvas1.height)
            synthetisedCTX.putImageData(data, 0, 0)
            resolve()
        }
    })
}

function scaleToFit(ctx, img) {
    var scale = Math.max(synthetisedCanvas1.width / img.width, synthetisedCanvas1.height / img.height);
    var x = (synthetisedCanvas1.width / 2) - (img.width / 2) * scale;
    var y = (synthetisedCanvas1.height / 2) - (img.height / 2) * scale;
    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
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
var enableParticles = []

var topCanvas = undefined

function createCanvas() {
    let canvasContainer = document.getElementById('canvas-container')

    synthetisedCanvas1 = document.createElement("CANVAS");
    canvasContainer.appendChild(synthetisedCanvas1)
    synthetisedCTX = synthetisedCanvas1.getContext('2d')
    setCanvasSize(synthetisedCanvas1)

    topCanvas = synthetisedCanvas1
}

async function loadImages() {
    const images = [
        "lake.jpg",
        "deadhorse.jpg",
        "roma.jpg",
        "trafalgar.jpg",
        "vercingetorix.jpg",
        "jesus.jpg",
        "battle.jpg",
        "pandemonium.jpg",
    ]
    const loading = document.getElementById("loading")
    for (let i = 0; i < images.length; i++) {
        loading.innerText =  "Data L0ading\nPls W4iT\n" + (i+1).toString() + "/" + images.length.toString()
        await imgToCtx("./pics/" + images[i])
    }
    loading.innerText = "- clic to synthetise human history -"
    setTimeout(function () {
        loading.style.display = "none"
    }, 2000)
}

async function init() {
    createCanvas()
    topCanvas.onclick = createParticlesOnMousePos
    topCanvas.onmousemove = getMousePos
    topCanvas.ontouchmove = getMouvePos
    topCanvas.onmousedown = function () {mouse.down = true}
    topCanvas.onmouseup = function () {mouse.down = false}
    topCanvas.ontouchstart = function () {mouse.down = true}
    topCanvas.ontouchend = function () {mouse.down = false}
    await loadImages()
    setInterval(function () {
        if (mouse.down) {
            createParticlesOnMousePos()
        }
        if (particles.length === 0) {
            showAchievement("achievement")
        }
    }, particlesSpawnTime)
    update()

}

document.getElementById('inp').onchange = async function (e) {
    particles = []
    enableParticles = []
    for (let i = 0; i < this.files.length; i++)
        await imgToCtx(URL.createObjectURL(this.files[i]));
};

init()

var audio_frame_enabled = false
let audio_iframe = '<iframe width="0" height="0" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/966226210&color=%23748c99&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"></iframe>\n'
function initAudio() {
    console.log('bonjour lea')
    if (audio_frame_enabled === false) {
        $('body').append(audio_iframe)
        audio_frame_enabled = true
    }
}
window.onclick = initAudio
