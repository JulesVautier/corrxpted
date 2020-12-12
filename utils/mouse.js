var mouse = {
    x: 0,
    y: 0,
    down: false
}


function getMousePos(evt) {
    mouse.x = evt.clientX
    mouse.y = evt.clientY
}


function getMouvePos(touchEvent) {
    touchEvent.preventDefault()
    var rect = touchEvent.target.getBoundingClientRect();
    var touch = touchEvent.touches[0];
    mouse.y = touch.pageY - rect.top
    mouse.x = touch.pageX - rect.left
}
