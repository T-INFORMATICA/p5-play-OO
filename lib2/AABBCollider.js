class AABBCollider extends Collider {
    constructor(_center, _extents, _offset) {
        super(_center, _extents, _offset);
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

            if (md.min().x <= 0 &&
                md.max().x >= 0 &&
                md.min().y <= 0 &&
                md.max().y >= 0) {
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

            if (md.min().x <= 0 &&
                md.max().x >= 0 &&
                md.min().y <= 0 &&
                md.max().y >= 0) {
                var boundsPoint = md.closestPointOnBoundsToPoint(createVector(0, 0));

                return boundsPoint;
            }
            else
                return createVector(0, 0);
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
            var a;

            if (distance < other.radius) {
                //reclamp point
                if (pt.x === other.Center.x && pt.y === other.Center.y) {
                    var xOverlap = pt.x - this.Center.x;
                    var yOverlap = pt.y - this.Center.y;


                    if (abs(xOverlap) < abs(yOverlap)) {
                        if (xOverlap > 0)
                            pt.x = this.right();
                        else
                            pt.x = this.left();
                    }
                    else {
                        if (yOverlap < 0)
                            pt.y = this.top();
                        else
                            pt.y = this.bottom();
                    }

                    a = atan2(other.Center.y - pt.y, other.Center.x - pt.x);

                    //fix exceptions
                    if (a === 0) {
                        if (pt.x === this.right()) a = PI;
                        if (pt.y === this.top()) a = PI / 2;
                        if (pt.y === this.bottom()) a = -PI / 2;
                    }
                }
                else {
                    //angle bw point and center
                    a = atan2(pt.y - other.Center.y, pt.x - other.Center.x);
                    //project the normal (line between pt and center) onto the circle
                }

                var d = createVector(pt.x - other.Center.x, pt.y - other.Center.y);
                var displacement = createVector(cos(a) * other.radius - d.x, sin(a) * other.radius - d.y);

                //if(pt.x === other.Center.x && pt.y === other.Center.y)
                //displacement = displacement.mult(-1);

                return displacement;
                //return createVector(0,0);
            }
            else
                return createVector(0, 0);
        }
    }

    MinkowskiDifference(other) {
        var topLeft = this.Min.sub(other.max());
        var fullSize = this.size().add(other.size());
        return new AABBCollider(topLeft.add(fullSize.div(2)), fullSize.div(2));
    }


    ClosestPointOnBoundsToPoint(point) {
        // test x first
        var minDist = abs(point.x - this.Min.x);
        var boundsPoint = createVector(this.Min.x, point.y);

        if (abs(this.max().x - point.x) < minDist) {
            minDist = abs(this.max().x - point.x);
            boundsPoint = createVector(this.max().x, point.y);
        }

        if (abs(this.max().y - point.y) < minDist) {
            minDist = abs(this.max().y - point.y);
            boundsPoint = createVector(point.x, this.max().y);
        }

        if (abs(this.Min.y - point.y) < minDist) {
            minDist = abs(this.Min.y - point.y);
            boundsPoint = createVector(point.x, this.Min.y);
        }

        return boundsPoint;
    }
}