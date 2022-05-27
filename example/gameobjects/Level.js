class Level {
    #backgroundTexture = undefined;

    #playerSpawnCoord = undefined;
    #exitSign = undefined;

    #loadingDone = false;
    #tiles = [];
    #coins = [];

    #currentLevelData = {};

    constructor(initialLevel) {
        this.#LoadLevelData(initialLevel);
    }

    #LoadLevelData(levelJSON) {
        this.#loadingDone = false;
        this.#currentLevelData = loadJSON(levelJSON, data => {
            loadImage(data.background, src => {
                this.#backgroundTexture = createFillImage(src, width * 5, height, src.width, src.height);
            });
            data.tiles.forEach(tileData => {
                this.#tiles.push(new Tile(tileData.x, tileData.y, tileData.w, tileData.h));
            });
            data.coins.forEach(coinData => {
                this.#coins.push(new Coin(coinData.x, coinData.y));
            });
            this.#playerSpawnCoord = createVector(data.playerSpawn.x * Settings.GridSize, data.playerSpawn.y * Settings.GridSize);

            if (data.nextLevel) {
                this.#exitSign = new ExitSign(data.levelExit.x, data.levelExit.y);
            }
            this.#loadingDone = true;
        });
    }

    GoToNextLevel() {

        this.#tiles.forEach(t => t.Remove());
        this.#coins.forEach(c => c.Remove());
        this.#exitSign.Remove();

        this.#LoadLevelData(this.#currentLevelData.nextLevel);
    }

    get ExitSign() {
        return this.#exitSign;
    }

    get LoadingDone() {
        return this.#loadingDone;
    }

    get Coins() {
        return this.#coins;
    }

    get PlayerSpawnCoord() {
        return this.#playerSpawnCoord.copy();
    }

    get BackgroundTexture() {
        return this.#backgroundTexture;
    }

    AddTile(tile) {
        this.#tiles.push(tile);
    }

    AddCoin(coin) {
        this.#coins.push(coin);
    }
}