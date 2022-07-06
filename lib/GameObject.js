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

    /**
     * The location where the collider for this GameObject was hit. (left, right, top, bottom)
     * @return {Collider} The side on which the current collider was hit.
     */
    get Hit() {
        return this.#collider.HitLocation;
    }

    /**
     * Changes the collision layer for this GameObject. The collision layer determines with which other GameObject this GameObject can interact. 
     * collision layers are set in the Settings.js
     * @param {string} value - The side on which the current collider was hit.
     */
    set CollisionLayer(value) {
        GameManager.GetInstance().AddGameObjectToCollisionLayer(this, value);
        this.#collisionLayer = value;
    }

    /**
     * Determines how many frames this GameObject will remain alive (before being removed automatically). 
     * @param {number} value - How many frames this GameObject will remain alive. -1 will keep this GameObject alive indefinite (default).
     */
    set Life(value) {
        this.#life = value;
    }

    /**
     * An immovable object cannot be displaced by another GameObject.
     * @return {Boolean} Returns true if this GameObject is immovable.
     */
    get Immovable() {
        return this.#immovable;
    }

    /**
     * An immovable object cannot be displaced by another GameObject.
     * @param {Boolean} value - set it to true to make this GameObject immovable. False allows it to be displaced on collision with other GameObjects (default).
     */
    set Immovable(value) {
        this.#immovable = value;
    }

    /**
     * When debug is set to true, debug values are shown on screen. (e.g. render-depth, collisionbox, ...)
     * @param {Boolean} value - True to show debug values on screen.
     */
    set Debug(value) {
        this.#debug = value;
    }

    /**
     * The depth value determines the rendering order of each GameObject. GameObjects with identical depth values have no predetermined rendering order.
     * @param {number} value - integer value that represents the rendering order for this GameObject. A higher depth value renders a GameObject on top.
     */
    set Depth(value) {
        this.#depth = value;
    }

    /**
     * The depth value determines the rendering order of each GameObject. GameObjects with identical depth values have no predetermined rendering order.
     * @returns {number} integer value that represents the rendering order for this GameObject. A higher depth value renders a GameObject on top.
     */
    get Depth() {
        return this.#depth;
    }

    /**
     * The index shows in what order a GameObject was added to the game. The first GameObject that was added gets index 0, the next 1, ...
     * @param {number} value - integer value that represents the order in which this GameObject was added to the GameObject.
     */
    set Index(value) {
        this.#index = value;
    }

    /**
     * The width of the GameObject on screen in pixels.
     * @returns {number} The width of this GameObject in pixels.
     */
    get Width() {
        return this.#width;
    }

    /**
     * The width of the GameObject on screen in pixels.
     * @param {number} value - The width of this GameObject in pixels.
     */
    set Width(value) {
        this.#width = value;
    }

    /**
     * The height of the GameObject on screen in pixels.
     * @returns {number} The height of this GameObject in pixels.
     */
    get Height() {
        return this.#height;
    }

    /**
     * The height of the GameObject on screen in pixels.
     * @param {number} value - The height of this GameObject in pixels.
     */
    set Height(value) {
        this.#height = value;
    }

    /**
     * A p5.Vector (x, y) representing the velocity of the GameObject on the X and Y axis.
     * @returns {p5.Vector} returns the current velocity of this GameObject.
     */
    get Velocity() {
        return this.#velocity;
    }

    /**
     * A p5.Vector (x, y) representing the velocity of the GameObject on the X and Y axis.
     * @param {p5.Vector} value - the new current velocity of this GameObject.
     */
    set Velocity(value) {
        this.#velocity.x = value.x;
        this.#velocity.y = value.y;
    }

    /**
     * The speed of this GameObject, the same as the magnitude of the Velocity Vector.
     * @returns {number} The speed of the current GameObject.
     */
    get Speed() {
        return this.#velocity.mag();
    }

    /**
     * A p5.Vector (x, y) that represents the position of the current GameObject on the X and Y axis in pixels.
     * @param {p5.Vector} value - The new position for the GameObject to be rendered at.
     */
    set Position(value) {
        this.#position.x = value.x;
        this.#position.y = value.y;
    }

    /**
     * A p5.Vector (x, y) that represents the position of the current GameObject on the X and Y axis in pixels.
     * @returns {p5.Vector} The position of the current GameObject.
     */
    get Position() {
        return this.#position;
    }

    /**
     * The angle of direction of the velocity vector in radians.
     * @returns {number} The angle of direction of the velocity vector in radians.
     */
    get Direction() {
        let direction = atan2(this.#velocity.y, this.#velocity.x);

        if (isNaN(direction))
            direction = 0;

        return direction;
    }

    /**
     * Moves the GameObject according to a given displacement.
     * @param {p5.Vector} displacement - The displacement vector that determines where and how much the current GameObject should be moved.
     */
    Displace(displacement) {
        this.#position.add(displacement);
        this.#previousPosition = createVector(this.#position.x, this.#position.y);
        this.#newPosition = createVector(this.#position.x, this.#position.y);
    }

    /**
     * Sets a maximum size for the velocity vector. The GameObject cannot move faster than this speed.
     * @param {number} max - The maximum speed at which the GameObject can move when using the Velocity.
     */
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

    /**
     * Sets the speed and direction for the current GameObject.
     * @param {number} speed - The speed at which the GameObject should start moving.
     * @param {number} angle - The angle of direction where the GameObject should move to.
     */
    SetSpeed(speed, angle) {
        let a = radians(angle);
        this.#velocity.x = cos(a) * speed;
        this.#velocity.y = sin(a) * speed;
    }

    /**
     * Adds some speed in a certain direction. 
     * @param {number} speed The speed that should be added to the current speed (determined by the Velocity).
     * @param {number} angle The angle of direction where the GameObject should move to.
     */
    AddSpeed(speed, angle) {
        let a = radians(angle);
        this.#velocity.x += cos(a) * speed;
        this.#velocity.y += sin(a) * speed;
    };

    /**
     * Creates a default collider based on the GameObject's width and height, and assigns it to the current GameObject.
     */
    SetDefaultCollider() {
        this.#collider = new Collider(this, this.#position, createVector(this.Width, this.Height));
    }

    /**
     * Removes the currently set collider from the GameObject. If no collider was set before, this does nothing.
     */
    RemoveCollider() { 
        this.#collider = undefined;
    }

    /**
     * Check if the current GameObject overlaps with any of a list of GameObjects. When it overlaps, OnOverlap gets called.
     * @param  {...any} otherSprites - List of GameObjects. The functions checks which of these GameObjects overlaps with the current GameObject (ignoring itself).
     * @returns true if an overlap was found, false if not
     */
    Overlap(...otherSprites) {
        let spritesHit = this.#collider.Hit(true, ...otherSprites.map(sprite => sprite.#collider)); // the collider hit function needs an array of colliders, not sprites
        if (spritesHit.length > 0)
            this.OnOverlap(spritesHit);
        return spritesHit.length > 0;
    }

    /**
     * Function that gets called when an overlap with this GameObject is detected. Override this function to check for overlaps.
     * @param {GameObject[]} spritesHit - Array of GameObjects that overlap with this GameObject
     */
    OnOverlap(spritesHit) { }

    /**
     * Check if the current GameObject collides with any of a list of GameObjects. When it collides, OnCollide gets called.
     * @param  {...any} otherSprites - List of GameObjects. The functions checks which of these GameObjects collides with the current GameObject (ignoring itself).
     * @returns true if a collision was found, false if not
     */
    Collide(...otherSprites) {
        let spritesHit = this.#collider.Hit(false, ...otherSprites.map(sprite => sprite.#collider)); // the collider hit function needs an array of colliders, not sprites
        if (spritesHit.length > 0)
            this.OnCollide(spritesHit);
        return spritesHit.length > 0;
    }

    /**
     * Function that gets called when a collision with this GameObject is detected. Override this function to check for collisions.
     * @param {GameObject[]} spritesHit - Array of GameObjects that overlap with this GameObject
     */
    OnCollide(spritesHit) { }

    /**
     * Removes the current GameObject from the scene. The GameObject may not be removed from memory instantly, but the Removed property is set to true.
     */
    Remove() {
        this.RemoveCollider();
        this.#removed = true;
        GameManager.GetInstance().RemoveGameObject(this);
        delete this;
    }

    /**
     * Update gets called every frame. Override this function to implement your own visualisations and/or frame-actions (input, movement, ...).
     */
    Update() {
        noStroke();
        fill("magenta");
        rect(0, 0, this.#width, this.#height);
    }

    /**
     * Display gets called every frame, and prepares the GameObject to be drawn correctly. Do not call this directly, or override this!
     */
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

    /**
     * Draws debug information for this GameObject.
     */
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