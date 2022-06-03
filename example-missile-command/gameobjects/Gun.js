class Gun extends MissileSpawner { 
    #cursor = null;

    constructor(x, y, width, height, cursor) { 
        super(x, y, width, height, true);

        this.#cursor = cursor;
    }

    Update() { 
        super.Update();

        rect(0, 0, this.Width, this.Height);
        if (keyIsDown(32) === true &&
            this.Timer > 50) {
            this.ResetTimer();

            this.Shoot(this.Position.x,
                       this.Position.y,
                       this.#cursor.Position.x,
                       this.#cursor.Position.y);
        }
    }
}