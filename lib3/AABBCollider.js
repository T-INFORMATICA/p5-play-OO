class AABBCollider extends Collider {
    constructor(_parent, _center, _extents, _offset) {
        super(_parent, _center, _extents, _offset);
    }

    Update() {
        noFill();
        stroke(0, 255, 0);
        rectMode(CENTER);
        rect(this.Center.x + this.Offset.x, this.Center.y + this.Offset.y, this.Size.x / 2, this.Size.y / 2);
    }

    Overlap(other) {
        //box vs box
        if (other instanceof AABBCollider) {
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
        //box vs circle
        else if (other instanceof CircleCollider) {

            //find closest point to the circle on the box
            var pt = createVector(other.Center.x, other.Center.y);

            //I don't know what's going o try to trace a line from centers to see
            if (other.Center.x < this.left())
                pt.x = this.left();
            else if (other.Center.x > this.right())
                pt.x = this.right();

            if (other.Center.y < this.top())
                pt.y = this.top();
            else if (other.Center.y > this.bottom())
                pt.y = this.bottom();

            var distance = pt.dist(other.Center);

            return distance < other.radius;
        }
    }

    Collide(other) {
        if (other instanceof AABBCollider) {
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
        return new AABBCollider(null, topLeft.add(fullSize.div(2)), fullSize.div(2));
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