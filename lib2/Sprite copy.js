class Sprite3 {
    #position;
    #previousPosition;
    #newPosition;
    #deltaX = 0;
    #deltaY = 0;
    
    #depth = 0;
    #velocity;
    #maxSpeed = -1;

    #collider = undefined;

    #colliderType = 'none';
    #touching = {
        left: false,
        right: false,
        top: false,
        bottom: false
    };

    #mass = 1;

    #immovable = false;

    #restitution = 1;
    #visible = true;

    #internalWidth;

    #internalHeight;

    #removed = false;
    #life = -1;
    #debug = false;
    #shapeColor = color(random(255), random(255), random(255));
    #groups = [];

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
        let a = radians(angle);
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

    AddSpeed(speed, angle) {
        let a = radians(angle);
        this.#velocity.x += cos(a) * speed;
        this.#velocity.y += sin(a) * speed;
    };

    Overlap(target) {
        let result = false;
        result = this.#AABBops('overlap', target);
        if (result)
            this.OnOverlap(target);
        return result;
    }

    OnOverlap(other) { }

    Collide(target) {
        let result = false;
        result = this.#AABBops('collide', target);
        if (result)
            this.OnCollide(target);
        return result;
    }

    OnCollide(other) { }

    #AABBops(type, target) {
        this.#touching.left = false;
        this.#touching.right = false;
        this.#touching.top = false;
        this.#touching.bottom = false;

        let result = false;

        let others = [];

        if (target instanceof Sprite3) {
            others.push(target);
        }
        else if (target instanceof Array) {
            if (others.length === 0) {
                others = target;
            }
        }
        else {
            throw ('Error: overlap can only be checked between sprites or groups');
        }

        for (let i = 0; i < others.length; i++) {
            if (this !== others[i] && !this.#removed) //you can check collisions within the same group but not on itself
            {
                let displacement;
                let other = others[i];

                if (this.#collider === undefined)
                    this.SetDefaultCollider();

                if (other.#collider === undefined)
                    other.SetDefaultCollider();

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
                        }
                    }
                    else if (type === 'collide' || type === 'displace') {
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

                            }
                        }
                        else {
                            //if the other is a circle I calculate the displacement from here
                            //and reverse it
                            if (this.#collider instanceof CircleCollider) {
                                displacement = other.#collider.Collide(this.#collider).mult(-1);
                            }
                            else
                                displacement = this.#collider.Collide(other.#collider);

                        }

                        if (displacement.x !== 0 || displacement.y !== 0) {
                            if (type === 'displace' && !other.#immovable) {
                                other.#position.sub(displacement);
                            } else if ((type === 'collide') && !this.#immovable) {
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

                            result = true;
                        }
                    }
                }
            }
        }
        return result;
    }

    AddToGroup(group) {
        if (group instanceof Array)
            group.add(this);
        else
            print('addToGroup error: ' + group + ' is not a group');
    };

    Remove() {
        this.#removed = true;

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
        this.#collider = new AABBCollider(this.#position, createVector(this.#internalWidth, this.#internalHeight));
        this.#colliderType = 'default';
    }

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
    }

    get BoundingBox() {
        let w = this.Width;
        let h = this.Height;

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
            this.Update();
            //draw debug info
            pop();

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