const GRAVITY = 0.4;

class PlatformerGame extends Game {
    #player = null;
    #tiles = [];
    constructor() {
        super();

        this.#player = new Player(100, 100, 40);

        for (let i = 0; i < 10; ++i) {
            this.#tiles.push(new TileFloor(i * 70, 382, 70));
        }
        for (let i = 0; i < 2; ++i) {
            this.#tiles.push(new TileWall(700, 365 - (i * 70), 70));
        }
        this.#tiles.push(new TileFloor(700, 240, 70));
    }
}