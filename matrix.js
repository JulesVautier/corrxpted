var canvas = document.getElementById( 'canvas' ),
    ctx = canvas.getContext( '2d' ),
    canvas2 = document.getElementById( 'canvas2' ),
    ctx2 = canvas2.getContext( '2d' ),
    // full screen dimensions
    cw = window.innerWidth,
    ch = window.innerHeight,
    // charArr = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'],
    charArr = ['a'],
    maxCharCount = 100,
    fallingCharArr = [],
    fontSize = 10,
    maxColums = cw/(fontSize),
    lastx = 0,
    lasty =0
;
canvas.width = canvas2.width = cw;
canvas.height = canvas2.height = ch;


function randomInt( min, max ) {
    return Math.floor(Math.random() * ( max - min ) + min);
}

function randomFloat( min, max ) {
    return Math.random() * ( max - min ) + min;
}

function Point(x,y)
{
    this.x = x;
    this.y = y;
    console.log(x, y)
}

Point.prototype.die = function()
{
    fallingCharArr.splice(fallingCharArr.indexOf(this), 1);
}

function getChar() {
    var c = charArr[randomInt(0,charArr.length-1)].toUpperCase();
    return c
}

Point.prototype.draw = function(ctx){

    this.value = getChar()
    this.speed = fontSize


    ctx2.fillStyle = "rgba(255,255,255,0.8)";
    ctx2.font = fontSize+"px san-serif";
    ctx2.fillText(this.value,this.x,this.y);

    ctx.fillStyle = "#0F0";
    ctx.font = fontSize+"px san-serif";
    ctx.fillText(this.value,this.x,this.y);



    this.y += this.speed;
    if(this.y > ch)
    {
        this.die()
    }
}

// for(var i = 0; i < maxColums ; i++) {
//     fallingCharArr.push(new Point(i*fontSize,randomFloat(-500,0)));
// }


var update = function()
{

    ctx.fillStyle = "rgba(0,0,0,0.05)";
    ctx.fillRect(0,0,cw,ch);

    ctx2.clearRect(0,0,cw,ch);

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

function round_pos(pos) {
    pos = (pos / fontSize)
}

function findScreenCoords(mouseEvent)
{
    var pos = getMousePos(canvas2, mouseEvent)
    pos.y =  Math.floor((pos.y / fontSize))
    pos.x =  Math.floor((pos.x / fontSize))
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
