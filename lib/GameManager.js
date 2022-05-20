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

    Init() {
    }

    AddGameObject(gameObject) {
        this.#allGameObjects.push(gameObject);
    }

    AddGameObjectToCollisionLayer(gameObject, collisionLayer) {
        for (const layername in this.#collisionLayers) {
            let index = this.#collisionLayers[layername].indexOf(gameObject);
            if (index >= 0) { 
                if (layername === collisionLayer) {
                    return;
                }
                else { 
                    this.#collisionLayers[layername].splice(index, 1);
                }
            }
        }

        if (collisionLayer in this.#collisionLayers === false) {
            this.#collisionLayers[collisionLayer] = [];
        }

        this.#collisionLayers[collisionLayer].push(gameObject);
    }

    static Setup() { 
        GameManager.GetInstance();
    }

    static Draw() { 
        GameManager.GetInstance().Update();
    }

    Update() { 
        background(255);
        this.#allGameObjects.forEach(go => go.Display());

        for (const layerA in CollisionLayers.Interactions) { 
            let value = CollisionLayers.Interactions[layerA];
            value.forEach(layerB => { 
                this.#collisionLayers[layerA].forEach(go => go.Collide(...this.#collisionLayers[layerB]));
            });
        }
    }

}