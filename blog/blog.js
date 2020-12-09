function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

function parseFollow(text) {
    const regex = /href=\"(.*)\"/g
    let res = [...text.matchAll(regex)]
    console.log(res)
}

function redirectToStrangeWebsite() {
    parseFollow(httpGet("follows"))
}

redirectToStrangeWebsite()
