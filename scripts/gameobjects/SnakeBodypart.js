class SnakeBodypart extends GameObject {
    #child = null;
    #parent = null;
    #moveDirection = null;
    constructor(x, y, size, child, parent) {
        super(x, y, size, size);
        this.#child = child;
        this.#parent = parent;
        this.#moveDirection = createVector(1, 0);
    }

    Move() {
        this.position.x += this.#moveDirection.x * this.width;
        this.position.y += this.#moveDirection.y * this.width;

        if (this.#child) {
            let distanceToNext = p5.Vector.dist(this.position, this.#child.position);

            if (distanceToNext > this.width)
                this.#child.Move();
            if (Math.abs(this.#moveDirection.angleBetween(this.#child.#moveDirection)) > 0)
                this.#child.#moveDirection = this.#moveDirection.copy();
        }
    }

    Update() { 
        rect(0, 0, this.width, this.height);
    }

    AddBodypart() {
        if (this.#child) { 
            this.#child.AddBodypart();
            return;
        }

        let bodypart = new SnakeBodypart(this.position.x, this.position.y, 20, null, this);
        bodypart.#moveDirection = this.#moveDirection.copy();

        this.#child = bodypart;

    }

    ChangeDirection(newDir) {
        let angle = newDir.angleBetween(this.#moveDirection);
        angle = Math.abs(angle);
        if (angle < 1.6) {
            this.#moveDirection = newDir;
        }
    }

    Overlap(other) { 
        if (other instanceof Candy) { 
            if (this.#parent == null) { 
                other.remove();
                let x = Math.floor(random(0, 10)) * 20;
                let y = Math.floor(random(0, 10)) * 20;
                let candy = new Candy(x, y, 20);
                this.AddBodypart();
            }
        }

        if (other instanceof SnakeBodypart) { 
            // GAME OVER
        }
    }
}