class Player extends GameObject {
    #feet = null;
    #jumpsLeft = 1;
    #jumped = false;

    constructor(x, y, size) {
        super(x, y, size, size, true);

        loadJSON("assets/images/characters/character-alien-pink.json", allFrames => {
            let frames = [];
            let spritesheet = null;
            let animation = null;

            frames = [
                allFrames[9],
                allFrames[10]
            ];
            spritesheet = loadSpriteSheet('assets/images/characters/character-alien-pink.png', frames);
            animation = loadAnimation(spritesheet);
            animation.frameDelay = 90;
            this.addAnimation("walk", animation);
            
            frames = [
                allFrames[5]
            ];
            spritesheet = loadSpriteSheet('assets/images/characters/character-alien-pink.png', frames);
            animation = loadAnimation(spritesheet);
            this.addAnimation("jump", animation);
            
            frames = [
                allFrames[0]
            ];
            spritesheet = loadSpriteSheet('assets/images/characters/character-alien-pink.png', frames);
            animation = loadAnimation(spritesheet);
            this.addAnimation("stand", animation);

            this.changeAnimation("stand");
        });
        console.log(this);
    }

    Update() {
        if (this.#jumpsLeft < 1) {
            this.changeAnimation("jump");
        }
        else if (this.velocity.x < 0.1 && this.velocity.x > -0.1) {
            this.changeAnimation("stand");
        }
        else if (this.velocity.x != 0) {
            this.changeAnimation("walk");
        }
        if (this.animation)
            this.animation.draw(0, 0);

        this.setSpeed(this.velocity.y + GRAVITY, 90);
        this.#jumped = false;

        
        if (keyIsDown(LEFT_ARROW) === true) {
            this.addSpeed(5, 180);
        }
        if (keyIsDown(RIGHT_ARROW) === true) {
            this.addSpeed(5, 0);
        }
            
        if (keyWentDown(UP_ARROW) === true && this.#jumpsLeft > 0) {
            this.setSpeed(12, -90);
            this.#jumpsLeft--;
            this.#jumped = true;
        }
    }

    Collide(other) {
        if (other instanceof TileFloor) {
            if (this.#jumped === false) {
                this.#jumpsLeft = 1;
            }

            if (this.velocity.y > 0) {
                this.velocity.y = 0;
            }
        }
    }
}