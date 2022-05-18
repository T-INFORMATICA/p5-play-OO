class Player extends Sprite2 {
    #feet = null;
    #jumpsLeft = 1;
    #jumped = false;

    constructor(x, y, size) {
        super(x, y, size, size, true);
        this.debug = true;
        this.SetDefaultCollider();
    }

    Update() {
        fill("red");
        rect(0, 0, this.Width, this.Height);
        this.SetSpeed(this.Velocity.y + .4, 90);
        this.#jumped = false;

        
        if (keyIsDown(LEFT_ARROW) === true) {
            this.AddSpeed(5, 180);
        }
        if (keyIsDown(RIGHT_ARROW) === true) {
            this.AddSpeed(5, 0);
        }
            
        if (keyIsDown(UP_ARROW) === true && this.#jumpsLeft > 0) {
            this.SetSpeed(12, -90);
            this.#jumpsLeft--;
            this.#jumped = true;
        }
    }

    OnCollide(other) {
        if (other instanceof TileFloor) {
            if (this.#jumped === false) {
                this.#jumpsLeft = 1;
            }

            if (this.Velocity.y > 0) {
                this.Velocity.y = 0;
            }
        }
    }
}