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
        this.SetSpeed(this.#speed, angleInDegrees);

        this.SetDefaultCollider();
        this.CollisionLayer = Settings.Layers.MISSILES;

    }

    get IsFriendly() { 
        return this.#isFriendly;
    }

    OnCollide(spritesHit) { 
        spritesHit.forEach(other => {
            if (other instanceof City &&
                this.#isFriendly === false) { 
                new Explosion(this.Position.x, this.Position.y, 100, this.#isFriendly);
                this.Remove();
            }
        });
    }

    Update() { 
        fill(255, 0, 0);
        rect(0, 0, this.Width, this.Height);

        let distance = this.Position.dist(this.#goal);

        if (distance < this.#speed * 2) { 
            new Explosion(this.Position.x, this.Position.y, 100, this.#isFriendly);
            this.Remove();
        }
    }
}