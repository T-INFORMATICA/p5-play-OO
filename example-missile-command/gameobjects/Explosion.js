class Explosion extends GameObject { 
    #objectsHit = [];
    #isFriendly = false;

    constructor(x, y, maxRadius, isFriendly) { 
        super(x, y, 1, 1);
        this.Life = maxRadius;
        this.#isFriendly = isFriendly;

        this.SetDefaultCollider();
        this.CollisionLayer = Settings.Layers.EXPLOSIONS;
    }

    Update() { 
        circle(0, 0, this.Width);

        this.Width++;
        this.Height++;

        if (this.Width > 100) {
            this.Remove();
        }
    }

    OnOverlap(spritesHit) { 
        spritesHit.forEach(spriteHit => {
            if (this.#objectsHit.includes(spriteHit) === true) { 
                return;
            }
            
            if (spriteHit instanceof Missile &&
                this.#isFriendly === true && 
                spriteHit.IsFriendly === false) { 
                spriteHit.Remove();
            }
    
            if (spriteHit instanceof City &&
                this.#isFriendly === false) { 
                spriteHit.Hit();
            }
    
            this.#objectsHit.push(spriteHit);
        });
    }
}