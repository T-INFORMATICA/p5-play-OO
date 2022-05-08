class Snake extends GameObject { 
    #head = null;
    #tail = null;
    #bodyparts = [];
    #timer = 0;
    constructor(x, y) { 
        super(0, 0, 0, 0);

        this.#head = new SnakeBodypart(x, y, 20, null, null);
        this.#head.AddBodypart();
        this.#head.AddBodypart();
        this.#head.AddBodypart();
    }

    Update() { 
        this.#timer += deltaTime;

        if (this.#timer > 200) { 
            this.#head.Move();
            this.#timer = 0;
        }

        if (keyIsDown(LEFT_ARROW) === true) { 
            this.#head.ChangeDirection(createVector(-1, 0));
        }
        if (keyIsDown(RIGHT_ARROW) === true) { 
            this.#head.ChangeDirection(createVector(1, 0));
        }
        if (keyIsDown(UP_ARROW) === true) { 
            this.#head.ChangeDirection(createVector(0, -1));
        }
        if (keyIsDown(DOWN_ARROW) === true) { 
            this.#head.ChangeDirection(createVector(0, 1));
        }

    }
}