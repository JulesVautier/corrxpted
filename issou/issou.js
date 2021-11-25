
function setCanvasSize(evt) {
    let imageData = ctx.getImageData(0, 0, canvas1.width, canvas1.height)
    canvas1.width = window.innerWidth
    canvas1.height = window.innerHeight
    ctx.putImageData(imageData, 0, 0)
}

var update = function () {
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
    canvas1.onmousemove = getMousePos
    canvas1.ontouchmove = getMouvePos
    update()
    window.addEventListener('resize', setCanvasSize.bind(canvas1));
}

var settings = {
    background: '#000000',
    color: '#ffffff',
};

init()
