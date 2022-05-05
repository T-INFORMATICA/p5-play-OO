class Sprite2 {
    /**
    * The sprite's position at the beginning of the last update as a vector (x,y).
    * @property previousPosition
    * @type {p5.Vector}
    */
    #position;
    /*
    The sprite's position at the end of the last update as a vector (x,y).
    Note: this will differ from position whenever the position is changed
    directly by assignment.
    */
    #previousPosition;
    #newPosition;
    //Position displacement on the x coordinate since the last update
    #deltaX;
    #deltaY;
    #width;
    #height;
    #depth;
    /**
    * The sprite's velocity as a vector (x,y)
    * Velocity is speed broken down to its vertical and horizontal components.
    *
    * @property velocity
    * @type {p5.Vector}
    */
    #velocity;
    /**
    * Set a limit to the sprite's scalar speed regardless of the direction.
    * The value can only be positive. If set to -1, there's no limit.
    *
    * @property maxSpeed
    * @type {Number}
    * @default -1
    */
    #maxSpeed;

    /**
    * Friction factor, reduces the sprite's velocity.
    * The friction should be close to 0 (eg. 0.01)
    * 0: no friction
    * 1: full friction
    *
    * @property friction
    * @type {Number}
    * @default 0
    */
    #friction;
    /**
    * The sprite's current collider.
    * It can either be an Axis Aligned Bounding Box (a non-rotated rectangle)
    * or a circular collider.
    * If the sprite is checked for collision, bounce, overlapping or mouse events the
    * collider is automatically created from the width and height
    * of the sprite or from the image dimension in case of animate sprites
    *
    * You can set a custom collider with Sprite.setCollider
    *
    * @property collider
    * @type {Object}
    */
    #collider = undefined;

    //internal use
    //"default" - no image or custom collider is specified, use the shape width / height
    //"custom" - specified with setCollider
    //"image" - no collider is set with setCollider and an image is added
    #colliderType = 'none';
    /**
    * Object containing information about the most recent collision/overlapping
    * To be typically used in combination with Sprite.overlap or Sprite.collide
    * functions.
    * The properties are touching.left, touching.right, touching.top,
    * touching.bottom and are either true or false depending on the side of the
    * collider.
    *
    * @property touching
    * @type {Object}
    */
    #touching = {};
    constructor(x, y, width, height) {
        this.#position = createVector(x, y);
        this.#previousPosition = createVector(x, y);
        this.#newPosition = createVector(x, y);

        this.#deltaX = 0;
        this.#deltaY = 0;

        this.#width = width;
        this.#height = height;

        this.#velocity = createVector(0, 0);

        this.#maxSpeed = -1;
        this.#friction = 0;

        this.#touching.left = false;
        this.#touching.right = false;
        this.#touching.top = false;
        this.#touching.bottom = false;
    }

    set Depth(value) {
        this.#depth = value;
    }

    Remove() { }

    Update() { }
}