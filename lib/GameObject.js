/** Class representing an object in your game. */
class GameObject {
    #width = 100;
    #height = 100;

    #position;
    #previousPosition;
    #newPosition;
    #deltaPosition;

    #index = 0;
    #depth = 0;
    #life = -1;
    #visible = true;
    #debug = false;
    #removed = false;

    #velocity;
    #maxSpeed = -1;
    #immovable = false;
    #collider = undefined;
    #collisionLayer = undefined;

    /** 
     * Create a GameObject
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} width - The width of the GameObject
     * @param {number} height - The height of the GameObject
     */
    constructor(x, y, width, height) {
        this.#position = createVector(x, y);
        this.#previousPosition = createVector(x, y);
        this.#newPosition = createVector(x, y);
        this.#deltaPosition = createVector(0, 0);

        this.Width = width;
        this.Height = height;
        this.#width = width;
        this.#height = height;

        this.#velocity = createVector(0, 0);

        GameManager.GetInstance().AddGameObject(this);
    }

    /**
     * Property to check if the GameObject was removed from the scene
     * @return {boolean} true if the GameObject was removed from the scene
     */
    get Removed() { 
        return this.#removed;
    }

    /**
     * The collider that is currently used on this GameObject
     * @return {Collider} The collider for this GameObject
     */
    get Collider() { 
        return this.#collider;
    }

    get Hit() {
        return this.#collider.HitLocation;
    }

    set CollisionLayer(value) {
        GameManager.GetInstance().AddGameObjectToCollisionLayer(this, value);
        this.#collisionLayer = value;
    }

    set Life(value) {
        this.#life = value;
    }

    get Immovable() {
        return this.#immovable;
    }

    set Immovable(value) {
        this.#immovable = value;
    }

    set Debug(value) {
        this.#debug = value;
    }

    set Depth(value) {
        this.#depth = value;
    }

    get Depth() {
        return this.#depth;
    }

    set Index(value) {
        this.#index = value;
    }

    get Width() {
        return this.#width;
    }

    set Width(value) {
        this.#width = value;
    }

    get Height() {
        return this.#height;
    }

    set Height(value) {
        this.#height = value;
    }

    get Velocity() {
        return this.#velocity;
    }

    set Velocity(value) {
        this.#velocity.x = value.x;
        this.#velocity.y = value.y;
    }

    get Speed() {
        return this.#velocity.mag();
    }

    set Position(value) {
        this.#position.x = value.x;
        this.#position.y = value.y;
    }

    get Position() {
        return this.#position;
    }

    get Direction() {
        let direction = atan2(this.#velocity.y, this.#velocity.x);

        if (isNaN(direction))
            direction = 0;

        return direction;
    }

    Displace(displacement) {
        this.#position.add(displacement);
        this.#previousPosition = createVector(this.#position.x, this.#position.y);
        this.#newPosition = createVector(this.#position.x, this.#position.y);
    }

    LimitSpeed(max) {
        //update linear speed
        let speed = this.Speed;

        if (abs(speed) > max) {
            //find reduction factor
            let k = max / abs(speed);
            this.#velocity.x *= k;
            this.#velocity.y *= k;
        }
    }

    SetSpeed(speed, angle) {
        let a = radians(angle);
        this.#velocity.x = cos(a) * speed;
        this.#velocity.y = sin(a) * speed;
    }

    AddSpeed(speed, angle) {
        let a = radians(angle);
        this.#velocity.x += cos(a) * speed;
        this.#velocity.y += sin(a) * speed;
    };

    SetDefaultCollider() {
        this.#collider = new Collider(this, this.#position, createVector(this.Width, this.Height));
    }

    RemoveCollider() { 
        this.#collider = undefined;
    }

    Overlap(...otherSprites) {
        let spritesHit = this.#collider.Hit(true, ...otherSprites.map(sprite => sprite.#collider)); // the collider hit function needs an array of colliders, not sprites
        if (spritesHit.length > 0)
            this.OnOverlap(spritesHit);
        return spritesHit.length > 0;
    }

    OnOverlap(spritesHit) { }

    Collide(...otherSprites) {
        let spritesHit = this.#collider.Hit(false, ...otherSprites.map(sprite => sprite.#collider)); // the collider hit function needs an array of colliders, not sprites
        if (spritesHit.length > 0)
            this.OnCollide(spritesHit);
        return spritesHit.length > 0;
    }

    OnCollide(spritesHit) { }

    Remove() {
        this.RemoveCollider();
        this.#removed = true;
        GameManager.GetInstance().RemoveGameObject(this);
        delete this;
    }

    Update() {
        noStroke();
        fill("magenta");
        rect(0, 0, this.#width, this.#height);
    }

    Display() {
        if (this.#visible && !this.#removed) {
            if (this.Collider) { 
                this.Collider.UpdateCollider();   
            }
            //if there has been a change somewhere after the last update
            //the old position is the last position registered in the update
            if (this.#newPosition !== this.#position)
                this.#previousPosition = createVector(this.#newPosition.x, this.#newPosition.y);
            else
                this.#previousPosition = createVector(this.#position.x, this.#position.y);

            if (this.#maxSpeed !== -1)
                this.LimitSpeed(this.#maxSpeed);

            this.#position.x += this.#velocity.x;
            this.#position.y += this.#velocity.y;

            this.#newPosition = createVector(this.#position.x, this.#position.y);

            this.#deltaPosition.x = this.#position.x - this.#previousPosition.x;
            this.#deltaPosition.y = this.#position.y - this.#previousPosition.y;

            //self destruction countdown
            if (this.#life > 0)
                this.#life--;
            if (this.#life === 0)
                this.Remove();

            push();

            colorMode(RGB);
            noStroke();
            rectMode(CENTER);
            ellipseMode(CENTER);
            imageMode(CENTER);

            translate(this.#position.x, this.#position.y);
            this.Update();
            pop();

            //draw debug info
            if (Settings.Debug || this.#debug) {
                this.#DrawDebugInfo();
            }

        }
    }

    #DrawDebugInfo() {
        let ctx = document.querySelector("canvas").getContext("2d");
        ctx.save();

        let pos = this.Collider ? this.Collider.Center : this.Position;
        let w = this.Collider ? this.Collider.Size.x / 2 : 0;
        let h = this.Collider ? this.Collider.Size.y / 2 : 0;

        ctx.lineWidth = 2;
        ctx.strokeStyle = "#00FF00";
        ctx.strokeRect(pos.x - w / 2, pos.y - h / 2, w, h);

        ctx.beginPath();
        ctx.moveTo(pos.x - 10, pos.y);
        ctx.lineTo(pos.x + 10, pos.y);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y - 10);
        ctx.lineTo(pos.x, pos.y + 10);
        ctx.stroke();

        ctx.fillStyle = "#00FF00";
        ctx.font = '16px sans-serif';
        ctx.fillText(this.#index + '', pos.x + 4, pos.y - 2);
        ctx.fillText(this.#depth + '', pos.x + 4, pos.y + 15);

        ctx.restore();
    }
}