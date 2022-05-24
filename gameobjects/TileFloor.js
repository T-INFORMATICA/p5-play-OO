class TileFloor extends GameObject { 
    #texture = undefined;
    constructor(x, y, Width) { 
        super(x, y, Width, 25);
        this.SetDefaultCollider();
        this.CollisionLayer = Settings.Layers.GROUND;
        loadImage("assets/images/grassHalfMid.png", src => {
            this.#texture = createFillImage(src, this.Width, this.Height); 
        });
    }
    
    Update() {
        if (this.#texture)
            image(this.#texture, 0, 0, this.Width, this.Height);
    }
}