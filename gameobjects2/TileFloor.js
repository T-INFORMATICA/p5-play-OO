class TileFloor extends Sprite2 { 
    constructor(x, y, size) { 
        super(x, y, size, size);
        this.Debug = true;
        this.SetDefaultCollider();
    }
    
    Update() {
        noStroke();
        fill("blue");
        rect(0, 0, this.Width, this.Height);
    }
}