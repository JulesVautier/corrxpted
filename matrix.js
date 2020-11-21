var canvas1 = document.getElementById('canvas1'),
    ctx = canvas1.getContext('2d'),
    canvas2 = document.getElementById('canvas2'),
    ctx2 = canvas2.getContext('2d'),
    // full screen dimensions
    fallingCharArr = [],
    fontSize = 10,
    maxColums,
    lastx = 0,
    lasty = 0
;
var cw = 0, ch = 0;
var txt = []

function createTabFromText(initial_text) {
    var tab = []
    var line = 0
    var char_count = 0
    for (let i = 0; i < initial_text.length; i++) {
        // console.log(char_count % maxColums, char_count)
        char = initial_text[i]
        if (tab.length === 0) {
            tab.push("")
        }
        if (char === '\n') {
            for (var x = tab[line].length; x < maxColums; x++) {
                tab[line] += ' '
                char_count += 1
            }
            tab.push("")
            line = line + 1
            char_count = 0
        } else if (char_count % maxColums === 0 && char_count !== 0) {
            tab.push("")
            line = line + 1
            char_count = 0
        } else {
            tab[line] += char
            char_count += 1
        }
    }
    var last_line_len = tab[tab.length - 1].length
    for (let i = last_line_len; i < maxColums; i++)
        tab[tab.length - 1] += ' '
    return centerText(tab)
}

function centerText(tab) {
    for(let lineIndex = 0; lineIndex < tab.length; lineIndex++) {
        line = tab[lineIndex]
        let overSpaces = 0
        let begginSpaces = 0
        for (begginSpaces; begginSpaces < line.length && line[begginSpaces] === ' '; begginSpaces ++) {}
        let endSpaces = line.length - 1
        for (endSpaces; endSpaces >= 0 && line[endSpaces] === ' '; endSpaces--) {}
        endSpaces = line.length - endSpaces
        if (begginSpaces > endSpaces) {
            overSpaces = Math.floor(begginSpaces - endSpaces) / 2
            line = line.slice(overSpaces, line.length)
            while (overSpaces-- >= 0)
                line += ' '
        }
        else if (begginSpaces < endSpaces) {
            overSpaces = Math.floor(endSpaces - begginSpaces) / 2
            line = line.slice(0, line.length - overSpaces)
            while (overSpaces-- >= 0)
                line = ' ' + line
        }
        tab[lineIndex] = line
    }
    return tab
}

function Point(x, y, canvas) {
    this.canvas = canvas
    this.x = x;
    this.y = y;
}

Point.prototype.suicide = function () {
    fallingCharArr.splice(fallingCharArr.indexOf(this), 1);
}

function getChar(x, y) {
    if (y < 0)
        y = 0
    if (x < 0)
        x = 0
    x = Math.round(x / fontSize)
    y = Math.round(y / fontSize)
    if (y >= txt.length)
        return ''
    if (x >= maxColums)
        return ''
    return txt[y].charAt(x).toUpperCase();
}

Point.prototype.draw = function (ctx) {
    this.value = getChar(this.x, this.y)
    this.speed = fontSize

    ctx2.fillStyle = "rgb(146,2,255)";
    ctx2.font = fontSize + "px san-serif";
    ctx2.fillText(this.value, this.x, this.y);

    ctx.fillStyle = "#a032e0";
    ctx.font = fontSize + "px san-serif";
    ctx.fillText(this.value, this.x, this.y);

    this.y += this.speed;
    console.log(canvas1.height)
    if (this.y > canvas1.height) {
        this.suicide()
    }
}

var update = function () {
    ctx.fillStyle = "rgba(0,0,0,0.05)";
    ctx.fillRect(0, 0, cw, ch);
    var i = fallingCharArr.length;
    while (i--) {
        fallingCharArr[i].draw(ctx);
        var v = fallingCharArr[i];
    }
    requestAnimationFrame(update);
}


function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
        y: (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
    };
}

function findScreenCoords(mouseEvent) {
    var pos = getMousePos(canvas2, mouseEvent)
    pos.y = Math.floor((pos.y / fontSize))
    pos.x = Math.floor((pos.x / fontSize))
    if (Math.floor(pos.x) !== lastx || Math.floor(pos.y) !== lasty) {
        fallingCharArr.push(new Point(pos.x * fontSize, pos.y * fontSize, canvas1));
        if (Math.floor(pos.x) !== lastx) {
            lastx = Math.floor(pos.x)
        }
        if (Math.floor(pos.y) !== lasty) {
            lastx = Math.floor(pos.y)
        }
    }
}


function initCanvasSize(canvas) {
    let style = document.defaultView.getComputedStyle(canvas)
    let left = parseInt(style.left.slice(0, -2))

    canvas.width = cw - left * 2
    maxColums = Math.floor(canvas.width / (fontSize))
}

function init() {
    var parent = document.getElementById("canvas-container")
    cw = parent.offsetWidth
    ch = parent.offsetHeight

    initCanvasSize(canvas1)
    initCanvasSize(canvas2)

    fetch('text.txt')
        .then(response => response.text()).then(text => {
            txt = createTabFromText(text)
            canvas1.height = fontSize * txt.length + 400
            canvas2.height = fontSize * txt.length + 400
    })
}

init()
canvas2.onmousemove = findScreenCoords;
update();
window.addEventListener('resize', init);