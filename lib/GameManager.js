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

    Init() {
        createCanvas(Settings.GameWidth, Settings.GameHeight);
        this.#gameInstance = new Game();

        this.#UpdateDebugText();
        setInterval(() => {this.#UpdateDebugText()}, 500);
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

    Update() { 
        background(Settings.BackgroundColor);
        this.#allGameObjects.forEach(go => go.Display());

        for (const layerA in Settings.LayerInteractions) { 
            let value = Settings.LayerInteractions[layerA];
            value.forEach(layerB => { 
                this.#collisionLayers[layerA].forEach(go => go.Collide(...this.#collisionLayers[layerB]));
            });
        }

        if (Settings.Debug === true) {
            push();
            textAlign(RIGHT, TOP);
            text(this.#debugText, width - 10, 0);
            pop();
        }
    }

    #UpdateDebugText() {
        this.#debugText = `
        ${"debugMode On"}
        ${Math.round(frameRate())} fps
        `;
    }
}

window.setup = GameManager.Setup;
window.draw = GameManager.Draw;