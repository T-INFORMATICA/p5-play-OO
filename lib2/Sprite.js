class Sprite2 {
    /**
    * The sprite's position at the beginning of the last update as a vector (x,y).
    * @property previousPosition
    * @type {p5.Vector}
    */
    #position;
    /*
    The sprite's position at the end of the last update as a vector (x,y).
    Note: this.#will differ from position whenever the position is changed
    directly by assignment.
    */
    #previousPosition;
    #newPosition;
    //Position displacement on the x coordinate since the last update
    #deltaX = 0;
    #deltaY = 0;
    
    /**
    * Determines the rendering order within a group: a sprite with
    * lower depth will appear below the ones with higher depth.
    *
    * Note: drawing a group before another with drawSprites will make
    * its members appear below the second one, like in normal p5 canvas
    * drawing.
    *
    * @property depth
    * @type {Number}
    * @default One more than the greatest existing sprite depth, when calling
    *          createSprite().  When calling new Sprite() directly, depth will
    *          initialize to 0 (not recommended).
    */
    #depth = 0;
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
    #maxSpeed = -1;

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
    #friction = 0;
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
    #touching = {
        left: false,
        right: false,
        top: false,
        bottom: false
    };

    /**
    * The mass determines the velocity transfer when sprites bounce
    * against each other.# See Sprite.bounce
    * The higher the mass the least the sprite will be affected by collisions.
    *
    * @property mass
    * @type {Number}
    * @default 1
    */
    #mass = 1;

    /**
    * If set to true the sprite won't bounce or be displaced by collisions
    * Simulates an infinite mass or an anchored object.
    *
    * @property immovable
    * @type {Boolean}
    * @default false
    */
    #immovable = false;

    //Coefficient of restitution - velocity lost in the bouncing
    //0 perfectly inelastic , 1 elastic, > 1 hyper elastic

    /**
    * Coefficient of restitution. The velocity lost after bouncing.
    * 1: perfectly elastic, no energy is lost
    * 0: perfectly inelastic, no bouncing
    * less than 1: inelastic, this.#is the most common in nature
    * greater than 1: hyper elastic, energy is increased like in a pinball bumper
    *
    * @property restitution
    * @type {Number}
    * @default 1
    */
    #restitution = 1;
    /**
    * The sprite's visibility.
    *
    * @property visible
    * @type {Boolean}
    * @default true
    */
    #visible = true;

    /*
    * Width of the sprite's current image.
    * If no images or animations are set it's the width of the
    * placeholder rectangle.
    * Used internally to make calculations and draw the sprite.
    *
    * @private
    * @property _internalWidth
    * @type {Number}
    * @default 100
    */
    #internalWidth;

    /*
    * Height of the sprite's current image.
    * If no images or animations are set it's the height of the
    * placeholder rectangle.
    * Used internally to make calculations and draw the sprite.
    *
    * @private
    * @property _internalHeight
    * @type {Number}
    * @default 100
    */
    #internalHeight;

    /**
    * Unscaled width of the sprite
    * If no images or animations are set it's the width of the
    * placeholder rectangle.
    *
    * @property originalWidth
    * @type {Number}
    * @default 100
    */
    #originalWidth = 100;
    /**
    * Unscaled height of the sprite
    * If no images or animations are set it's the height of the
    * placeholder rectangle.
    *
    * @property originalHeight
    * @type {Number}
    * @default 100
    */
    #originalHeight = 100;
    /**
    * True if the sprite has been removed.
    *
    * @property removed
    * @type {Boolean}
    */
    #removed = false;
    /**
    * Cycles before self removal.
    * Set it to initiate a countdown, every draw cycle the property is
    * reduced by 1 unit. At 0 it will call a sprite.remove()
    * Disabled if set to -1.
    *
    * @property life
    * @type {Number}
    * @default -1
    */
    #life = -1;
    /**
    * If set to true, draws an outline of the collider, the depth, and center.
    *
    * @property debug
    * @type {Boolean}
    * @default false
    */
    #debug = false;
    /**
    * If no image or animations are set this.#is color of the
    * placeholder rectangle
    *
    * @property shapeColor
    * @type {color}
    */
    #shapeColor = color(random(255), random(255), random(255));
    /**
    * Groups the sprite belongs to, including allSprites
    *
    * @property groups
    * @type {Array}
    */
    #groups = [];
    /**
    * Reference to the current animation.
    *
    * @property animation
    * @type {SpriteAnimation}
    */
    #animation = undefined;
    constructor(x, y, width, height) {
        this.#position = createVector(x, y);
        this.#previousPosition = createVector(x, y);
        this.#newPosition = createVector(x, y);

        this.Width = width;
        this.Height = height;
        this.#internalWidth = width;
        this.#internalHeight = height;
        this.#originalWidth = this.#internalWidth;
        this.#originalHeight = this.#internalHeight;

        this.#velocity = createVector(0, 0);
    }

    set Debug(value) {
        this.#debug = value;
    }

    set Depth(value) {
        this.#depth = value;
    }

    get Width() {
        return this.#internalWidth;
    }

    set Width(value) {
        this.#internalWidth = value;
    }

    get Height() {
        return this.#internalHeight;
    }

    set Height(value) {
        this.#internalHeight = value;
    }

    SetVelocity(x, y) {
        this.#velocity.x = x;
        this.#velocity.y = y;
    }

    get Velocity() { 
        return this.#velocity;
    }

    /**
    * Calculates the scalar speed.
    *
    * @method getSpeed
    * @return {Number} Scalar speed
    */
    get Speed() {
        return this.#velocity.mag();
    };

    get Position() { 
        return this.#position;
    }

    get Direction() {
        let direction = atan2(this.#velocity.y, this.#velocity.x);

        if (isNaN(direction))
            direction = 0;

        return direction;
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
        let a;
        if (typeof angle === 'undefined') {
            if (this.#velocity.x !== 0 || this.#velocity.y !== 0) {
                a = pInst.atan2(this.#velocity.y, this.#velocity.x);
            }
            // else {
                // if (pInst._angleMode === pInst.RADIANS) {
                //     a = radians(this.#rotation);
                // } else {
                //     a = this.#rotation;
                // }
            // }
        } else {
            a = radians(angle);
        }
        this.#velocity.x = cos(a) * speed;
        this.#velocity.y = sin(a) * speed;
    }


    SetAttractionPoint(magnitude, pointX, pointY) {
        let angle = atan2(pointY - this.#position.y, pointX - this.#position.x);
        this.#velocity.x += cos(angle) * magnitude;
        this.#velocity.y += sin(angle) * magnitude;
    };

    OverlapPoint(pointX, pointY) {
        let point = createVector(pointX, pointY);

        if (!this.#collider)
            this.SetDefaultCollider();

        if (this.#collider !== undefined) {
            if (this.#collider instanceof AABBCollider)
                return (
                    point.x > this.#collider.left() &&
                    point.x < this.#collider.right() &&
                    point.y > this.#collider.top() &&
                    point.y < this.#collider.bottom());
            if (this.#collider instanceof CircleCollider) {
                let sqRadius = this.#collider.radius * this.#collider.radius;
                let sqDist = pow(this.#collider.center.x - point.x, 2) + pow(this.#collider.center.y - point.y, 2);
                return sqDist < sqRadius;
            }
            else
                return false;
        }
        else
            return false;
    }

    /**
    * Checks if the the sprite is overlapping another sprite or a group.
    * The check is performed using the colliders. If colliders are not set
    * they will be created automatically from the image/animation bounding box.
    *
    * A callback function can be specified to perform additional operations
    * when the overlap occours.
    * If the target is a group the function will be called for each single
    * sprite overlapping. The parameter of the function are respectively the
    * current sprite and the colliding sprite.
    *
    * @example
    *     sprite.overlap(otherSprite, explosion);
    *
    *     function explosion(spriteA, spriteB) {
    *       spriteA.remove();
    *       spriteB.score++;
    *     }
    *
    * @method overlap
    * @param {Object} target Sprite or group to check against the current one
    * @param {Function} [callback] The function to be called if overlap is positive
    * @return {Boolean} True if overlapping
    */
    Overlap(target, callback) {
        //if(this.#collider instanceof AABB && target.collider instanceof AABB)
        return this.#AABBops('overlap', target, callback);
    }

    AddSpeed(speed, angle) {
        let a = radians(angle);
        this.#velocity.x += cos(a) * speed;
        this.#velocity.y += sin(a) * speed;
    };

    /**
    * Checks if the the sprite is overlapping another sprite or a group.
    * If the overlap is positive the current sprite will be displace by
    * the colliding one in the closest non-overlapping position.
    *
    * The check is performed using the colliders. If colliders are not set
    * they will be created automatically from the image/animation bounding box.
    *
    * A callback function can be specified to perform additional operations
    * when the collision occours.
    * If the target is a group the function will be called for each single
    * sprite colliding. The parameter of the function are respectively the
    * current sprite and the colliding sprite.
    *
    * @example
    *     sprite.collide(otherSprite, explosion);
    *
    *     function explosion(spriteA, spriteB) {
    *       spriteA.remove();
    *       spriteB.score++;
    *     }
    *
    * @method collide
    * @param {Object} target Sprite or group to check against the current one
    * @param {Function} [callback] The function to be called if overlap is positive
    * @return {Boolean} True if overlapping
    */
    Collide(target, callback) {
        //if(this.#collider instanceof AABB && target.collider instanceof AABB)
        return this.#AABBops('collide', target, callback);
    };

    #AABBops(type, target, callback) {

        this.#touching.left = false;
        this.#touching.right = false;
        this.#touching.top = false;
        this.#touching.bottom = false;

        let result = false;

        //if single sprite turn into array anyway
        let others = [];

        if (target instanceof Sprite2)
            others.push(target);
        else if (target instanceof Array) {
            if (quadTree !== undefined && quadTree.active)
                others = quadTree.retrieveFromGroup(this, target);

            if (others.length === 0)
                others = target;

        }
        else
            throw ('Error: overlap can only be checked between sprites or groups');

        for (let i = 0; i < others.length; i++)
            if (this !== others[i] && !this.#removed) //you can check collisions within the same group but not on itself
            {
                let displacement;
                let other = others[i];

                if (this.#collider === undefined)
                    this.SetDefaultCollider();

                if (other.#collider === undefined)
                    other.SetDefaultCollider();

                /*
                if(this.#colliderType=="default" && animations[currentAnimation]!=null)
                {
                  print("busted");
                  return false;
                }*/
                if (this.#collider !== undefined && other.#collider !== undefined) {
                    if (type === 'overlap') {
                        let over;

                        //if the other is a circle I calculate the displacement from here
                        if (this.#collider instanceof CircleCollider)
                            over = other.#collider.overlap(this.#collider);
                        else
                            over = this.#collider.overlap(other.#collider);

                        if (over) {

                            result = true;

                            if (callback !== undefined && typeof callback === 'function')
                                callback.call(this, this, other);
                        }
                    }
                    else if (type === 'collide' || type === 'displace' || type === 'bounce') {
                        displacement = createVector(0, 0);

                        //if the sum of the speed is more than the collider i may
                        //have a tunnelling problem
                        let tunnelX = abs(this.#velocity.x - other.#velocity.x) >= other.#collider.Extents.x / 2 && round(this.#deltaX - this.#velocity.x) === 0;

                        let tunnelY = abs(this.#velocity.y - other.#velocity.y) >= other.#collider.Size.y / 2 && round(this.#deltaY - this.#velocity.y) === 0;


                        if (tunnelX || tunnelY) {
                            //instead of using the colliders I use the bounding box
                            //around the previous position and current position
                            //this is regardless of the collider type

                            //the center is the average of the coll centers
                            let c = createVector(
                                (this.#position.x + this.#previousPosition.x) / 2,
                                (this.#position.y + this.#previousPosition.y) / 2);

                            //the extents are the distance between the coll centers
                            //plus the extents of both
                            let e = createVector(
                                abs(this.#position.x - this.#previousPosition.x) + this.#collider.Extents.x,
                                abs(this.#position.y - this.#previousPosition.y) + this.#collider.Extents.y);

                            let bbox = new AABBCollider(c, e, this.#collider.offset);

                            //bbox.draw();

                            if (bbox.Overlap(other.#collider)) {
                                if (tunnelX) {

                                    //entering from the right
                                    if (this.#velocity.x < 0)
                                        displacement.x = other.#collider.right() - this.#collider.left() + 1;
                                    else if (this.#velocity.x > 0)
                                        displacement.x = other.#collider.left() - this.#collider.right() - 1;
                                }

                                if (tunnelY) {
                                    //from top
                                    if (this.#velocity.y > 0)
                                        displacement.y = other.#collider.Top - this.#collider.Bottom - 1;
                                    else if (this.#velocity.y < 0)
                                        displacement.y = other.#collider.Bottom - this.#collider.Top + 1;

                                }

                            }//end overlap

                        }
                        else //non tunnel overlap
                        {

                            //if the other is a circle I calculate the displacement from here
                            //and reverse it
                            if (this.#collider instanceof CircleCollider) {
                                displacement = other.#collider.Collide(this.#collider).mult(-1);
                            }
                            else
                                displacement = this.#collider.Collide(other.#collider);

                        }

                        if (displacement.x !== 0 || displacement.y !== 0) {
                            let newVelX1, newVelY1, newVelX2, newVelY2;

                            if (type === 'displace' && !other.#immovable) {
                                other.#position.sub(displacement);
                            } else if ((type === 'collide' || type === 'bounce') && !this.#immovable) {
                                this.#position.add(displacement);
                                this.#previousPosition = createVector(this.#position.x, this.#position.y);
                                this.#newPosition = createVector(this.#position.x, this.#position.y);
                            }

                            if (displacement.x > 0)
                                this.#touching.left = true;
                            if (displacement.x < 0)
                                this.#touching.right = true;
                            if (displacement.y < 0)
                                this.#touching.bottom = true;
                            if (displacement.y > 0)
                                this.#touching.top = true;

                            if (type === 'bounce') {
                                if (this.#collider instanceof CircleCollider && other.#collider instanceof CircleCollider) {
                                    let dx1 = p5.Vector.sub(this.#position, other.#position);
                                    let dx2 = p5.Vector.sub(other.#position, this.#position);
                                    let magnitude = dx1.magSq();
                                    let totalMass = this.#mass + other.#mass;
                                    let m1 = 0, m2 = 0;
                                    if (this.#immovable) {
                                        m2 = 2;
                                    } else if (other.#immovable) {
                                        m1 = 2;
                                    } else {
                                        m1 = 2 * other.#mass / totalMass;
                                        m2 = 2 * this.#mass / totalMass;
                                    }
                                    let newVel1 = dx1.mult(m1 * p5.Vector.sub(this.#velocity, other.#velocity).dot(dx1) / magnitude);
                                    let newVel2 = dx2.mult(m2 * p5.Vector.sub(other.#velocity, this.#velocity).dot(dx2) / magnitude);

                                    this.#velocity.sub(newVel1.mult(this.#restitution));
                                    other.#velocity.sub(newVel2.mult(other.#restitution));
                                }
                                else {
                                    if (other.#immovable) {
                                        newVelX1 = -this.#velocity.x + other.#velocity.x;
                                        newVelY1 = -this.#velocity.y + other.#velocity.y;
                                    }
                                    else {
                                        newVelX1 = (this.#velocity.x * (this.#mass - other.#mass) + (2 * other.#mass * other.#velocity.x)) / (this.#mass + other.#mass);
                                        newVelY1 = (this.#velocity.y * (this.#mass - other.#mass) + (2 * other.#mass * other.#velocity.y)) / (this.#mass + other.#mass);
                                        newVelX2 = (other.#velocity.x * (other.#mass - this.#mass) + (2 * this.#mass * this.#velocity.x)) / (this.#mass + other.#mass);
                                        newVelY2 = (other.#velocity.y * (other.#mass - this.#mass) + (2 * this.#mass * this.#velocity.y)) / (this.#mass + other.#mass);
                                    }

                                    //let bothCircles = (this.#collider instanceof CircleCollider &&
                                    //                   other.#collider  instanceof CircleCollider);

                                    //if(this.#touching.left || this.#touching.right || this.#collider instanceof CircleCollider)

                                    //print(displacement);

                                    if (abs(displacement.x) > abs(displacement.y)) {


                                        if (!this.#immovable) {
                                            this.#velocity.x = newVelX1 * this.#restitution;

                                        }

                                        if (!other.#immovable)
                                            other.#velocity.x = newVelX2 * other.#restitution;

                                    }
                                    //if(this.#touching.top || this.#touching.bottom || this.#collider instanceof CircleCollider)
                                    if (abs(displacement.x) < abs(displacement.y)) {

                                        if (!this.#immovable)
                                            this.#velocity.y = newVelY1 * this.#restitution;

                                        if (!other.#immovable)
                                            other.#velocity.y = newVelY2 * other.#restitution;
                                    }
                                }
                            }
                            //else if(type == "collide")
                            //this.#velocity = createVector(0,0);

                            if (callback !== undefined && typeof callback === 'function')
                                callback.call(this, this, other);

                            result = true;
                        }
                    }
                }//end collider exists
            }

        return result;
    }

    /**
    * Checks if the the sprite is overlapping another sprite or a group.
    * If the overlap is positive the sprites will bounce affecting each
    * other's trajectories depending on their .velocity, .mass and .restitution
    *
    * The check is performed using the colliders. If colliders are not set
    * they will be created automatically from the image/animation bounding box.
    *
    * A callback function can be specified to perform additional operations
    * when the collision occours.
    * If the target is a group the function will be called for each single
    * sprite colliding. The parameter of the function are respectively the
    * current sprite and the colliding sprite.
    *
    * @example
    *     sprite.bounce(otherSprite, explosion);
    *
    *     function explosion(spriteA, spriteB) {
    *       spriteA.remove();
    *       spriteB.score++;
    *     }
    *
    * @method bounce
    * @param {Object} target Sprite or group to check against the current one
    * @param {Function} [callback] The function to be called if overlap is positive
    * @return {Boolean} True if overlapping
    */
    Bounce(target, callback) {
        return this.#AABBops('bounce', target, callback);
    };

    /**
    * Adds the sprite to an existing group
    *
    * @method addToGroup
    * @param {Object} group
    */
    AddToGroup(group) {
        if (group instanceof Array)
            group.add(this);
        else
            print('addToGroup error: ' + group + ' is not a group');
    };

    Remove() {
        this.#removed = true;

        quadTree.removeObject(this);

        //when removed from the "scene" also remove all the references in all the groups
        while (this.#groups.length > 0) {
            this.#groups[0].remove(this);
        }
    }

    Update() {
        noStroke();
        fill(this.#shapeColor);
        rect(0, 0, this.#internalWidth, this.#internalHeight);
    }

    #PreUpdate() {
        if (!this.#removed) {
            //if there has been a change somewhere after the last update
            //the old position is the last position registered in the update
            if (this.#newPosition !== this.#position)
                this.#previousPosition = createVector(this.#newPosition.x, this.#newPosition.y);
            else
                this.#previousPosition = createVector(this.#position.x, this.#position.y);

            // this.#velocity.x *= 1 - this.#friction;
            // this.#velocity.y *= 1 - this.#friction;

            if (this.#maxSpeed !== -1)
                this.LimitSpeed(this.#maxSpeed);

            // this.#rotation += this.#rotationSpeed;

            this.#position.x += this.#velocity.x;
            this.#position.y += this.#velocity.y;

            this.#newPosition = createVector(this.#position.x, this.#position.y);

            this.#deltaX = this.#position.x - this.#previousPosition.x;
            this.#deltaY = this.#position.y - this.#previousPosition.y;

            //self destruction countdown
            if (this.#life > 0)
                this.#life--;
            if (this.#life === 0)
                this.Remove();
        }
    }

    SetDefaultCollider() {
        //if has animation get the animation bounding box
        //working only for preloaded images
        // if (animations[currentAnimation] && (animations[currentAnimation].getWidth() !== 1 && animations[currentAnimation].getHeight() !== 1)) {
        //     this.#collider = this.GetBoundingBox();
        //     // this.#internalWidth = animations[currentAnimation].getWidth() * abs(this.GetScaleX());
        //     // this.#internalHeight = animations[currentAnimation].getHeight() * abs(this.GetScaleY());
        //     //quadTree.insert(this.#;
        //     this.#colliderType = 'image';
        //     //print("IMAGE COLLIDER ADDED");
        // }
        // else if (animations[currentAnimation] && animations[currentAnimation].getWidth() === 1 && animations[currentAnimation].getHeight() === 1) {
        //     //animation is still loading
        //     //print("wait");
        // }
        // else //get the with and height defined at the creation
        // {
            this.#collider = new AABBCollider(this.#position, createVector(this.#internalWidth, this.#internalHeight));
            //quadTree.insert(this.#;
            this.#colliderType = 'default';
        // }

        // pInst.quadTree.insert(this);
    }

    /**
    * Sets a collider for the sprite.
    *
    * In p5.play a Collider is an invisible circle or rectangle
    * that can have any size or position relative to the sprite and which
    * will be used to detect collisions and overlapping with other sprites,
    * or the mouse cursor.
    *
    * If the sprite is checked for collision, bounce, overlapping or mouse events
    * a collider is automatically created from the width and height parameter
    * passed at the creation of the sprite or the from the image dimension in case
    * of animated sprites.
    *
    * Often the image bounding box is not appropriate as the active area for
    * collision detection so you can set a circular or rectangular sprite with
    * different dimensions and offset from the sprite's center.
    *
    * There are four ways to call this.#method:
    *
    * 1. setCollider("rectangle")
    * 2. setCollider("rectangle", offsetX, offsetY, width, height)
    * 3. setCollider("circle")
    * 4. setCollider("circle", offsetX, offsetY, radius)
    *
    * @method setCollider
    * @param {String} type Either "rectangle" or "circle"
    * @param {Number} offsetX Collider x position from the center of the sprite
    * @param {Number} offsetY Collider y position from the center of the sprite
    * @param {Number} width Collider width or radius
    * @param {Number} height Collider height
    * @throws {TypeError} if given invalid parameters.
    */
    SetCollider(type, offsetX, offsetY, width, height) {
        if (!(type === 'rectangle' || type === 'circle')) {
            throw new TypeError('setCollider expects the first argument to be either "circle" or "rectangle"');
        } else if (type === 'circle' && arguments.length > 1 && arguments.length < 4) {
            throw new TypeError('Usage: setCollider("circle") or setCollider("circle", offsetX, offsetY, radius)');
        } else if (type === 'circle' && arguments.length > 4) {
            pInst._warn('Extra parameters to setCollider were ignored. Usage: setCollider("circle") or setCollider("circle", offsetX, offsetY, radius)');
        } else if (type === 'rectangle' && arguments.length > 1 && arguments.length < 5) {
            throw new TypeError('Usage: setCollider("rectangle") or setCollider("rectangle", offsetX, offsetY, width, height)');
        } else if (type === 'rectangle' && arguments.length > 5) {
            pInst._warn('Extra parameters to setCollider were ignored. Usage: setCollider("rectangle") or setCollider("rectangle", offsetX, offsetY, width, height)');
        }

        this.#colliderType = 'custom';

        let v = createVector(offsetX, offsetY);
        if (type === 'rectangle' && arguments.length === 1) {
            this.#collider = new AABBCollider(pInst, this.#position, createVector(this.Width, this.Height));
        } else if (type === 'rectangle' && arguments.length >= 5) {
            this.#collider = new AABBCollider(pInst, this.#position, createVector(width, height), v);
        } else if (type === 'circle' && arguments.length === 1) {
            this.#collider = new CircleCollider(pInst, this.#position, Math.floor(Math.max(this.Width, this.Height) / 2));
        } else if (type === 'circle' && arguments.length >= 4) {
            this.#collider = new CircleCollider(pInst, this.#position, width, v);
        }

        quadTree.insert(this);
    }

    get BoundingBox() {
        let w = this.Width;
        let h = this.Height;
        // let w = animations[currentAnimation].getWidth() * abs(this.GetScaleX());
        // let h = animations[currentAnimation].getHeight() * abs(this.GetScaleY());

        //if the bounding box is 1x1 the image is not loaded
        //potential issue with actual 1x1 images
        if (w === 1 && h === 1) {
            //not loaded yet
            return new AABBCollider(pInst, this.#position, createVector(w, h));
        }
        else {
            return new AABBCollider(pInst, this.#position, createVector(w, h));
        }
    }

    Display() {
        this.#PreUpdate();
        if (this.#visible && !this.#removed) {
            push();
            colorMode(RGB);

            noStroke();
            rectMode(CENTER);
            ellipseMode(CENTER);
            imageMode(CENTER);

            translate(this.#position.x, this.#position.y);
            // scale(this.GetScaleX() * dirX, this.GetScaleY() * dirY);
            // if (pInst._angleMode === pInst.RADIANS) {
            //     rotate(radians(this.#rotation));
            // } else {
            //     rotate(this.#rotation);
            // }
            this.Update();
            //draw debug info
            pop();

            // this.#drawnWithCamera = camera.active;

            if (this.#debug) {
                push();
                //draw the anchor point
                stroke(0, 255, 0);
                strokeWeight(1);
                line(this.#position.x - 10, this.#position.y, this.#position.x + 10, this.#position.y);
                line(this.#position.x, this.#position.y - 10, this.#position.x, this.#position.y + 10);
                noFill();

                //depth number
                noStroke();
                fill(0, 255, 0);
                textAlign(LEFT, BOTTOM);
                textSize(16);
                text(this.#depth + '', this.#position.x + 4, this.#position.y - 2);

                noFill();
                stroke(0, 255, 0);

                //bounding box
                if (this.#collider !== undefined) {
                    this.#collider.Update();
                }
                pop();
            }

        }
    }
}