class Tile extends GameObject {
    #floorTexture = undefined;
    #groundTexture = undefined;
    constructor(gridX, gridY, gridW, gridH) {
        let x = ((gridX + (gridW / 2)) * Settings.GridSize);
        let y = ((gridY + (gridH / 2)) * Settings.GridSize);
        let w = gridW * Settings.GridSize;
        let h = gridH * Settings.GridSize;
        super(x, y, w, h);

        this.SetDefaultCollider();
        this.CollisionLayer = Settings.Layers.GROUND;

        loadImage("assets/images/grassHalfMid.png", src => {
            this.#floorTexture = createFillImage(src, this.Width, Settings.GridSize / 2, Settings.GridSize, Settings.GridSize / 2);
        });
        loadImage("assets/images/grassCenter.png", src => {
            this.#groundTexture = createFillImage(src, this.Width, this.Height, Settings.GridSize, Settings.GridSize);
        });
    }

    Update() {
        if (this.#groundTexture) {
            image(this.#groundTexture, 0, 0, this.Width, this.Height);
        }
        if (this.#floorTexture) {
            image(this.#floorTexture, 0, (-this.Height / 2) + Settings.GridSize / 4, this.Width, Settings.GridSize / 2);
        }
        strokeWeight(4);
        stroke("rgba(0, 0, 0, .1)");
        line((-this.Width / 2) + 2, (-this.Height / 2) + 4, (-this.Width / 2) + 2, (this.Height / 2) - 4);
    }
}