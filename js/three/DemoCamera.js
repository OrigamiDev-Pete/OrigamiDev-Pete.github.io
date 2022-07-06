import * as THREE from 'three';
import Entity from './core/Entity.js';
import { deg2rad } from './core/MathHelper.js';
import SceneTree from './core/SceneTree.js';

export default class DemoCamera extends Entity {

    state = 0;
    shots = [
        {
            duration: 10.0,
            position: new THREE.Vector3(-5, 3, 15),
            cameraPosition: new THREE.Vector3(0, 0, 0),
            rotation: new THREE.Euler(deg2rad(10), 0, 0),
            movement: (delta) => {
                this.position.x -= 1.0 * delta;
            }
        },
        {
            duration: 10.0,
            position: new THREE.Vector3(-15, 3, 15),
            cameraPosition: new THREE.Vector3(0, 0, 0),
            rotation: new THREE.Euler(deg2rad(10), 0, 0),
            movement: (delta) => {
                this.position.x += 1.0 * delta;
            }
        }
        // {
        //     duration: 15.0,
        //     position: new THREE.Vector3(5, 4, 5),
        //     cameraPosition: new THREE.Vector3(9, 0, 9),
        //     rotation: new THREE.Euler(0, 0, 0),
        //     movement: (delta) => {
        //         this.position.x += 0.5 * delta;
        //     }
        // },
        // {
        //     duration: 15.0,
        //     position: new THREE.Vector3(12.0, 6.0, 12.0),
        //     cameraPosition: new THREE.Vector3(12.0, -2.0, 12.0),
        //     rotation: new THREE.Euler(0, 0, 0),
        //     movement: (delta) => {
        //         this.rotateY(deg2rad(5) * delta);
        //         this.position.x += 0.1 * delta;
        //     }
        // },
        // {
        //     duration: 15.0,
        //     position: new THREE.Vector3(2, 9.0, 0),
        //     cameraPosition: new THREE.Vector3(7, -5.0, 0),
        //     rotation: new THREE.Euler(0, 0, 0),
        //     movement: (delta) => {
        //         this.rotateY(deg2rad(-5) * delta);
        //         this.position.x -= 0.2 * delta;
        //     }
        // },
        // {
        //     duration: 15.0,
        //     position: new THREE.Vector3(12, 0, 10),
        //     cameraPosition: new THREE.Vector3(7, 5.0, 10),
        //     rotation: new THREE.Euler(0, 0, 0),
        //     movement: (delta) => {
        //         this.position.y += 0.2 * delta;
        //         this.position.z -= 0.7 * delta;
        //     }
        // },
    ];

    setLocation = (shot) => {
        this.position.copy(shot.position);
        this.camera.position.copy(shot.cameraPosition);
        this.camera.lookAt(this.position);
        this.rotation.copy(shot.rotation);
    }


    constructor() {
        super();
        SceneTree.registerEntity(this);

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.add(this.camera);
        this.setLocation(this.shots[this.state]);

        this.clock = new THREE.Clock();
    }

    update(delta) {

        const shot = this.shots[this.state];

        shot.movement(delta);

        if (this.clock.getElapsedTime() > shot.duration) {
            this.state = (this.state + 1) % this.shots.length;
            this.setLocation(this.shots[this.state]);
            this.clock.start();
        }
    }
}
