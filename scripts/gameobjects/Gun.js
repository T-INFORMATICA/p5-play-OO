class Gun extends MissileSpawner { 
    #cursor = null;

    constructor(x, y, width, height, cursor) { 
        super(x, y, width, height, true);

        this.#cursor = cursor;
    }

    Update() { 
        super.Update();

        rect(0, 0, this.width, this.height);
        if (keyIsDown(32) === true &&
            this.Timer > 50) {
            this.ResetTimer();

            this.Shoot(this.position.x,
                       this.position.y,
                       this.#cursor.position.x,
                       this.#cursor.position.y);
        }
    }
}