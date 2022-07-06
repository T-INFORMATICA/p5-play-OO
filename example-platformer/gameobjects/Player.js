class Player extends GameObject {
    #jumpsLeft = 1;
    #jumped = false;
    #animationFrames = undefined;
    #spritesheet = undefined;

    #animation = undefined;

    constructor(x, y, size) {
        super(x, y, 37, size);
        this.SetDefaultCollider();
        this.CollisionLayer = Settings.Layers.PLAYER;
        this.Depth = 100;

        this.#animation = new Animation("assets/images/p3_spritesheet.png", "assets/images/p3_spritesheet.json")

        this.#animation.AddAnimationLoop("idle", 4);
        this.#animation.AddAnimationLoop("walk", 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15);
        this.#animation.AddAnimationLoop("jump", 3);
        this.#animation.CurrentAnimationLoop = "idle";
    }

    Update() {
        push();
        if (this.Velocity.x < 0) {
            scale(-1, 1);
        }
        if (this.#jumpsLeft < 1) {
            this.#animation.CurrentAnimationLoop = "jump";
        }
        else if (this.Velocity.x < 0.1 && this.Velocity.x > -0.1) {
            this.#animation.CurrentAnimationLoop = "idle";
        }
        else if (this.Velocity.x != 0) {
            this.#animation.CurrentAnimationLoop = "walk";
        }
        this.#animation.Draw(this.Width, this.Height);
        pop();


        this.SetSpeed(this.Velocity.y + .4, 90);
        this.#jumped = false;


        if (keyIsDown(LEFT_ARROW) === true) {
            this.AddSpeed(5, 180);
        }
        if (keyIsDown(RIGHT_ARROW) === true) {
            this.AddSpeed(5, 0);
        }

        if (keyWentDown(UP_ARROW) === true && this.#jumpsLeft > 0) {
            this.SetSpeed(12, -90);
            this.#jumpsLeft--;
            this.#jumped = true;
        }
    }

    OnOverlap(spritesHit) { 
        spritesHit.forEach(other => {
            if (other instanceof Coin) { 
                console.log("found coin!!!");
                other.Collect();
            }
         });
    }

    OnCollide(spritesHit) {
        spritesHit.forEach(other => {
            if (this.Hit.bottom === true) {
                if (this.#jumped === false) {
                    this.#jumpsLeft = 1;
                }

                if (this.Velocity.y > 0) {
                    this.Velocity.y = 0;
                }
            }
            if (this.Hit.top === true && this.Hit.left === false && this.Hit.right === false) {
                this.Velocity.y = 0;
            }
        });
    }
}