class City extends GameObject { 
    #hitpoints = 3;

    #citySprite = null;

    constructor(x, y, width, height) { 
        super(x, y, width, height);

        this.#citySprite = loadImage('assets/city.png');

        this.SetDefaultCollider();
        this.CollisionLayer = Settings.Layers.CITIES;
    }

    Update() { 
        fill(0, 0, 0, 50);
        ellipse(0, this.Height / 2, this.Width * 8 / 7, this.Height / 4);

        image(this.#citySprite, 0, 0, this.Width, this.Height);
    }

    Hit() { 
        this.#hitpoints--;

        if (this.#hitpoints === 0) { 
            this.Remove();
        }
    }
}