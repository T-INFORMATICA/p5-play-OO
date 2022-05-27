class Collider {
    #center;
    #offset;
    #extents;
    #originalExtents;
    #parent;

    #hit = {
        left: false,
        right: false,
        top: false,
        bottom: false
    };

    constructor(_parent, _center, _extents, _offset) {
        this.#parent = _parent;
        this.#center = _center;
        this.#extents = _extents;
        this.#originalExtents = _extents.copy();

        if (_offset === undefined)
            this.#offset = createVector(0, 0);
        else
            this.#offset = _offset;
    }

    get HitLocation() {
        return this.#hit;
    }

    get Center() {
        return this.#center;
    }

    get Extents() {
        return this.#extents;
    }

    get Offset() {
        return this.#offset;
    }

    get Min() {
        return createVector(this.Center.x + this.#offset.x - this.#extents.x, this.Center.y + this.#offset.y - this.#extents.y);
    }

    get Max() {
        return createVector(this.Center.x + this.#offset.x + this.#extents.x, this.Center.y + this.#offset.y + this.#extents.y);
    }

    get Right() {
        return this.Center.x + this.#offset.x + this.#extents.x / 2;
    }

    get Left() {
        return this.Center.x + this.#offset.x - this.#extents.x / 2;
    }

    get Top() {
        return this.Center.y + this.#offset.y - this.#extents.y / 2;
    }

    get Bottom() {
        return this.Center.y + this.#offset.y + this.#extents.y / 2;
    }

    get Size() {
        return createVector(this.#extents.x * 2, this.#extents.y * 2);
    }

    Hit(overlap, ...otherColliders) {
        this.#hit.left = false;
        this.#hit.right = false;
        this.#hit.top = false;
        this.#hit.bottom = false;

        let collidersHit = [];

        if (overlap === true) {
            otherColliders.forEach(otherCollider => {
                if (this !== otherCollider && !this.#parent.Removed) {
                    if (this.Overlap(otherCollider) === true) {
                        collidersHit.push(otherCollider);
                    }
                }
            });
        }
        else {
            otherColliders.forEach(otherCollider => {
                if (this !== otherCollider && !this.#parent.Removed) {
                    let displacement = this.Collide(otherCollider);

                    if (displacement.x !== 0 || displacement.y !== 0) {
                        if (!this.#parent.Immovable) {
                            this.#parent.Displace(displacement);
                        }
                        collidersHit.push(otherCollider);

                        if (displacement.x > 0)
                            this.#hit.left = true;
                        if (displacement.x < 0)
                            this.#hit.right = true;
                        if (displacement.y < 0)
                            this.#hit.bottom = true;
                        if (displacement.y > 0)
                            this.#hit.top = true;
                    }
                }
            });
        }

        return collidersHit.map(collider => collider.#parent);
    }

    Update() {
        noFill();
        stroke(0, 255, 0);
        rectMode(CENTER);
        rect(this.Center.x + this.Offset.x, this.Center.y + this.Offset.y, this.Size.x / 2, this.Size.y / 2);
    }

    Overlap(other) {
        //box vs box
        if (other instanceof Collider && !other.#parent.Removed && !this.#parent.Removed) {
            var md = other.MinkowskiDifference(this);

            if (md.Min.x <= 0 &&
                md.Max.x >= 0 &&
                md.Min.y <= 0 &&
                md.Max.y >= 0) {
                return true;
            }
            else
                return false;
        }
        return false;
        // //box vs circle
        // else if (other instanceof CircleCollider) {

        //     //find closest point to the circle on the box
        //     var pt = createVector(other.Center.x, other.Center.y);

        //     //I don't know what's going o try to trace a line from centers to see
        //     if (other.Center.x < this.left())
        //         pt.x = this.left();
        //     else if (other.Center.x > this.right())
        //         pt.x = this.right();

        //     if (other.Center.y < this.top())
        //         pt.y = this.top();
        //     else if (other.Center.y > this.bottom())
        //         pt.y = this.bottom();

        //     var distance = pt.dist(other.Center);

        //     return distance < other.radius;
        // }
    }

    Collide(other) {
        if (other instanceof Collider) {
            var md = other.MinkowskiDifference(this);

            if (md.Min.x <= 0 &&
                md.Max.x >= 0 &&
                md.Min.y <= 0 &&
                md.Max.y >= 0) {
                var boundsPoint = md.ClosestPointOnBoundsToPoint(createVector(0, 0));

                return boundsPoint;
            }
            else
                return createVector(0, 0);
        }
    }

    MinkowskiDifference(other) {
        var topLeft = this.Min.sub(other.Max);
        var fullSize = this.Size.add(other.Size);
        return new Collider(null, topLeft.add(fullSize.div(2)), fullSize.div(2));
    }


    ClosestPointOnBoundsToPoint(point) {
        // test x first
        var minDist = abs(point.x - this.Min.x);
        var boundsPoint = createVector(this.Min.x, point.y);

        if (abs(this.Max.x - point.x) < minDist) {
            minDist = abs(this.Max.x - point.x);
            boundsPoint = createVector(this.Max.x, point.y);
        }

        if (abs(this.Max.y - point.y) < minDist) {
            minDist = abs(this.Max.y - point.y);
            boundsPoint = createVector(point.x, this.Max.y);
        }

        if (abs(this.Min.y - point.y) < minDist) {
            minDist = abs(this.Min.y - point.y);
            boundsPoint = createVector(point.x, this.Min.y);
        }

        return boundsPoint;
    }
}