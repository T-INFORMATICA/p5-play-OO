class Game {
    #player = null;
    #floors = [];
    constructor() {
        this.#player = new Player(100, 500, 50);

        this.#floors.push(new TileFloor(25, 138, 50));

    
        this.#floors.push(new TileFloor(400, 588, 800));
        this.#floors.push(new TileFloor(300, 413, 50));
        this.#floors.push(new TileFloor(600, 413, 150));
        this.#floors.push(new TileFloor(500, 313, 100));

        this.#floors.push(new TileFloor(1300, 588, width));

        this.#floors.push(new TileWall(25, 375, 450))
        this.#floors.push(new TileWall(300, 525, 200));

    }

    Update() {
        if (this.#player.Position.x > width / 2) {
            translate((this.#player.Position.x - width / 2) * -1, 0);
        }
    }
}