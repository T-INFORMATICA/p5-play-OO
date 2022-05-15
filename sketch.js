let player = null;

function setup() {
    createCanvas(800, 400);
    player = new Player(100, 100, 50);
}

function draw() {
    player.Display();
}