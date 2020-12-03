module = new CorruptionModule()
module.init('canvas-container')
module.start()

window.onload = function () {
    let limit = 3000
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