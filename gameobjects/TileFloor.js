class TileFloor extends GameObject { 
    #texture = undefined;
    constructor(x, y, Width) { 
        super(x, y, Width, 25);
        this.SetDefaultCollider();
        this.CollisionLayer = Settings.Layers.GROUND;
        this.#texture = loadImage("assets/images/grassHalfMid.png");
        textureWrap(REPEAT);
    }
    
    Update() {
        noStroke();
        fill("blue");
        rect(0, 0, this.Width, this.Height);

        let u = this.Width;
        let v = 30;

        texture(this.#texture);

        beginShape(TRIANGLES);
        vertex(-this.Width / 2, -this.Height / 2, 0, 0, 0);
        vertex(this.Width / 2, -this.Height / 2, 0, u, 0);
        vertex(this.Width / 2, this.Height / 2, 0, u, v);
      
        vertex(this.Width / 2, this.Height / 2, 0, u, v);
        vertex(-this.Width / 2, this.Height / 2, 0, 0, v);
        vertex(-this.Width / 2, -this.Height / 2, 0, 0, 0);
        endShape();
    }
}