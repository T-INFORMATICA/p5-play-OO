class Player extends GameObject {
    #feet = null;
    #jumpsLeft = 1;
    #jumped = false;
    #animationData = null;
    #animationSpritesheet = null;

    constructor(x, y, size) {
        super(x, y, size, size, true);
        this.debug = true;

        this.#animationData = loadJSON("assets/images/characters/character-alien-pink.json", frames => {
        });
        console.log(this.#animationData)
    }

    Update() {
        this.setSpeed(this.velocity.y + GRAVITY, 90);
        this.#jumped = false;
        
        if (keyIsDown(LEFT_ARROW) === true) {
            this.addSpeed(5, 180);
        }
        if (keyIsDown(RIGHT_ARROW) === true) {
            this.addSpeed(5, 0);
        }
            
        if (keyWentDown(UP_ARROW) === true && this.#jumpsLeft > 0) {
            this.setSpeed(10, -90);
            this.#jumpsLeft--;
            this.#jumped = true;
        }

    }

    Collide(other) {
        if (other instanceof Tile) {
            if (this.#jumped === false) {
                this.#jumpsLeft = 1;
            }

            if (this.velocity.y > 0) {
                this.velocity.y = 0;
            }
        }
    }
}