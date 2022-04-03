let game = null;

function setup() {
    createCanvas(800, 400);
    game = new PlatformerGame();
}

function draw() {
    game.Update();
}