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


function randomInt(min, max) {
    return Math.round(Math.random() * (max - min) + min);
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
    if (!selectedText || !selectedText.tab || selectedText.tab.length === 0)
        return ' '
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
    if (!selectedText) {
        return
    }
    this.value = getChar(this.x, this.y)
    this.speed = fontSize

    let distanceDone = (this.y - this.initialy) / fontSize

    ctx2.font = fontSize + "px san-serif";
    ctx.font = fontSize + "px san-serif";

    ctx2.fillStyle = selectedText.color
    ctx2.fillText(this.value, this.x, this.y);

    ctx.fillStyle = "#ececec";
    ctx.fillText(this.value, this.x, this.y);

    this.y += this.speed;
    if (distanceDone > this.maxLenght) {
        this.suicide()
    }
    if (this.y > canvas1.height) {
        this.suicide()
    }
}


function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
        y: (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
    };
}

function findScreenCoords(mouseEvent) {
    mouseEvent.preventDefault()
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
    color = undefined

    constructor(name, color) {
        this.tab = []
        this.name = name
        this.color = color
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
        for (let lineIndex = 0; lineIndex < this.tab.length; lineIndex++) {
            let line = this.tab[lineIndex]
            let overSpaces = 0
            let begginSpaces = 0
            for (begginSpaces; begginSpaces < line.length && line[begginSpaces] === ' '; begginSpaces++) {
            }
            let endSpaces = line.length - 1
            for (endSpaces; endSpaces >= 0 && line[endSpaces] === ' '; endSpaces--) {
            }
            endSpaces = line.length - endSpaces
            if (begginSpaces > endSpaces) {
                overSpaces = Math.floor(begginSpaces - endSpaces) / 2
                line = line.slice(overSpaces, line.length)
                while (overSpaces-- >= 0)
                    line += ' '
            } else if (begginSpaces < endSpaces) {
                overSpaces = Math.floor(endSpaces - begginSpaces) / 2
                line = line.slice(0, line.length - overSpaces)
                while (overSpaces-- >= 0)
                    line = ' ' + line
            }
            this.tab[lineIndex] = line
        }
    }
}


function fadeAway(repeats) {
    ctx2.fillStyle = "rgba(0,0,0,0.05)";
    ctx2.fillRect(0, 0, canvas2.width, canvas2.height);
    repeats += 1
    if (repeats < 50) {
        requestAnimationFrame(function () {
            fadeAway(repeats)
        })
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

async function initTexts() {
    textNames = ['summary.txt', "chapter-1.txt", "chapter-2.txt", "chapter-3.txt", "chapter-4.txt"]
    textColors = ["#9202FF", "#6600ff", "#6600cc", "#3333cc", "#3333ff"]
    for (let i = 0; i < textNames.length; i++) {
        let name = textNames[i]
        let color = textColors[i]
        texts.push(new Text('./' + name, color))
    }
    for (const text of texts) {
        await text.getText()
    }
    setCanvasHeight(canvas1)
    setCanvasHeight(canvas2)
    chooseText()
}

function chooseText() {
    if (chooseText.counter === undefined)
        chooseText.counter = 0
    selectedText = texts[chooseText.counter % texts.length]
    if (chooseText.counter > 0)
        fadeAway(10)
    chooseText.counter++
}

function setCanvasHeight(canvas) {
    let maxLenght = Math.max(0, ...texts.map(s => s.tab.length));
    canvas.height = fontSize * maxLenght + 400
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
    canvas2.onmousemove = findScreenCoords;
    canvas2.ontouchmove = findScreenCoords;
    update();
    window.addEventListener('resize', init);
    setInterval(chooseText, 30000)
}

init()
