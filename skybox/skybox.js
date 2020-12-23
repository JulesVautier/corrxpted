let scene, camera, renderer;
var cameraCenter = new THREE.Vector3();
var mouse = new THREE.Vector2();


function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

// Modal stuff

function initModal() {
    var helpModal = document.getElementById("helpModal");
    var goalModal = document.getElementById("goalModal");
    var helpBtn = document.getElementById("helpBtn");

    helpBtn.onclick = function () {
        if (goalModal.style.display === "none" || !goalModal.style.display) {
            goalModal.style.display = "block";
            helpModal.style.display = "block";
        } else {
            goalModal.style.display = "none";
            helpModal.style.display = "none";
        }
    }

    document.getElementsByClassName("close")[0].onclick = function () {
        goalModal.style.display = "none";
    }
    document.getElementsByClassName("close")[1].onclick = function () {
        helpModal.style.display = "none";
    }
}

// initModal()

// Skybox stuff

function createSkybox(scene, fileName, extension, geometry, invert) {
    let materialArray = [];
    let extensions = ['_ft', '_bk', '_up', '_dn', '_rt', '_lf']
    for (let i = 0; i < 6; i++) {
        let texture = new THREE.TextureLoader().load(fileName + extensions[i] + extension)
        if (invert) {
            texture.wrapS = THREE.RepeatWrapping;
            texture.repeat.x = -1;
        }
        materialArray.push(new THREE.MeshBasicMaterial({map: texture}));
    }
    for (let i = 0; i < 6; i++) {
        materialArray[i].side = THREE.BackSide;
    }
    let skyboxGeo = new THREE.BoxGeometry(geometry, geometry, geometry);
    let skybox = new THREE.Mesh(skyboxGeo, materialArray);
    scene.add(skybox);
    return skybox
}

function createText(scene, text) {
    var canvas1 = document.createElement('canvas');
    canvas1.width = 600
    // canvas1.height = 1000
    var context1 = canvas1.getContext('2d');
    context1.font = "Bold 30px Ubuntu";
    context1.fillStyle = "rgb(134,102,21)";
    context1.fillText(text, 0, 40);

    var texture1 = new THREE.Texture(canvas1)
    texture1.needsUpdate = true;

    var material1 = new THREE.MeshBasicMaterial({map: texture1, side: THREE.DoubleSide});
    material1.transparent = true;

    var mesh1 = new THREE.Mesh(
        new THREE.PlaneGeometry(canvas1.width, canvas1.height),
        material1
    );
    mesh1.position.set(0, 0, 200);
    scene.add(mesh1);


    setInterval(function () {
        context1.clearRect(0, 0, canvas1.width, canvas1.height)
        writeText("Try to think outside the box", context1, "rgb(134,102,21)")
        texture1.needsUpdate = true
    }, 10000)
}


function writeText(initialText, ctx, color) {
    // let fonts = ["Times New Roman", "Ubuntu", "Arial", "Times", "Courier New", "Verdana", "Georgia", "Palantino", "Garamond", "Ani", "aakar", "FreeMono", "DialogInput", "DejaVu Sans", "Doird Sans"]
    let fonts = ["Ubuntu"]
    let font = fonts[randomInt(0, fonts.length)]
    let px = randomInt(20, 40).toString() + "px"
    ctx.clearRect(0, 0, ctx.width, ctx.height)
    ctx.font = `Bold ${px} ${font}`
    ctx.fillStyle = color;
    ctx.fillText(initialText, 0, 40);
    ctx.needsUpdate = true
}
showAchievement("achievement")


function isInCube(mesh) {
    if (camera.position.distanceTo(mesh.position) > mesh.geometry.parameters.height) {
        showAchievement("achievement")
        $('#wind-audio').remove()
        if (space_frame_enabled === false) {
            $('body').append(space_iframe)
            space_frame_enabled = true
        }

    }
}

function init() {
    initModal()
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 45, 300000);
    camera.position.set(0, 0, -100);
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    let controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.maxDistance = 40000

    controls.addEventListener('change', renderer);
    let firstSkybox = createSkybox(scene, 'polluted_earth/polluted_earth', ".jpg", 4000, false)
    setInterval(isInCube.bind(this, firstSkybox), 500)
    createSkybox(scene, 'ulukai/corona', '.png', 300000, false)
    createText(scene, "Try to think outside the BOX")
    animate();
}


function animate() {
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
let wind_iframe = '<iframe id="wind-audio" width="100" height="100" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/565354701&color=%23ff5500&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true""></iframe>'
let space_iframe = '<iframe id="space-audio" width="100" height="100" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/137573089&color=%230b111c&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"></iframe>'

var wind_frame_enabled = false
var space_frame_enabled = false

function initAudio() {
    if (wind_frame_enabled === false) {
        $('body').append(wind_iframe)
        wind_frame_enabled = true
    }
}

document.onload = init()
window.onclick = initAudio
$('body').append(wind_iframe)
