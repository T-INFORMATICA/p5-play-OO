
class MissileCommand extends Game {
    #cursor = null;
    #cities = [];
    #enemyMissileSpawner = null;
    #gun = null;

    #backgroundImage = null;
    #backgroundImage2 = null;

    constructor() { 
        super();

        this.#cursor = new Cursor(100, 100, 30);
        this.#enemyMissileSpawner = new EnemyMissileSpawner();
        this.#gun = new Gun(400, 350, 50, 50, this.#cursor);
        
        for (let i = 0; i < 4; ++i) { 
            let x = 100 + (i * 200);
            this.#cities.push(new City(x, 360, 66, 50));
        }

        this.#backgroundImage = loadImage('assets/backgroundCastles.png');
        this.#backgroundImage2 = loadImage('assets/backgroundEmpty.png');
    }

    Update() { 
        background(207, 239, 252);

        image(this.#backgroundImage ,   0, 220, 200, 200);
        image(this.#backgroundImage2, 200, 220, 200, 200);
        image(this.#backgroundImage2, 400, 220, 200, 200);
        image(this.#backgroundImage , 600, 220, 200, 200);
    }
}