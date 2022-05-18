let player = null;
let floors = [];

function setup() {
    createCanvas(400, 400);
    player = new Player(100, 100, 50);

    for (let x = 0; x < 12; ++x) { 
        floors.push(new TileFloor(50 * x, 400, 50));
    }

    let y = 3;
    for (; y > 0; --y) { 
        floors.push(new TileWall(300, 400 - (50 * y), 50));
    }
    floors.push(new TileFloor(300, 425 - (50 * 4), 50));
}

function draw() {
    background("lightblue");
    player.Display();
    floors.forEach(f => f.Display());

    floors.forEach(f => player.Collide(f));
}