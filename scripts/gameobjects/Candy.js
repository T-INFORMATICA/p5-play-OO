class Candy extends GameObject { 
    constructor(x, y, size) { 
        super(x, y, size, size);
    }

    Update() { 
        fill(255, 150, 150);
        rect(0, 0, this.width, this.height);
    }
}