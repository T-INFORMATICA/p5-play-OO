class City extends GameObject { 
    #hitpoints = 3;

    #citySprite = null;

    constructor(x, y, width, height) { 
        super(x, y, width, height);

        this.#citySprite = loadImage('assets/city.png');

        this.setCollider("rectangle", 0, 0, width, height);
    }

    Update() { 
        fill(0, 0, 0, 50);
        ellipse(0, this.height / 2, this.width * 8 / 7, this.height / 4);

        image(this.#citySprite, 0, 0, this.width, this.height);
    }

    Hit() { 
        this.#hitpoints--;

        if (this.#hitpoints === 0) { 
            this.remove();
        }
    }
}