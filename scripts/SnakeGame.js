class SnakeGame extends Game { 
    #snake = null;
    constructor() { 
        super();

        this.#snake = new Snake(100, 100);

        this.GenerateCandy();
    }

    GenerateCandy() { 
        let x = Math.floor(random(0, 10)) * 20;
        let y = Math.floor(random(0, 10)) * 20;
        let candy = new Candy(x, y, 20);
    }
}