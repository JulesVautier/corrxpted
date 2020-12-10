function httpGet(theUrl, onLoadCallback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl, true); // false for synchronous request
    xmlHttp.onloadend = onLoadCallback.bind(xmlHttp)
    xmlHttp.send(null);
}

function parseFollow(text) {
    const regex = /href=\"(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*))\"/g
    let res = [...text.matchAll(regex)]
    res.splice(res.length - 4, 4)
    return res.map(e => e[1])
}

var followedSites = undefined
function initFollowedSites() {
    httpGet("./follows.txt", function () {
        followedSites = parseFollow(this.responseText)
    })
}

function redirectToStrangeWebsite() {
    let site = followedSites[randomInt(0, followedSites.length - 1)]
    window.open(site, "_blank")
}

var modal = document.getElementById("myModal");
function displayImgModal(img) {
    let imgModal = modal.firstElementChild.firstElementChild
    imgModal.src = img.src || img
    modal.style.display = "block";
}
function closeModal() {
    modal.style.display = "none";
}
window.onclick = function(event) {
    if (event.target === modal || event.target.id === "modal-img") {
        closeModal()
    }
}

function initAppear() {
    let el = document.getElementsByClassName("appear");
    for (let i = 0; i < el.length; i++){
        el[i].addEventListener("mouseover", function(e){
            el[i].classList.remove('censored')
        });
    }
}

function initHoverModal() {
    let el = document.getElementsByClassName("hoverModal");
    for (let i = 0; i < el.length; i++){
        el[i].addEventListener("mouseover", function(e){
            el[i].classList.remove('censored')
        });
    }
}

initFollowedSites()
initAppear()
initHoverModal()