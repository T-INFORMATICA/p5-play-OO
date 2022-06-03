class Cursor extends GameObject { 
    constructor(x, y, size) { 
        super(x, y, size, size);
    }

    Update() { 
        this.#DrawCursor();
        this.#MoveCursor();
    }

    #MoveCursor() { 
        if (keyIsDown(LEFT_ARROW) === true) { 
            this.Position.x -= 5;
        }
        if (keyIsDown(RIGHT_ARROW) === true) { 
            this.Position.x += 5;
        }
        if (keyIsDown(UP_ARROW) === true) { 
            this.Position.y -= 5;
        }
        if (keyIsDown(DOWN_ARROW) === true) { 
            this.Position.y += 5;
        }
    }

    #DrawCursor() { 
        noFill();
        stroke(255, 0, 0);
        strokeWeight(2);

        circle(0, 0, this.Width);
    }
}