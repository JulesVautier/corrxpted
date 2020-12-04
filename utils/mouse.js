var mouse = {
    x: 0,
    y: 0,
}


function getMousePos(evt) {
    mouse.x = evt.clientX
    mouse.y = evt.clientY
}
