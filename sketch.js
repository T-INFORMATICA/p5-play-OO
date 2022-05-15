let player = null;
let floors = [];

function setup() {
    createCanvas(800, 400);
    player = new Player(100, 100, 50);
    floors.push(new TileFloor(100, 200, 50));
}

function draw() {
    background("lightblue");
    player.Display();
    floors.forEach(f => f.Display());

    floors.forEach(f => player.Collide(f, (player, other) => {
        if (other instanceof TileFloor) {
            // if (this.#jumped === false) {
            //     this.#jumpsLeft = 1;
            // }

            if (player.Velocity.y > 0) {
                player.Velocity.y = 0;
            }
        }
    }));
}