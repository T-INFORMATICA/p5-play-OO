class CollisionGame extends Game { 
    #ball = null;
    #wall = null;

    constructor() { 
        super();

        this.#ball = new Ball(200, 200, 40, 40);
        this.#wall = new Wall(200, 400, 200, 40);
        this.#wall = new Wall(200, 100, 200, 40);
    }

    Update() { 

    }
}