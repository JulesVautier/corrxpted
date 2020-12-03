module = new CorruptionModule()
module.init('canvas-container')
console.log(window.innerHeight, window.innerWidth)
if (window.innerWidth > window.innerHeight)
    module.start(window.innerWidth / 4, window.innerHeight / 2)
else
    module.start(window.innerWidth / 2, window.innerHeight / 2)

window.onload = function () {
    let limit = 1
    let speed = 8
    console.log(limit)
    for (let i = 0; i < limit; i++) {
        module.playOneFrame()
    }
    for (let i = 0; i < speed; i++) {
        module.update()
    }
    console.log('finished')
}
module.update()