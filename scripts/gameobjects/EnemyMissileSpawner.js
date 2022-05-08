class EnemyMissileSpawner extends MissileSpawner { 
    constructor() { 
        super(0, 0, 0, 0, false);
    }

    Update() { 
        super.Update();

        if (this.Timer > 100) {
            this.ResetTimer();
            
            let randomStartX = random(0, 800);
            let randomGoalX = random(0, 800);
            this.Shoot(randomStartX, 0, randomGoalX, 400);
        }
    }
}