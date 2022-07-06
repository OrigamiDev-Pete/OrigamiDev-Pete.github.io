import * as THREE from 'three';
import Entity from './core/Entity.js';
import WaterSurface from './WaterSurface.js';

export default class MainScene extends Entity {
    constructor() {
        super();


        // Lighting
        const ambientLight = new THREE.AmbientLight(0x3678df);
        this.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xFFFFFF);
        directionalLight.position.set(10, 10, 10);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.bias = 0.0001;

        const shadowDirection = 10;
        directionalLight.shadow.camera.top = shadowDirection;
        directionalLight.shadow.camera.bottom = -shadowDirection;
        directionalLight.shadow.camera.right = shadowDirection;
        directionalLight.shadow.camera.left = -shadowDirection;
        directionalLight.shadow.near = 0.1;
        directionalLight.shadow.far = 400;
        this.add(directionalLight);

        const pointLight = new THREE.HemisphereLight(0xFFFFFF, 0x444444, 0.5);
        pointLight.position.set(0, 10, 0);
        this.add(pointLight);

        const sunGeo = new THREE.SphereGeometry(5);
        const sunMat = new THREE.MeshStandardMaterial({
            emissive: new THREE.Color(1, 1, 1)
        });
        const sun = new THREE.Mesh(sunGeo, sunMat);
        sun.position.y = 20
        this.add(sun);

        const waterSurface = new WaterSurface();
        this.add(waterSurface);
    }
}