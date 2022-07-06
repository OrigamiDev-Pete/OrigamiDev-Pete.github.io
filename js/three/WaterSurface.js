import * as THREE from 'three';
import Entity from './core/Entity.js';
import { deg2rad } from './core/MathHelper.js';
import SceneTree from './core/SceneTree.js';
import { waterSurfaceShader } from './shaders/WaterSurfaceShader.js';

export default class WaterSurface extends Entity {

    uniforms = {
        noise1: { value: null },
        noise2: { value: null },
        noise3: { value: null },
        foam_scale: { value: 1.0 },
        foam_amount: { value: 0.05 },
        time: { value: 0.0 },
        scroll_speed: { value: 0.2 },
        wave_height: { value: 2.0 },
        intensity: { value: 2.0 },
        refraction: { value: 1.0 },
        refraction_scale: { value: 2.0 },
        refraction_detail: { value: 0.1 },
        framebuffer: { value: null }
    }

    renderBuffer;
    renderScene;

    constructor() {
        super();
        SceneTree.registerEntity(this);

        this.uniforms = THREE.UniformsUtils.merge([
            THREE.UniformsLib['fog'],
            this.uniforms,
        ]);

        // Setup framebuffer
        this.renderScene = new THREE.Scene();
        this.renderBuffer = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {});


        const loader = new THREE.TextureLoader();
        const noise1 = loader.load('./assets/Textures/Noise/Noise_basecolor.png');
        noise1.wrapS = THREE.RepeatWrapping;
        noise1.wrapT = THREE.RepeatWrapping;
        const noise2 = loader.load('./assets/Textures/Noise/Noise_basecolor2.png')
        noise2.wrapS = THREE.RepeatWrapping;
        noise2.wrapT = THREE.RepeatWrapping;
        const noise3 = loader.load('./assets/Textures/Noise/Noise_basecolor3.png')
        noise2.wrapS = THREE.RepeatWrapping;
        noise2.wrapT = THREE.RepeatWrapping;

        this.uniforms.noise1.value = noise1;
        this.uniforms.noise2.value = noise2;
        this.uniforms.noise3.value = noise3;

        const surfaceShader = waterSurfaceShader;

        const surfaceShaderMaterial = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            fragmentShader: surfaceShader.fragmentShader,
            vertexShader: surfaceShader.vertexShader,
            fog: true,
            transparent: true,
        });


        const surfaceGeo = new THREE.PlaneGeometry(200, 200, 200, 200);
        const surfaceMesh = new THREE.Mesh(surfaceGeo, surfaceShaderMaterial);

        surfaceMesh.rotateX(deg2rad(90));
        surfaceMesh.position.y += 10;

        this.add(surfaceMesh);
    }

    update() {
        SceneTree.renderer.setRenderTarget(this.renderBuffer);
        SceneTree.renderer.render(SceneTree.scene, SceneTree.camera);
        this.uniforms.framebuffer.value = this.renderBuffer.texture;

        this.uniforms.time.value += 0.002;
    }
}
