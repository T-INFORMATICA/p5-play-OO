class Ball extends GameObject { 
    #movementSpeed = null;

    constructor(x, y, w, h) { 
        super(x, y, w, h);

        this.SetDefaultCollider();

        this.#movementSpeed = createVector(0, 5);
    }

    Update() { 
        fill("magenta");
        circle(0, 0, this.Width);

        this.Position.y += this.#movementSpeed.y;
    }

    OnOverlap(spritesHit) { 

        for (let i = 0; i < spritesHit.length; ++i) { 
            let otherGameObject = spritesHit[i];
            if (otherGameObject instanceof Wall) { 
                this.#movementSpeed.y *= -1;
            }
        }
    }
}