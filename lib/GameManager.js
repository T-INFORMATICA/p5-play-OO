/** Singleton class that manages the game and handles various p5 functionalities. */
class GameManager {
    static #INSTANCE;

    /**
     * Function to retrieve the current instance of the GameManager. Always use this function instead of the constructor!
     * When no instance is available, one is created.
     * @returns The singleton instance of the GameManager.
     */
    static GetInstance() {
        if (GameManager.#INSTANCE == undefined) {
            GameManager.#INSTANCE = new GameManager();
            GameManager.#INSTANCE.Init();
        }
        return GameManager.#INSTANCE;
    }

    #allGameObjects = [];
    #collisionLayers = {};
    #gameInstance = undefined;
    #debugUpdateTimer = 0;
    #debugText = "";

    static keysPressed = [];

    /**
     * The instance of the game that is playing.
     * @param {Game} value - An instance of a game that the gameManager should manage.
     */
    set GameInstance(value) {
        this.#gameInstance = value;
    }

    /**
     * Initializes the canvas and game values.
     */
    Init() {
        createCanvas(Settings.GameWidth, Settings.GameHeight);

        if (Settings.Debug === true || Settings.ShowStats === true) {
            this.#UpdateDebugText();
            setInterval(() => { this.#UpdateDebugText() }, 500);
        }
    }

    /**
     * Removes a GameObject from the scene.
     * @param {GameObject} gameObject - The GameObject to be removed from the scene.
     */
    RemoveGameObject(gameObject) {
        this.#allGameObjects = this.#allGameObjects.filter(go => go != gameObject);

        for (const layerId in this.#collisionLayers) {
            let index = this.#collisionLayers[layerId].indexOf(gameObject);
            if (index >= 0) {
                this.#collisionLayers[layerId].splice(index, 1);
            }
        }
    }

    /**
     * Adds a GameObject to the current game.
     * @param {GameObject} gameObject - The GameObject to be added to the scene.
     */
    AddGameObject(gameObject) {
        gameObject.Index = this.#allGameObjects.length;
        this.#allGameObjects.push(gameObject);
    }

    /**
     * Puts the given GameObject on the given Collision Layer. Collision Layers are defined in Settings/Settings.js
     * @param {GameObject} gameObject - The GameObject to be added to the collision layer
     * @param {Settings.collisionLayer} collisionLayer - Collision layer defined in the Settings file
     */
    AddGameObjectToCollisionLayer(gameObject, collisionLayer) {
        for (const layerId in this.#collisionLayers) {
            let index = this.#collisionLayers[layerId].indexOf(gameObject);
            if (index >= 0) {
                if (layerId === collisionLayer) {
                    return;
                }
                else {
                    this.#collisionLayers[layerId].splice(index, 1);
                }
            }
        }

        if (collisionLayer in this.#collisionLayers === false) {
            this.#collisionLayers[collisionLayer] = [];
        }

        this.#collisionLayers[collisionLayer].push(gameObject);
    }

    /**
     * Sets up a Game instance, defined by the type of Game in Settings/Settings.js
     */
    static Setup() {
        GameManager.GetInstance().#gameInstance = new Settings.GameClass();
    }

    /**
     * Static function that functions as a replacement for p5.draw. This calls Update from the GameManager Instance.
     */
    static Draw() {
        GameManager.GetInstance().Update();
    }

    /**
     * Static function that functions as a replacement for p5.kyePressed. This calls KeyPressed from the current Game instance.
     */
    static KeyPressed() {
        GameManager.keysPressed.push(keyCode);
        this.#gameInstance.KeyPressed();
    }

    /**
     * Update draws all GameObjects in the correct order and draws debug information in case Settings/Settings.js/Debug was set to true.
     */
    Update() {
        push();
        background(Settings.BackgroundColor);
        if (this.#gameInstance) {
            this.#gameInstance.Update();
        }
        this.#allGameObjects.sort((a, b) => a.Depth == b.Depth ? 0 : a.Depth > b.Depth ? 1 : -1);
        this.#allGameObjects.forEach(go => go.Display());

        for (const layerA in Settings.LayerInteractions) {
            let value = Settings.LayerInteractions[layerA];
            value.forEach(layerB => {
                if (this.#collisionLayers[layerA] && this.#collisionLayers[layerB]) {
                    this.#collisionLayers[layerA].forEach(go => go.Collide(...this.#collisionLayers[layerB]));
                }
            });
        }

        this.#allGameObjects.forEach(go => { 
            if (go.Collider) {
                let gameObjectsWithCollider = this.#allGameObjects.filter(f => f.Collider && f != go)
                go.Overlap(...gameObjectsWithCollider);
            }
        });

        if (Settings.ShowGrid) {
            this.#DrawGridOverlay();
        }
        pop();

        if (Settings.Debug === true || Settings.ShowStats === true) {
            push();
            textAlign(RIGHT, TOP);
            text(this.#debugText, width - 10, 0);
            pop();
        }

        if (GameManager.keysPressed.length > 0) {
            GameManager.keysPressed = [];
        }
    }

    /**
     * Updates the debug text that is shown in the upper right corner.
     */
    #UpdateDebugText() {
        this.#debugText = `
        ${"debugMode On"}
        ${Math.round(frameRate())} fps
        `;
    }

    /**
     * Draws a Grid overlay, where each square is sized according to Settings/Settings.js/GridSize
     */
    #DrawGridOverlay() {
        push();
        stroke('rgba(0,255,0, 0.25)');
        for (let i = 0; i < 100; ++i) {
            line(0, i * Settings.GridSize, 100 * Settings.GridSize, i * Settings.GridSize);
        }
        for (let i = 0; i < 100; ++i) {
            line(i * Settings.GridSize, 0, i * Settings.GridSize, 100 * Settings.GridSize);
        }
        pop();
    }
}

// window.preload = GameManager.Setup;
window.setup = GameManager.Setup;
window.draw = GameManager.Draw;
window.keyPressed = GameManager.KeyPressed;

/**
 * Global function to check if a key (by keycode) was pressed in the previous frame.
 * @param {number} key - keyCode to check if the key went down in the previous frame
 * @returns true if the key went down in the previous frame.
 */
p5.prototype.keyWentDown = function (key) {
    return GameManager.keysPressed.includes(key);
};

/**
 * Copies a source image as a pattern to a target image.
 * @param {p5.Image} src The source image on which the fill image is based.
 * @param {number} dw Width of the target image
 * @param {number} dh Height of the target image
 * @param {number} sw Width of the source image
 * @param {number} sh Height of the source image
 * @returns An image that contains the source image as a pattern
 */
p5.prototype.createFillImage = function (src, dw, dh, sw, sh) {
    let img = createImage(dw, dh);

    src.resize(sw, sh);
    for (let i = 0; i < dw; i += src.width) {
        for (let j = 0; j < dh; j += src.height) {
            img.copy(src, 0, 0, src.width, src.height, i, j, src.width, src.height);
        }
    }
    return img;
}