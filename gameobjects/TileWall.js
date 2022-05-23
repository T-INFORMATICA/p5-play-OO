class TileWall extends GameObject { 
    #id = 7;
    #texture = undefined;

    constructor(x, y, height) { 
        super(x, y, 50, height);
        this.SetDefaultCollider();
        this.CollisionLayer = Settings.Layers.GROUND;
        this.#texture = loadImage("assets/images/grassCenter.png");
    }
    
    Update() {
        noStroke();
        fill("green");
        rect(0, 0, this.Width, this.Height);
        

        let u = 50;
        let v = this.Height;

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