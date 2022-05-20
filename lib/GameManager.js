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

    AddGameObject(gameObject) {
        this.#allGameObjects.add(gameObject);
    }

    AddGameObjectToCollisionLayer(gameObject, collisionLayer) {
        if (collisionLayer in this.#collisionLayers === false) {
            this.#collisionLayers[collisionLayer] = [];
        }

        this.#collisionLayers[collisionLayer].push(gameObject);
    }
}