class CollisionGame extends Game { 
    #ball = null;

    constructor() { 
        super();

        this.#ball = new Ball(200, 200, 40, 40);
    }

    Update() { 

    }
}