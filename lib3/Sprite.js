class Sprite3 {
    #width = 100;
    #height = 100;

    #position;
    #previousPosition;
    #newPosition;
    #deltaPosition;
    
    #depth = 0;
    #life = -1;
    #visible = true;
    #debug = false;
    #removed = false;
    #shapeColor = color(random(255), random(255), random(255));
    #groups = [];

    #velocity;
    #maxSpeed = -1;
    #immovable = false;
    #collider = undefined;

    #touching = {
        left: false,
        right: false,
        top: false,
        bottom: false
    };

    constructor(x, y, width, height) {
        this.#position = createVector(x, y);
        this.#previousPosition = createVector(x, y);
        this.#newPosition = createVector(x, y);
        this.#deltaPosition = createVector(0, 0);

        this.Width = width;
        this.Height = height;
        this.#width = width;
        this.#height = height;

        this.#velocity = createVector(0, 0);
    }

    set Debug(value) {
        this.#debug = value;
    }

    set Depth(value) {
        this.#depth = value;
    }

    get Width() {
        return this.#width;
    }

    set Width(value) {
        this.#width = value;
    }

    get Height() {
        return this.#height;
    }

    set Height(value) {
        this.#height = value;
    }

    set Velocity(value) {
        this.#velocity.x = value.x;
        this.#velocity.y = value.y;
    }

    get Velocity() { 
        return this.#velocity;
    }

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
                        let over = this.#collider.overlap(other.#collider);
                        if (over) {
                            result = true;
                        }
                    }
                    else if (type === 'collide') {
                        displacement = this.#collider.Collide(other.#collider);

                        if (displacement.x !== 0 || displacement.y !== 0) {
                            if ((type === 'collide') && !this.#immovable) {
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
        rect(0, 0, this.#width, this.#height);
    }

    #PreUpdate() {
        if (!this.#removed) {
            //if there has been a change somewhere after the last update
            //the old position is the last position registered in the update
            if (this.#newPosition !== this.#position)
                this.#previousPosition = createVector(this.#newPosition.x, this.#newPosition.y);
            else
                this.#previousPosition = createVector(this.#position.x, this.#position.y);

            if (this.#maxSpeed !== -1)
                this.LimitSpeed(this.#maxSpeed);

            this.#position.x += this.#velocity.x;
            this.#position.y += this.#velocity.y;

            this.#newPosition = createVector(this.#position.x, this.#position.y);

            this.#deltaPosition.x = this.#position.x - this.#previousPosition.x;
            this.#deltaPosition.y = this.#position.y - this.#previousPosition.y;

            //self destruction countdown
            if (this.#life > 0)
                this.#life--;
            if (this.#life === 0)
                this.Remove();
        }
    }

    SetDefaultCollider() {
        this.#collider = new AABBCollider(this.#position, createVector(this.#width, this.#height));
    }

    Display() {
        if (this.#visible && !this.#removed) {
            this.#PreUpdate();

            push();
            colorMode(RGB);

            noStroke();
            rectMode(CENTER);
            ellipseMode(CENTER);
            imageMode(CENTER);

            translate(this.#position.x, this.#position.y);
            this.Update();
            pop();

            //draw debug info
            if (this.#debug) {
                let ctx = document.querySelector("canvas").getContext("2d");
                ctx.save();

                ctx.lineWidth = 2;
                ctx.strokeStyle = "#00FF00";
                ctx.strokeRect(this.Position.x - this.Width / 2, this.Position.y - this.Height / 2, this.Width, this.Height);

                ctx.beginPath();
                ctx.moveTo(this.Position.x - 10, this.Position.y);
                ctx.lineTo(this.Position.x + 10, this.Position.y);
                ctx.stroke();
                
                ctx.beginPath();
                ctx.moveTo(this.Position.x, this.Position.y - 10);
                ctx.lineTo(this.Position.x, this.Position.y + 10);
                ctx.stroke();

                ctx.fillStyle = "#00FF00";
                ctx.font = '16px sans-serif';
                ctx.fillText(this.#depth + '', this.Position.x + 4, this.Position.y - 2);

                ctx.restore();
            }

        }
    }
}