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
var texts = []
var selectedText = undefined


function randomInt( min, max ) {
    return Math.round(Math.random() * ( max - min ) + min);
}



function Point(x, y, canvas) {
    this.maxLenght = randomInt(6, 40)
    this.canvas = canvas
    this.initialx = x;
    this.initialy = y;
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
    if (y >= selectedText.tab.length)
        return ''
    if (x >= maxColums)
        return ''
    return selectedText.tab[y].charAt(x).toUpperCase();
}

Point.prototype.draw = function (ctx) {
    this.value = getChar(this.x, this.y)
    this.speed = fontSize

    let distanceDone = (this.y - this.initialy) / fontSize

    ctx2.fillText(" ", this.x, this.y);

    ctx2.fillStyle = "rgb(146,2,255)";
    ctx2.font = fontSize + "px san-serif";
    ctx2.fillText(this.value, this.x, this.y);

    ctx.fillStyle = "#ececec";
    ctx.font = fontSize + "px san-serif";
    ctx.fillText(this.value, this.x, this.y);

    this.y += this.speed;
    if (distanceDone > this.maxLenght) {
        this.suicide()
    }
    if (this.y > canvas1.height) {
        this.suicide()
    }
}

var update = function () {
    ctx.fillStyle = "rgba(0,0,0,0.05)";
    ctx.fillRect(0, 0, canvas1.width, canvas1.height);
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



class Text {
    name = undefined;
    tab = [];

    constructor(name) {
        this.tab = []
        this.name = name
    };

    async getText() {
        let response = await fetch(this.name)
        let response_text = await response.text()
        this.createTabFromText(response_text)
        this.centerText()
    };

    createTabFromText(initial_text) {
        var line = 0
        var char_count = 0
        for (let i = 0; i < initial_text.length; i++) {
            let char = initial_text[i]
            if (this.tab.length === 0) {
                this.tab.push("")
            }
            if (char === '\n') {
                for (var x = this.tab[line].length; x < maxColums; x++) {
                    this.tab[line] += ' '
                    char_count += 1
                }
                this.tab.push("")
                line = line + 1
                char_count = 0
            } else if (char_count % maxColums === 0 && char_count !== 0) {
                this.tab.push("")
                line = line + 1
                char_count = 0
            } else {
                this.tab[line] += char
                char_count += 1
            }
        }
        var last_line_len = this.tab[this.tab.length - 1].length
        for (let i = last_line_len; i < maxColums; i++)
            this.tab[this.tab.length - 1] += ' '
    }

    centerText() {
        for(let lineIndex = 0; lineIndex < this.tab.length; lineIndex++) {
            let line = this.tab[lineIndex]
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
            this.tab[lineIndex] = line
        }
    }
}

async function initTexts() {
    textNames = ['summary.txt', "chapter-1.txt", "chapter-2.txt", "chapter-3.txt", "chapter-4.txt"]
    textNames = ['summary.txt', "chapter-1.txt"]
    textNames.forEach(name => {
        texts.push(new Text('./matrix/' + name))
    })
    for (const text of texts) {
        await text.getText()
    }
    chooseText()
}

function chooseText() {
    if (chooseText.counter === undefined)
        chooseText.counter = 0
    selectedText = texts[chooseText.counter % texts.length]
    setCanvasHeight(canvas1)
    setCanvasHeight(canvas2)
    chooseText.counter++
}

function setCanvasHeight(canvas) {
    canvas.height = fontSize * selectedText.tab.length + 400
}

function setCanvasWidth(canvas) {
    var parent = document.getElementById("canvas-container")

    let style = document.defaultView.getComputedStyle(canvas)
    let left = parseInt(style.left.slice(0, -2))

    canvas.width = parent.offsetWidth - left * 2
    maxColums = Math.floor(canvas.width / (fontSize))
}

function init() {
    initTexts()
    setCanvasWidth(canvas1)
    setCanvasWidth(canvas2)
}

init()
canvas2.onmousemove = findScreenCoords;
update();
window.addEventListener('resize', init);
// setInterval(chooseText, 1000)