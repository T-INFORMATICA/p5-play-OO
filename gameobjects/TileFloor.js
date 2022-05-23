class TileFloor extends GameObject { 
    constructor(x, y, width) { 
        super(x, y, width, 25);
        this.SetDefaultCollider();
        this.CollisionLayer = Settings.Layers.GROUND;
    }
    
    Update() {
        noStroke();
        fill("blue");
        rect(0, 0, this.Width, this.Height);
    }
}