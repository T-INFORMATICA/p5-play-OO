class TileWall extends GameObject { 
    constructor(x, y, size) { 
        super(x, y, size, size);
        this.Debug = true;
        this.SetDefaultCollider();
        this.CollisionLayer = CollisionLayers.Layers.GROUND;
    }
    
    Update() {
        noStroke();
        fill("blue");
        rect(0, 0, this.Width, this.Height);
    }
}