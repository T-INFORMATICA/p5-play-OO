class CircleCollider extends Collider {
    #radius;
    #originalRadius;

    constructor(_center, _radius, _offset) {
        super(_center, createVector(_radius * 2, _radius * 2), _offset);
        this.#radius = _radius;
        this.#originalRadius = _radius;
    }

    Update() {
        noFill();
        stroke(0, 255, 0);
        rectMode(CENTER);
        ellipse(this.Center.x + this.Offset.x, this.Center.y + this.Offset.y, this.#radius * 2, this.#radius * 2);
    }

    //should be called only for circle vs circle
    Overlap(other) {
        //square dist
        var r = this.#radius + other.radius;
        r *= r;
        var thisCenterX = this.Center.x + this.Offset.x;
        var thisCenterY = this.Center.y + this.Offset.y;
        var otherCenterX = other.center.x + other.offset.x;
        var otherCenterY = other.center.y + other.offset.y;
        var sqDist = pow(thisCenterX - otherCenterX, 2) + pow(thisCenterY - otherCenterY, 2);
        return r > sqDist;
    }

    //should be called only for circle vs circle
    Collide(other) {
        if (this.Overlap(other)) {
            var thisCenterX = this.Center.x + this.Offset.x;
            var thisCenterY = this.Center.y + this.Offset.y;
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
        return this.Center.x + this.Offset.x - this.#radius;
    }

    get Right() {
        return this.Center.x + this.Offset.x + this.#radius;
    }

    get Top() {
        return this.Center.y + this.Offset.y - this.#radius;
    }

    get Bottom() {
        return this.Center.y + this.Offset.y + this.#radius;
    }
}