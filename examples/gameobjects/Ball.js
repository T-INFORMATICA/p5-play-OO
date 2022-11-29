class Ball extends GameObject { 
    #movementSpeed = null;

    constructor(x, y, w, h) { 
        super(x, y, w, h);

        this.SetDefaultCollider();

        this.CollisionLayer = Settings.Layers.PLAYER;

        this.#movementSpeed = createVector(0, 5);
    }

    Update() { 
        fill("magenta");
        circle(0, 0, this.Width);

        // this.Position.y += this.#movementSpeed.y;
    }

    OnCollide(gameobjectsHit) { 

        for (let i = 0; i < gameobjectsHit.length; ++i) { 
            let otherGameObject = gameobjectsHit[i];
            if (otherGameObject instanceof Wall) { 
                if (this.Hit.bottom === true) { 
                    this.#movementSpeed.y *= -1;
                }
                if (this.Hit.top === true) { 
                    this.#movementSpeed.y *= -1;
                }
            }
        }
    }
}