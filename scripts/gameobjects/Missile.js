class Missile extends GameObject { 
    #goal = null;
    #speed = 2;
    #isFriendly = false;

    constructor(startX, startY, goalX, goalY, size, isFriendly, speed = 2) { 
        super(startX, startY, size, size);

        this.#goal = createVector(goalX, goalY);
        let direction = p5.Vector.sub(this.#goal,
                                      createVector(startX, startY));
        let angleInRadians = direction.heading();
        let angleInDegrees = degrees(angleInRadians);
        this.#speed = speed;
        this.#isFriendly = isFriendly;
        this.setSpeed(this.#speed, angleInDegrees);

        this.setCollider("rectangle", 0, 0, size, size);
    }

    get IsFriendly() { 
        return this.#isFriendly;
    }

    Overlap(other) { 
        if (other instanceof City &&
            this.#isFriendly === false) { 
            new Explosion(this.position.x, this.position.y, 100, this.#isFriendly);
            this.remove();
        }
    }

    Update() { 
        fill(255, 0, 0);
        rect(0, 0, this.width, this.height);

        let distance = this.position.dist(this.#goal);

        if (distance < this.#speed * 2) { 
            new Explosion(this.position.x, this.position.y, 100, this.#isFriendly);
            this.remove();
        }
    }
}