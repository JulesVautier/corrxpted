var myAudio = document.getElementById("myAudio");
var playing = false

musicButton = document.getElementById("musicButton")
function play() {
    if (!playing)
        myAudio.play()
    else
        myAudio.pause()
    playing = !playing
}

var words = ["words",  "down", "into", "deep",  "relaxing", "every", "you", "read", "your", "mind", "blank", "losing", "focus", "into", "falling", "deep", "unnecessary"]

function randomInt( min, max ) {
    return Math.floor(Math.random() * ( max - min ) + min);
}

function changeButtonInfos() {
    console.log("here")
    word = words[randomInt(0, words.length - 1)].split('').join(' ');
    musicButton.textContent = word
}
changeButtonInfos()
window.setInterval(changeButtonInfos,10)
