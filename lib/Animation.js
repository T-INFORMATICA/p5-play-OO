class Animation {
    #spritesheet = undefined;
    #frames = undefined;

    #animationLoops = {};
    #currentAnimationLoop = "";
    #currentAnimationFrame = 0;

    constructor(spritesheetImage, framesJSON, speed = 20) {
        this.#spritesheet = loadImage(spritesheetImage);
        this.#frames = loadJSON(framesJSON);

        setInterval(() => {
            if (this.#currentAnimationLoop in this.#animationLoops) {
                this.#currentAnimationFrame = (this.#currentAnimationFrame + 1) % this.#animationLoops[this.#currentAnimationLoop].length;
            }
        }, speed);
    }

    set CurrentAnimationLoop(value) {
        if (this.#currentAnimationLoop == value) {
            return;
        }
        if (value in this.#animationLoops) {
            this.#currentAnimationLoop = value;
            this.#currentAnimationFrame = 0;
        }
    }

    AddAnimationLoop(loopName, ...frameNumbers) {
        this.#animationLoops[loopName] = frameNumbers;
    }

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