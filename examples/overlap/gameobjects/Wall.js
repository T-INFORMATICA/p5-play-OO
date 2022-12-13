class Wall extends GameObject { 
    constructor(x, y, w, h) { 
        super(x, y, w, h);

        this.SetDefaultCollider();
    }

    Update() { 
        fill("black");
        rect(0, 0, this.Width, this.Height);
    }
}