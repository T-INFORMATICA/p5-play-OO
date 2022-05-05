class AABB {
    #center;
    #offset;
    #extents;
    constructor(_center, _extents, _offset) {
        this.center = _center;
        this.extents = _extents;
        this.originalExtents = _extents.copy();

        if (_offset === undefined)
            this.offset = createVector(0, 0);
        else
            this.offset = _offset;
    }

    get Min ()
    {
      return createVector(this.center.x+this.offset.x - this.extents.x, this.center.y+this.offset.y - this.extents.y);
    }
  
    get Max()
    {
      return createVector(this.center.x+this.offset.x + this.extents.x, this.center.y+this.offset.y + this.extents.y);
    }
  
    get Right()
    {
      return this.center.x+this.offset.x + this.extents.x/2;
    }
  
    get Left()
    {
      return this.center.x+this.offset.x - this.extents.x/2;
    }
  
    get Top()
    {
      return this.center.y+this.offset.y - this.extents.y/2;
    }
  
    get Bottom()
    {
      return this.center.y+this.offset.y + this.extents.y/2;
    }
  
    get Size()
    {
      return createVector(this.extents.x * 2, this.extents.y * 2);
    }
  
    Update()
    {
        noFill();
        stroke(0, 255, 0);
        rectMode(CENTER);
        rect(this.center.x+this.offset.x, this.center.y+this.offset.y, this.size().x/2, this.size().y/2);
    }
  
    Overlap(other)
    {
      //box vs box
      if(other instanceof AABB)
      {
        var md = other.minkowskiDifference(this);
  
        if (md.min().x <= 0 &&
            md.max().x >= 0 &&
            md.min().y <= 0 &&
            md.max().y >= 0)
        {
          return true;
        }
        else
          return false;
      }
      //box vs circle
      else if(other instanceof CircleCollider)
      {
  
        //find closest point to the circle on the box
        var pt = createVector(other.center.x, other.center.y);
  
        //I don't know what's going o try to trace a line from centers to see
        if( other.center.x < this.left() )
          pt.x = this.left();
        else if( other.center.x > this.right())
          pt.x = this.right();
  
        if( other.center.y < this.top() )
          pt.y = this.top();
        else if( other.center.y > this.bottom())
          pt.y = this.bottom();
  
        var distance = pt.dist(other.center);
  
        return distance<other.radius;
      }
    }
  
    Collide(other)
    {
  
      if(other instanceof AABB)
      {
        var md = other.minkowskiDifference(this);
  
        if (md.min().x <= 0 &&
            md.max().x >= 0 &&
            md.min().y <= 0 &&
            md.max().y >= 0)
        {
          var boundsPoint = md.closestPointOnBoundsToPoint(createVector(0, 0));
  
          return boundsPoint;
        }
        else
          return createVector(0, 0);
      }
      //box vs circle
      else if(other instanceof CircleCollider)
      {
  
        //find closest point to the circle on the box
        var pt = createVector(other.center.x, other.center.y);
  
        //I don't know what's going o try to trace a line from centers to see
        if( other.center.x < this.left() )
          pt.x = this.left();
        else if( other.center.x > this.right())
          pt.x = this.right();
  
        if( other.center.y < this.top() )
          pt.y = this.top();
        else if( other.center.y > this.bottom())
          pt.y = this.bottom();
  
  
        var distance = pt.dist(other.center);
        var a;
  
        if(distance<other.radius)
        {
          //reclamp point
          if(pt.x === other.center.x && pt.y === other.center.y)
          {
            var xOverlap = pt.x - this.center.x;
            var yOverlap = pt.y - this.center.y;
  
  
            if(abs(xOverlap) < abs(yOverlap))
            {
              if(xOverlap > 0 )
                pt.x = this.right();
              else
                pt.x = this.left();
            }
            else
            {
              if(yOverlap < 0 )
                pt.y = this.top();
              else
                pt.y = this.bottom();
            }
  
            a = atan2(other.center.y-pt.y, other.center.x-pt.x);
  
            //fix exceptions
            if(a === 0)
            {
              if(pt.x === this.right()) a = PI;
              if(pt.y === this.top()) a = PI/2;
              if(pt.y === this.bottom()) a = -PI/2;
            }
          }
          else
          {
            //angle bw point and center
            a = atan2(pt.y-other.center.y, pt.x-other.center.x);
            //project the normal (line between pt and center) onto the circle
          }
  
          var d = createVector(pt.x-other.center.x, pt.y-other.center.y);
          var displacement = createVector(cos(a)*other.radius-d.x, sin(a)*other.radius-d.y);
  
          //if(pt.x === other.center.x && pt.y === other.center.y)
          //displacement = displacement.mult(-1);
  
          return displacement;
          //return createVector(0,0);
        }
        else
          return createVector(0, 0);
      }
    }
  
    MinkowskiDifference(other)
    {
      var topLeft = this.min().sub(other.max());
      var fullSize = this.size().add(other.size());
      return new AABB(topLeft.add(fullSize.div(2)), fullSize.div(2));
    }
  
  
    ClosestPointOnBoundsToPoint(point)
    {
      // test x first
      var minDist = abs(point.x - this.min().x);
      var boundsPoint = createVector(this.min().x, point.y);
  
      if (abs(this.max().x - point.x) < minDist)
      {
        minDist = abs(this.max().x - point.x);
        boundsPoint = createVector(this.max().x, point.y);
      }
  
      if (abs(this.max().y - point.y) < minDist)
      {
        minDist = abs(this.max().y - point.y);
        boundsPoint = createVector(point.x, this.max().y);
      }
  
      if (abs(this.min().y - point.y) < minDist)
      {
        minDist = abs(this.min.y - point.y);
        boundsPoint = createVector(point.x, this.min().y);
      }
  
      return boundsPoint;
    }
}