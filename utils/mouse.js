var mouse = {
    x: 0,
    y: 0,
}


function getMousePos(evt) {
    console.log(evt)
    mouse.x = evt.clientX
    mouse.y = evt.clientY
}
