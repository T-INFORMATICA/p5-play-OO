/** Class representing an animation based on a spritesheet and json. */
class Animation {
    #spritesheet = undefined;
    #frames = undefined;

    #animationLoops = {};
    #currentAnimationLoop = "";
    #currentAnimationFrame = 0;

    /**
     * Create a new Animation.
     * @param {string} spritesheetImagePath - The path to an image representing a spritesheet.
     * @param {string} framesJSONPath - The path to a JSON file holding all frames data for the spritesheet.
     */
    constructor(spritesheetImagePath, framesJSONPath, speed = 20) {
        this.#spritesheet = loadImage(spritesheetImagePath);
        this.#frames = loadJSON(framesJSONPath);

        setInterval(() => {
            if (this.#currentAnimationLoop in this.#animationLoops) {
                this.#currentAnimationFrame = (this.#currentAnimationFrame + 1) % this.#animationLoops[this.#currentAnimationLoop].length;
            }
        }, speed);
    }

    /**
     * Add an animationloop to the animation. An animation loop consists of several frames that are defined in the framesJSON file for this animation.
     * Framenumbers are 0-based. 
     * Frames can be reused in different animationloops.
     * @param {string} loopName - The name for this animationloop. This name must be unique!
     * @param {number} frameNumbers - the framenumbers for this animationloop, as defined (in order) in the framesJSON file for this animation.
     */
    AddAnimationLoop(loopName, ...frameNumbers) {
        this.#animationLoops[loopName] = frameNumbers;
    }

    /**
     * Set the current animation loop to a previously-defined animation-loop.
     * @param {string} value - the name of the animation-loop that should run from now on.
     */
    set CurrentAnimationLoop(value) {
        if (this.#currentAnimationLoop == value) {
            return;
        }
        if (value in this.#animationLoops) {
            this.#currentAnimationLoop = value;
            this.#currentAnimationFrame = 0;
        }
    }

    /**
     * Draws the current animation-frame for the currently selected animation-loop.
     * @param {number} w - the draw-width for this animation
     * @param {number} h - the draw-height for this animation
     */
    Draw(w, h) {
        if (this.#currentAnimationLoop in this.#animationLoops &&
            this.#frames[this.#animationLoops[this.#currentAnimationLoop][this.#currentAnimationFrame]]) {
            image(this.#spritesheet, 0, 0, w, h, 
                this.#frames[this.#animationLoops[this.#currentAnimationLoop][this.#currentAnimationFrame]].frame.x,
                this.#frames[this.#animationLoops[this.#currentAnimationLoop][this.#currentAnimationFrame]].frame.y,
                this.#frames[this.#animationLoops[this.#currentAnimationLoop][this.#currentAnimationFrame]].frame.width,
                this.#frames[this.#animationLoops[this.#currentAnimationLoop][this.#currentAnimationFrame]].frame.height);
        }
    }
}