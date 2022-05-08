let game = null;

function setup() {
    createCanvas(800, 400);

    game = new MissileCommand();
}

function draw() {
    game.Update();
}