class Explosion extends GameObject { 
    #objectsHit = [];
    #isFriendly = false;

    constructor(x, y, maxRadius, isFriendly) { 
        super(x, y, 1, 1);
        this.life = maxRadius;
        this.#isFriendly = isFriendly;

        this.setCollider("circle");
    }

    Update() { 
        circle(0, 0, this.width);

        this.width++;
        this.height++;
        
        this.setCollider("circle");
    }

    Overlap(other) { 
        if (this.#objectsHit.includes(other) === true) { 
            return;
        }
        
        if (other instanceof Missile &&
            this.#isFriendly === true && 
            other.IsFriendly === false) { 
            other.remove();
        }

        if (other instanceof City &&
            this.#isFriendly === false) { 
            other.Hit();
        }

        this.#objectsHit.push(other);
    }
}