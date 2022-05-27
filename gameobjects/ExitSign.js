class ExitSign extends GameObject { 
    #collected = false;
    #texture = undefined;
    constructor(gridX, gridY) { 
        let x = ((gridX + (1 / 2)) * Settings.GridSize);
        let y = ((gridY + (1 / 2)) * Settings.GridSize);
        super(x, y, Settings.GridSize, Settings.GridSize);
        this.SetDefaultCollider();

        this.#texture = loadImage("assets/images/signExit.png");
    }

    Update() { 
        if (this.#texture) {
            image(this.#texture, 0, 0, this.Width, this.Height);
        }
    }
}