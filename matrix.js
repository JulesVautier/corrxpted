var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    canvas2 = document.getElementById('canvas2'),
    ctx2 = canvas2.getContext('2d'),
    // full screen dimensions
    cw = window.innerWidth,
    ch = window.innerHeight,
    fallingCharArr = [],
    fontSize = 10,
    maxColums = Math.floor(cw / (fontSize)),
    lastx = 0,
    lasty = 0
;
canvas.width = canvas2.width = cw;
canvas.height = canvas2.height = ch;

var txt = []
fetch('text.txt')
    .then(response => response.text()).then(text => txt = createTabFromText(text))

function createTabFromText(initial_text) {
    var tab = []
    var line = 0
    var char_count = 0
    for (let i = 0; i < initial_text.length; i++) {
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
        }
        else if (char_count % maxColums === 0 && char_count !== 0) {
            tab.push("")
            line = line + 1
            char_count = 0
        } else {
            tab[line] += char
            char_count += 1
        }
    }
    var last_line_len = tab[tab.length -1].length
    for (let i = last_line_len; i < maxColums; i++)
        tab[tab.length -1] += ' '
    return tab
}

function Point(x, y) {
    this.x = x;
    this.y = y;
}

Point.prototype.die = function () {
    fallingCharArr.splice(fallingCharArr.indexOf(this), 1);
}

function getChar(x, y) {
    x = Math.floor(x / fontSize)
    y = Math.floor(y / fontSize)
    if (y >= txt.length)
        return ''
    if (x >= maxColums)
        return ''
    return txt[y].charAt(x).toUpperCase();
}

Point.prototype.draw = function (ctx) {
    this.value = getChar(this.x, this.y)
    this.speed = fontSize + 1

    ctx2.fillStyle = "rgb(146,2,255)";
    ctx2.font = fontSize + "px san-serif";
    ctx2.fillText(this.value, this.x, this.y);

    ctx.fillStyle = "#a032e0";
    ctx.font = fontSize + "px san-serif";
    ctx.fillText(this.value, this.x, this.y);

    this.y += this.speed;
    if (this.y > ch) {
        this.die()
    }
}

var update = function () {
    ctx.fillStyle = "rgba(0,0,0,0.05)";
    ctx.fillRect(0, 0, cw, ch);
    ctx2.clearRect(0, 0, cw, ch);
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
        fallingCharArr.push(new Point(pos.x * fontSize, pos.y * fontSize));
        if (Math.floor(pos.x) !== lastx) {
            lastx = Math.floor(pos.x)
        }
        if (Math.floor(pos.y) !== lasty) {
            lastx = Math.floor(pos.y)
        }
    }
}

canvas2.onmousemove = findScreenCoords;
update();
