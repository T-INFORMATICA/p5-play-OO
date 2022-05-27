class Coin extends GameObject { 
    #collected = false;
    constructor(gridX, gridY) { 
        let x = ((gridX + (1 / 2)) * Settings.GridSize);
        let y = ((gridY + (1 / 2)) * Settings.GridSize);
        super(x, y, 20, 20);
        this.SetDefaultCollider();
    }

    Collect() { 
        this.RemoveCollider();
        this.#collected = true;
        setTimeout(() => { this.Remove(); }, 200);
        this.Width = 20;
    }

    Update() { 
        fill("gold");
        strokeWeight(1);
        stroke("brown");
        ellipse(0, 0, this.Width, this.Height);
        
        if (this.#collected) { 
            this.Position.y -= 4;
            if (this.Width > 0) {
                this.Height -= 2;
                this.Width -= 2;
        }
        }
        else {
            this.Width++;
            if (this.Width > 20) { 
                this.Width *= -1;
            }
        }
    }
}