let scene, camera, renderer;
var mouse = new THREE.Vector2();
var cameraCenter = new THREE.Vector3();
var mouse = new THREE.Vector2();


function createSkybox(scene, fileName, geometry) {
    let materialArray = [];
    let extensions = ['_ft', '_bk', '_up', '_dn', '_rt', '_lf']
    for (let i = 0; i < 6; i++)
        materialArray.push(new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load(fileName + extensions[i] + '.jpg')}));
    for (let i = 0; i < 6; i++)
        materialArray[i].side = THREE.BackSide;
    let skyboxGeo = new THREE.BoxGeometry(geometry, geometry, geometry);
    let skybox = new THREE.Mesh(skyboxGeo, materialArray);
    scene.add(skybox);
}

function createText(scene, text) {
    var canvas1 = document.createElement('canvas');
    canvas1.width = 600
    // canvas1.height = 1000
    var context1 = canvas1.getContext('2d');
    context1.font = "Bold 30px Ubuntu";
    context1.fillStyle = "rgb(134,102,21)";
    context1.fillText('Try to think outside the BOX', 0, 40);

    var texture1 = new THREE.Texture(canvas1)
    texture1.needsUpdate = true;

    var material1 = new THREE.MeshBasicMaterial( {map: texture1, side:THREE.DoubleSide } );
    material1.transparent = true;

    var mesh1 = new THREE.Mesh(
        new THREE.PlaneGeometry(canvas1.width, canvas1.height),
        material1
    );
    mesh1.position.set(0,0,200);
    scene.add( mesh1 );
}

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 45, 300000);
    camera.position.set(0, 0, -10);
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    let controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.maxDistance = 25000

    controls.addEventListener('change', renderer);
    createSkybox(scene, 'polluted_earth/polluted_earth', 1000)
    // createSkybox(scene, 'exosystem/exosystem', 100000)
    createText(scene, "issouUUUUUUUUUUUU")
    animate();
}


function animate() {
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

init();