import { Object3D } from "../three.module.js";
/**
 * Abstract Entity Class
 * @class Entity
 */
export default class Entity extends Object3D {
    isEntity = true;

    signals = new Map();

    constructor() {
        super()
        if (this.constructor === Entity) {
            throw new Error("Abstract class must be inherited to be used");
        }
    }

    /**
     * Virtual method.
     * Called when an Entity is added to the scene.
     */
    onEnter() {}

    /**
     * Virtual method.
     * Called every process frame.
     * @param {Number} delta The time difference between rendered frames
     */
    update(delta) {}

    // Signal system //

    /**
     * Connects a function callback to a signal. When the signal is emitted,
     * all connected callbacks are called.
     * @param {String} signalName Name of the signal
     * @param {function} callback function to call when signal is emitted
     */
    connect(signalName, callback) {
        this.signals.set(signalName, [callback]);
    }

    /**
     * Emits the signal.
     * @param {String} signalName Name of the signal to be emitted
     */
    emitSignal(signalName) {
        const callback = this.signals.get(signalName);
        if (callback) {
            callback.forEach(element => {
               element(); 
            });

        }
    }
}