module = new CorruptionModule()
module.init('canvas-container')

module.clearBackground = function () {
    setInterval(function () {
        console.log('clearBackgroud', corruptionCTX)
        corruptionCTX.fillStyle = `rgba(0, 0, 0, 0.5)`
        corruptionCTX.fillRect(0, 0, corruptionCTX.width, corruptionCTX.height)
    }, 100)
}

setTimeout(module.clearBackground, 2000)
setTimeout(module.start, 5000)