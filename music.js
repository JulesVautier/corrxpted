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
    return Math.round(Math.random() * ( max - min ) + min);
}

function changeButtonInfos() {
    let content = musicButton.textContent
    word = words[randomInt(0, words.length - 1)].split('').join(' ');
    if (randomInt(0, 10) > 9) {
        content = content.substring(0,content.length - randomInt(0, 6))
    }
    if (randomInt(0, 1) === 1) {
        content = content.concat(word, " ")
    }
    musicButton.textContent = content.concat("_")
}

changeButtonInfos()
window.setInterval(changeButtonInfos,50)
