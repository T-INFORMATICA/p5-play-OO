class Level {
    #backgroundTexture = undefined;
    #floorTexture = undefined;
    #fillTexture = undefined;

    #playerSpawnCoord = undefined;

    #loadingDone = false;
    #tiles = [];
    #coins = [];

    #currentLevelData = {};
    constructor(initialLevel) {

        this.#currentLevelData = loadJSON(initialLevel, data => {
            data.tiles.forEach(tileData => {
                this.#tiles.push(new Tile(tileData.x, tileData.y, tileData.w, tileData.h));
            });
            data.coins.forEach(coinData => {
                this.#coins.push(new Coin(coinData.x, coinData.y));
            });
            this.#playerSpawnCoord = createVector(data.playerSpawn.x * Settings.GridSize, data.playerSpawn.y * Settings.GridSize);
            this.#loadingDone = true;
        });
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

    set BackgroundTextureUrl(value) {
        loadImage(value, src => {
            this.#backgroundTexture = createFillImage(src, width * 5, height, src.width, src.height);
        });
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