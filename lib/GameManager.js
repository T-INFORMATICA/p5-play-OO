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

    set GameInstance(value) {
        this.#gameInstance = value;
    }

    Init() {
        createCanvas(Settings.GameWidth, Settings.GameHeight);

        if (Settings.Debug === true || Settings.ShowStats === true) {
            this.#UpdateDebugText();
            setInterval(() => { this.#UpdateDebugText() }, 500);
        }
    }

    RemoveGameObject(gameObject) {
        this.#allGameObjects = this.#allGameObjects.filter(go => go != gameObject);

        for (const layerId in this.#collisionLayers) {
            let index = this.#collisionLayers[layerId].indexOf(gameObject);
            if (index >= 0) {
                this.#collisionLayers[layerId].splice(index, 1);
            }
        }
    }

    AddGameObject(gameObject) {
        gameObject.Index = this.#allGameObjects.length;
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
        GameManager.GetInstance().#gameInstance = new Settings.GameClass();
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
        if (this.#gameInstance) {
            this.#gameInstance.Update();
        }
        this.#allGameObjects.sort((a, b) => a.Depth > b.Depth ? 1 : 0);
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

    #UpdateDebugText() {
        this.#debugText = `
        ${"debugMode On"}
        ${Math.round(frameRate())} fps
        `;
    }

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

p5.prototype.keyWentDown = function (key) {
    return GameManager.keysPressed.includes(key);
};

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