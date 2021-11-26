function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function randomFloat(min, max) {
    return Math.random() * (max - min) + min;
}


function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function colorToInt(color) {
    return parseInt(color.slice(1, color.length), 16)
}

function intToColor(color) {
    return newColor = '#' + color.toString(16)
}

function getRGB(colorString) {
    let rgb = [colorString.slice(1, 3), colorString.slice(3, 5), colorString.slice(5, 7)]
    for (let i = 0; i < 3; i++) {
        rgb[i] = parseInt(rgb[i], 16)
    }
    rgb.push(255)
    return rgb
}

function arrayToRGB(colorArray) {
    return `#${colorArray[0].toString(16).padStart(2, '0')}${colorArray[1].toString(16).padStart(2, '0')}${colorArray[2].toString(16).padStart(2, '0')}`
}

const delay = millis => new Promise((resolve, reject) => {
   setTimeout(_ => resolve(), millis)
});
