module = new CorruptionModule()
module.init('canvas-container')
module.start()

window.onload = function () {
    let limit = randomInt(100, 4000)
    console.log(limit)
    for (let i = 0; i < limit; i++) {
        module.playOneFrame()
        if (i % 100 === 0)
            module.update()
    }
    console.log('finished')
}
module.update()