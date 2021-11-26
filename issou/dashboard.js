
let images_data = []
let FILE_NAME = "img_colors.json"


async function initPics() {
    let images_file = await fetch(FILE_NAME)
    let file_data = await images_file.text()
    images_data = JSON.parse(file_data);
}

async function init() {
    await initPics()
    var div = document.getElementById("dashboard");
    for (let i = 0; i < images_data.length; i++) {
    // for (let i = 0; i < 10; i++) {
        let li = document.createElement('li')
        li.style.display = "inline-block";
        div.appendChild(li)
        let img = document.createElement('img');
        img.src = './pics/' + images_data[i].name;
        img.height = 50
        img.width = 50
        li.appendChild(img);
        let square = document.createElement('div')
        square.style.backgroundColor = rgb(images_data[i].color)
        square.style.width = "100px"
        square.style.height = "100px"
        square.style.align = "right"
        li.appendChild(square)
    }

}

init()
