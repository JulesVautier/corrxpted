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

httpGet("follows", function () {
    followedSites = parseFollow(this.responseText)
})

function redirectToStrangeWebsite() {
    let site = followedSites[randomInt(0, followedSites.length - 1)]
    window.open(site, "_blank")
}

