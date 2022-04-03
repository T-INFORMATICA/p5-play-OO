let game = null;

function preload() {
    
}

function setup() {
    createCanvas(800, 400);
    game = new PlatformerGame();
}

function draw() {
    game.Update();
}