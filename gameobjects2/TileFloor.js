class TileFloor extends Sprite2 { 
    constructor(x, y, size) { 
        super(x, y - size / 4, size, size/2);
        this.Debug = true;
        this.SetDefaultCollider();
    }
    
    Update() {
        noStroke();
        fill("blue");
        rect(0, 0, this.Width, this.Height);
    }
}