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

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 45, 300000);
    camera.position.set(-90, 0, -90);
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    let controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.addEventListener('change', renderer);
    createSkybox(scene, 'polluted_earth/polluted_earth', 1000)
    createSkybox(scene, 'exosystem/exosystem', 50000)

    animate();
}


function animate() {
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

init();