class Game {
    #player = null;
    #floors = [];
    constructor() {
        this.#player = new Player(100, 500, 50);
    
        for (let x = 0; x < 12; ++x) { 
            this.#floors.push(new TileFloor(50 * x, 600, 50));
        }
    
        let y = 3;
        for (; y > 0; --y) { 
            this.#floors.push(new TileWall(300, 600 - (50 * y), 50));
        }
        this.#floors.push(new TileFloor(300, 625 - (50 * 4), 50));
    }

    Update() {}
}