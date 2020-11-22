var canvas1 = document.getElementById('canvas1'),
    ctx = canvas1.getContext('2d')
;

class Corumption {
    constructor(x, y, color, size) {
        this.x = x
        this.y = y
        this.color = color
        this.size = size
        this.exist()
    }

    exist() {
        ctx.fillStyle = "rgba(255,0,0)";
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fill();
        console.log(this.x, this.y)
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
    corruptions.push(new Corumption(pos.x, pos.y, "#ffffff", 10))
}

function init() {
    setCanvasSize(canvas1)
    canvas1.onclick = createCorruption;
}

init()