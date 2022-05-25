class Game {
    #player = null;
    #tiles = [];
    #currentLevel = undefined;
    constructor() {

        this.#currentLevel = new Level("assets/levels/level1.json");

        let interval = setInterval(() => { 
            if (this.#currentLevel.LoadingDone) { 
                clearInterval(interval);
                this.#player = new Player(this.#currentLevel.PlayerSpawnCoord.x, this.#currentLevel.PlayerSpawnCoord.y, 50);
            }
        }, 100);


    }

    Update() {
        if (!this.#currentLevel.LoadingDone)
            return;
        
        if (this.#currentLevel.BackgroundTexture) { 
            image(this.#currentLevel.BackgroundTexture, 0, 0, this.#currentLevel.BackgroundTexture.width, this.#currentLevel.BackgroundTexture.height);
        }

        if (this.#player.Position.x > width / 2) {
            translate((this.#player.Position.x - width / 2) * -1, 0);
        }

        this.#player.Overlap(...this.#currentLevel.Coins);
    }
}