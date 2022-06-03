class MissileSpawner extends GameObject { 
    #timer = 0;
    #isFriendly = false;

    constructor(x, y, width, height, isFriendly) { 
        super(x, y, width, height);
        this.#isFriendly = isFriendly;
    }

    get Timer() { 
        return this.#timer;
    }

    ResetTimer() { 
        this.#timer = 0;
    }

    Update() {
        this.#timer++;
    }

    Shoot(startX, startY, goalX, goalY) { 
        new Missile(startX,
                    startY, 
                    goalX,
                    goalY,
                    5,
                    this.#isFriendly);
    }
}