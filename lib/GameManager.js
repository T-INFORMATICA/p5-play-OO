class GameManager {
    static #INSTANCE;

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

    Init() {
        createCanvas(Settings.GameWidth, Settings.GameHeight);
        this.#gameInstance = new Game();

        if (Settings.Debug == true) {
            this.#UpdateDebugText();
            setInterval(() => { this.#UpdateDebugText() }, 500);
        }
    }

    AddGameObject(gameObject) {
        this.#allGameObjects.push(gameObject);
    }

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

    static Setup() {
        GameManager.GetInstance().Init();
    }

    static Draw() {
        GameManager.GetInstance().Update();
    }

    static KeyPressed() {
        GameManager.keysPressed.push(keyCode);
    }

    Update() {
        push();
        background(Settings.BackgroundColor);
        // translate(-width / 2, -height / 2);
        this.#gameInstance.Update();
        this.#allGameObjects.forEach(go => go.Display());

        for (const layerA in Settings.LayerInteractions) {
            let value = Settings.LayerInteractions[layerA];
            value.forEach(layerB => {
                this.#collisionLayers[layerA].forEach(go => go.Collide(...this.#collisionLayers[layerB]));
            });
        }

        pop();

        if (Settings.Debug === true) {
            push();
            textAlign(RIGHT, TOP);
            text(this.#debugText, width - 10, 0);
            pop();
        }

        if (GameManager.keysPressed.length > 0) {
            GameManager.keysPressed = [];
        }
    }

    #UpdateDebugText() {
        this.#debugText = `
        ${"debugMode On"}
        ${Math.round(frameRate())} fps
        `;
    }
}

window.preload = GameManager.Setup;
window.setup = GameManager.Setup;
window.draw = GameManager.Draw;
window.keyPressed = GameManager.KeyPressed;

p5.prototype.keyWentDown = function (key) {
    return GameManager.keysPressed.includes(key);
};

p5.prototype.createFillImage = function(src, w, h) {
    let img = createImage(w, h);
    
    if (w > h) {
        src.resize(0, h);
        for (let i = 0; i < w; i+=src.width) {
            img.copy(src, 0, 0, src.width, src.height, i, 0, src.width, src.height);
        }
    }
    else {
        src.resize(w, 0);
        for (let i = 0; i < h; i+=src.height) {
            img.copy(src, 0, 0, src.width, src.height, 0, i, src.width, src.height);
        }
    }
    return img;
}