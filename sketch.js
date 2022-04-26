let game = null;

function setup() {
    createCanvas(800, 400);
    game = new SnakeGame();
}

function draw() {

    game.Update();
}