
var renderer;
var scene;
var camera;
var cameraControl;

var depth = 200;
var width = 200;
var margin = 10;
var MAX_HEIGHT = 10;
var groundMesh;
var sizeSelector = 15;
var looking = new THREE.Vector3( (depth*margin)/2, 0, (depth*margin)/2 );

var maxDuration = 4; //secondes
var vitesse = (depth*margin)/maxDuration;
var maxAmplitude = 10;
var longOnde = 15;
var duration = 2000;
var diameter = 3;
var frequence = 50;
var waves = [];
var mouseState = false;

var state = false;


function initThree(){
    console.log(Date.now())

    //// INIT
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 5000);

    ////RENDERER
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0x000000, 1.0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMapEnabled = true;

    // position and point the camera to the center of the scene
    camera.position.x = 500;
    camera.position.y = 40;
    camera.position.z = 1000;
    camera.lookAt( scene.position );

    // add spotlight for the shadows
    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(10, 20, 20);
    spotLight.shadowCameraNear = 20;
    spotLight.shadowCameraFar = 50;
    spotLight.castShadow = true;
    scene.add(spotLight);

    scene.add(new THREE.AmbientLight(0xffffff));


    var cubeGeometry = new THREE.BoxGeometry(1000, 1000, 1000, 20, 20, 20);
    // var cubeGeometry = new THREE.SphereGeometry(500, 100, 100);
    var cubeMaterial = new THREE.MeshLambertMaterial({color: 'white', wireframe : true});
    groundMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
    scene.add(groundMesh);
    console.log(groundMesh.position);

    document.body.appendChild(renderer.domElement);

    ////EXTRA
    // cameraControl = new THREE.OrbitControls(camera);

    control = new function(){
        this.camX = 1500;
        this.camY = 1500;
        this.camZ = 1500;
    };
    addControlGui(control);
    addStatsObject();

    render();

    console.log("Initialazing!");

    window.addEventListener('mousedown', function(){ mouseState = true }, false);
    window.addEventListener('mouseup', function(){ mouseState = false }, false);
    window.addEventListener('mousemove', createWave, false);
    window.addEventListener('resize', handleResize, false);

}


function render() {
    camera.position.x = control.camX;
    camera.position.y = control.camY;
    camera.position.z = control.camZ;
    camera.lookAt( scene.position );

        for(var i=0; i < waves.length; i++)
        {
            waves[i].update();
            if(waves[i].currentTime > duration){
                waves[i] = null;
                waves.splice(i, 1);
            }
        }

    stats.update();
    renderer.render(scene, camera);

    requestAnimationFrame(render);
}

function createWave(event){
    if(mouseState){
        var center = getPosition(event, groundMesh)
        if (typeof center != "undefined")
            waves.push(new Wave(center, groundMesh, vitesse, maxAmplitude, longOnde, diameter, duration, frequence));
    }
}

function addControlGui(controlObject) {
    var gui = new dat.GUI();
    gui.add(controlObject, 'camX', -2000, 2000);
    gui.add(controlObject, 'camY', -2000, 2000);
    gui.add(controlObject, 'camZ', -2000, 2000);
}

function addStatsObject() {
    stats = new Stats();
    stats.setMode(0);

    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';

    document.body.appendChild(stats.domElement);
}

function handleResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.onload = initThree;