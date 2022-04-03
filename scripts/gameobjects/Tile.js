class Tile extends GameObject {
    #feet = null;
    constructor(x, y, size) {
        super(x, y, size, size, true);
        this.debug = true;
        this.setCollider("rectangle");
    }
}