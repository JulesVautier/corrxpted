module = new CorruptionModule()
module.init('canvas-container')
if (window.innerWidth > window.innerHeight)
    module.start(window.innerWidth / 4, window.innerHeight / 2)
else
    module.start(window.innerWidth / 2, window.innerHeight / 2)
setInterval(module.reset.bind(module), 20000)

window.onload = function () {
    let limit = 1
    let speed = 8
    for (let i = 0; i < limit; i++) {
        module.playOneFrame()
    }
    for (let i = 0; i < speed; i++) {
        module.update()
    }
}
module.update()

function openUrl(url) {
    if (window.event.ctrlKey) {
        window.open(url, '_blank')
    } else {
        location.href = url
    }
}

var repeater = false
var dotSpan = document.getElementById("dotSpan")
setInterval(function () {
    if (repeater === true && dotSpan.innerText.length < 40) {
        dotSpan.innerText += " ."
    } else if (dotSpan.innerText.length > "Dot: . . .".length) {
        dotSpan.innerText =dotSpan.innerText.slice(0, -2)
    }
}, 100)
