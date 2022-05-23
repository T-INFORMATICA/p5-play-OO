class Game {
    #player = null;
    #floors = [];
    constructor() {
        this.#player = new Player(100, 500, 50);
    
        this.#floors.push(new TileFloor(width / 2, 587, width));
        this.#floors.push(new TileWall(300, 500, 150));
        this.#floors.push(new TileWall(25, 375, 400))
        this.#floors.push(new TileFloor(300, 412, 50));
    }

    Update() {
        if (this.#player.Position.x > width / 2) {
            translate((this.#player.Position.x - width / 2) * -1, 0);
        }

    }
}