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

    get Parent() { 
        return this.#parent;
    }

    get Hit() {
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

        return collidersHit.map(collider => collider.Parent);
    }
}