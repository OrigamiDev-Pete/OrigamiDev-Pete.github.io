import * as THREE from 'three';
import MainScene from '../MainScene.js';

export default class SceneTree {

    static scene = undefined;
    static entities = [];
    static paused = false;
    static camera;
    static renderer;
    
    /**
     * Adds an Entity to the scene and registers the entity, ready for update on next frame.
     * @param {Entity} entity 
     */
    static addToScene(entity) {
        SceneTree.scene.add(entity);
        SceneTree.registerEntity(entity);
    }

    /**
     * Used to add children of 'top-level' entities to the update call.
     * The entities onEnter method is called immediately as the entity is registered.
     * @param {Entity} entity 
     */
    static registerEntity(entity) {
        SceneTree.entities.push(entity);
        entity.onEnter();
    }

    static update(delta) {
        if (SceneTree.paused === false) {
            for (let i = 0; i < SceneTree.entities.length; i++) {
                SceneTree.entities[i].update(delta);
            }
        }
    }

    /**
     * Initialises the scene. Any entities that can be created here, should be.
     * Should be called before the first call to mainLoop.
     */
    static initScene() {
        SceneTree.scene.background = new THREE.Color(0x3678df);
        SceneTree.scene.fog = new THREE.Fog(0x3678df, 5, 30);
        const mainScene = new MainScene();
        SceneTree.addToScene(mainScene);
    }
}
