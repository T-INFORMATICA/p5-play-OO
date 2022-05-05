class CircleCollider {
    #center;
    #radius;
    #originalRadius;
    #offset;
    #extents;

    constructor(_center, _radius, _offset) {
        this.#center = _center;
        this.#radius = _radius;
        this.#originalRadius = _radius;

        if (_offset === undefined)
            this.#offset = createVector(0, 0);
        else
            this.#offset = _offset;
        this.#extents = createVector(_radius * 2, _radius * 2);
    }

    Update() {
        noFill();
        stroke(0, 255, 0);
        rectMode(CENTER);
        ellipse(this.#center.x + this.#offset.x, this.#center.y + this.#offset.y, this.#radius * 2, this.#radius * 2);
    }

    //should be called only for circle vs circle
    Overlap(other) {
        //square dist
        var r = this.#radius + other.radius;
        r *= r;
        var thisCenterX = this.#center.x + this.#offset.x;
        var thisCenterY = this.#center.y + this.#offset.y;
        var otherCenterX = other.center.x + other.offset.x;
        var otherCenterY = other.center.y + other.offset.y;
        var sqDist = pow(thisCenterX - otherCenterX, 2) + pow(thisCenterY - otherCenterY, 2);
        return r > sqDist;
    }

    //should be called only for circle vs circle
    Collide(other) {
        if (this.#overlap(other)) {
            var thisCenterX = this.#center.x + this.#offset.x;
            var thisCenterY = this.#center.y + this.#offset.y;
            var otherCenterX = other.center.x + other.offset.x;
            var otherCenterY = other.center.y + other.offset.y;
            var a = pInst.atan2(thisCenterY - otherCenterY, thisCenterX - otherCenterX);
            var radii = this.#radius + other.radius;
            var intersection = abs(radii - dist(thisCenterX, thisCenterY, otherCenterX, otherCenterY));

            var displacement = createVector(pInst.cos(a) * intersection, pInst.sin(a) * intersection);

            return displacement;
        } else {
            return createVector(0, 0);
        }
    }

    get Size() {
        return createVector(this.#radius * 2, this.#radius * 2);
    }

    get Left() {
        return this.#center.x + this.#offset.x - this.#radius;
    }

    get Right() {
        return this.#center.x + this.#offset.x + this.#radius;
    }

    get Top() {
        return this.#center.y + this.#offset.y - this.#radius;
    }

    get Bottom() {
        return this.#center.y + this.#offset.y + this.#radius;
    }
}