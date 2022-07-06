import * as THREE from './three.module.js';
import { deg2rad } from './core/MathHelper.js';
import SceneTree from './core/SceneTree.js';
import { EffectComposer } from './postprocessing/EffectComposer.js';
import { RenderPass } from './postprocessing/RenderPass.js';
import { UnrealBloomPass } from './postprocessing/UnrealBloomPass.js';
import { ShaderPass } from './postprocessing/ShaderPass.js';
import { screenDistortion } from './shaders/ScreenDistortion.js';
import DemoCamera from './DemoCamera.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// const demoCamera = new DemoCamera();
// scene.add(demoCamera);

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: document.querySelector('#c')
  });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
// Setup rendering passes
const renderPass = new RenderPass(scene, camera);

const loader = new THREE.TextureLoader();
const noise1 = loader.load('./assets/Textures/Noise/Noise_basecolor.png');
noise1.wrapS = THREE.RepeatWrapping;
noise1.wrapT = THREE.RepeatWrapping;

screenDistortion.uniforms.noise1.value = noise1;

const distortionPass = new ShaderPass(screenDistortion);
const bloomPass = new UnrealBloomPass(0, 0.6, 0.3, 0.9);

const composer = new EffectComposer(renderer);
composer.addPass(renderPass);
composer.addPass(distortionPass);
composer.addPass(bloomPass);


// The SceneTree is a singleton that manages all the entities in the scene.
SceneTree.scene = scene;
SceneTree.camera = camera;
SceneTree.renderer = renderer;
SceneTree.initScene();

camera.rotateX(deg2rad(5));
camera.position.z = 15;
camera.position.y = 3;
camera.position.x = -9;

const clock = new THREE.Clock();

const setCamera = (c) => {
    renderPass.camera = c;
    SceneTree.camera = c;
    clock.start();
}
// setCamera(demoCamera.camera);

/**
 * Main Loop function calls update on all Entities every frame.
 */
function mainLoop() {
    requestAnimationFrame(mainLoop);

    const delta = clock.getDelta();
    SceneTree.update(delta);

    distortionPass.uniforms.time.value += 0.002;

    composer.render();
}

function onWindowResize() {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    // camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    // demoCamera.camera.aspect = window.innerWidth / window.innerHeight;
    // demoCamera.camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize);

document.addEventListener('keydown', e => {
    setCamera(camera);
});

document.addEventListener('click', e => {
    setCamera(camera);
});

// Call the first mainLoop after everything has finished loading
THREE.DefaultLoadingManager.onLoad = () => {
    mainLoop();
}
