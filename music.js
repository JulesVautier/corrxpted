var myAudio = document.getElementById("myAudio");
var playing = false

musicButton = document.getElementById("musicButton")
function play() {
    console.log(playing)
    if (!playing)
        myAudio.play()
    else
        myAudio.pause()
    playing = !playing
}