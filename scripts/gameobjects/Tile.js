class Tile extends GameObject {
    #feet = null;
    constructor(x, y, w, h) {
        super(x, y, w, h, true);
        // this.debug = true;
        this.setCollider("rectangle");
    }
}