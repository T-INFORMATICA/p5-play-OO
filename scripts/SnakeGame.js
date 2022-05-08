class SnakeGame extends Game { 
    #snake = null;
    #timer = 0;
    #currentCandy = null;

    constructor() { 
        super();

        this.#snake = new Snake(100, 100);

        this.GenerateCandy();
    }

    Update() { 
        super.Update();

        if (this.#currentCandy.removed) { 
            this.GenerateCandy();
        }
    }

    GenerateCandy() { 
        let x = Math.floor(random(0, width / 20)) * 20;
        let y = Math.floor(random(0, height / 20)) * 20;
        this.#currentCandy = new Candy(x, y, 20);
    }
}