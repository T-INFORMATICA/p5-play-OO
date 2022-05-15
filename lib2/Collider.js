class Collider { 
    #center;
    #offset;
    #extents;
    #originalExtents;
    
    constructor(_center, _extents, _offset) { 
        this.#center = _center;
        this.#extents = _extents;
        this.#originalExtents = _extents.copy();

        if (_offset === undefined)
            this.#offset = createVector(0, 0);
        else
            this.#offset = _offset;
    }
  
    get Center()
    {
      return this.#center;
    }

    get Offset() { 
        return this.#offset;
    }

    get Min()
    {
      return createVector(this.Center.x+this.#offset.x - this.#extents.x, this.Center.y+this.#offset.y - this.#extents.y);
    }
  
    get Max()
    {
      return createVector(this.Center.x+this.#offset.x + this.#extents.x, this.Center.y+this.#offset.y + this.#extents.y);
    }
  
    get Right()
    {
      return this.Center.x+this.#offset.x + this.#extents.x/2;
    }
  
    get Left()
    {
      return this.Center.x+this.#offset.x - this.#extents.x/2;
    }
  
    get Top()
    {
      return this.Center.y+this.#offset.y - this.#extents.y/2;
    }
  
    get Bottom()
    {
      return this.Center.y+this.#offset.y + this.#extents.y/2;
    }
  
    get Size()
    {
      return createVector(this.#extents.x * 2, this.#extents.y * 2);
    }
}