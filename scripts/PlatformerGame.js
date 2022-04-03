const GRAVITY = 0.4;

class PlatformerGame extends Game {
    #player = null;
    #tiles = [];
    constructor() {
        super();

        this.#player = new Player(100, 100, 40);

        for (let i = 0; i < 10; ++i) {
            this.#tiles.push(new TileFloor(i * 40, 380, 40));
        }
    }
}