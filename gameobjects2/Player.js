class Player extends Sprite2 { 
    constructor(x, y, size) { 
        super(x, y, size, size);
        this.Debug = true;
        this.SetDefaultCollider();
    }

    Update() { 
        noStroke();
        fill("red");
        rect(0, 0, this.Width, this.Height);

        this.SetSpeed(this.Velocity.y + .4, 90);

        if (keyIsDown(LEFT_ARROW) === true) {
            this.AddSpeed(5, 180);
        }
        if (keyIsDown(RIGHT_ARROW) === true) {
            this.AddSpeed(5, 0);
        }

        if (keyIsDown(UP_ARROW) === true) {
            this.SetSpeed(12, -90);
        }
    }

    // Test(other) {
    //     // console.log("test");
    //     if (other instanceof TileFloor) {
    //         if (this.#jumped === false) {
    //             this.#jumpsLeft = 1;
    //         }

    //         if (this.Velocity.y > 0) {
    //             this.Velocity.y = 0;
    //         }
    //     }
    // }
}