class TileWall extends GameObject { 
    #texture = undefined;
    constructor(x, y, height) { 
        super(x, y, 50, height);
        this.SetDefaultCollider();
        this.CollisionLayer = Settings.Layers.GROUND;
        loadImage("assets/images/grassCenter.png", src => {
            this.#texture = createFillImage(src, this.Width, this.Height); 
        });
    }
    
    Update() {
        if (this.#texture)
            image(this.#texture, 0, 0, this.Width, this.Height);
    }
}