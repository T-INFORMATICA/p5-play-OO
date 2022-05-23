class TileWall extends GameObject { 
    #id = 7;
    constructor(x, y, height) { 
        super(x, y, 50, height);
        this.SetDefaultCollider();
        this.CollisionLayer = Settings.Layers.GROUND;
    }
    
    Update() {
        noStroke();
        fill("green");
        rect(0, 0, this.Width, this.Height);
    }
}