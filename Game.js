class Game {
    #player = null;
    #floors = [];
    constructor() {
        this.#player = new Player(100, 100, 50);
    
        for (let x = 0; x < 12; ++x) { 
            this.#floors.push(new TileFloor(50 * x, 400, 50));
        }
    
        let y = 3;
        for (; y > 0; --y) { 
            this.#floors.push(new TileWall(300, 400 - (50 * y), 50));
        }
        this.#floors.push(new TileFloor(300, 425 - (50 * 4), 50));
    }

    Update() {}
}