class Animation {
    #spritesheet = undefined;
    #frames = undefined;

    #animationLoops = {};
    #currentAnimationLoop = "";
    #currentAnimationFrame = 0;

    constructor(spritesheetImage, framesJSON) {
        this.#spritesheet = loadImage(spritesheetImage);
        this.#frames = loadJSON(framesJSON);

        setInterval(() => {
            if (this.#currentAnimationLoop in this.#animationLoops) {
                this.#currentAnimationFrame = (this.#currentAnimationFrame + 1) % this.#animationLoops[this.#currentAnimationLoop].length;
            }
        }, 20);
    }

    set CurrentAnimationLoop(value) {
        if (this.#currentAnimationLoop == value) {
            return;
        }
        if (value in this.#animationLoops) {
            this.#currentAnimationLoop = value;
            this.#currentAnimationFrame = 0;
        }
    }

    AddAnimationLoop(loopName, ...frameNumbers) {
        this.#animationLoops[loopName] = frameNumbers;
    }

    Draw(w, h) {
        if (this.#currentAnimationLoop in this.#animationLoops &&
            this.#frames[this.#animationLoops[this.#currentAnimationLoop][this.#currentAnimationFrame]]) {
            image(this.#spritesheet, 0, 0, w, h, 
                this.#frames[this.#animationLoops[this.#currentAnimationLoop][this.#currentAnimationFrame]].frame.x,
                this.#frames[this.#animationLoops[this.#currentAnimationLoop][this.#currentAnimationFrame]].frame.y,
                this.#frames[this.#animationLoops[this.#currentAnimationLoop][this.#currentAnimationFrame]].frame.width,
                this.#frames[this.#animationLoops[this.#currentAnimationLoop][this.#currentAnimationFrame]].frame.height);
        }
    }
}
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

    UpdateCollider() {
        this.#extents.x = this.#parent.Width;
        this.#extents.y = this.#parent.Height;
    }

    Overlap(other) {
        //box vs box
        if (other instanceof Collider && !other.#parent.Removed && !this.#parent.Removed) {
            let difference = other.MinkowskiDifference(this);

            if (this.#parent instanceof Explosion && other.#parent instanceof City) { 
                console.log("test")
            }

            if (difference.Min.x <= 0 &&
                difference.Max.x >= 0 &&
                difference.Min.y <= 0 &&
                difference.Max.y >= 0) {
                return true;
            }
            else
                return false;
        }
        return false;
        // //box vs circle
        // else if (other instanceof CircleCollider) {

        //     //find closest point to the circle on the box
        //     let pt = createVector(other.Center.x, other.Center.y);

        //     //I don't know what's going o try to trace a line from centers to see
        //     if (other.Center.x < this.left())
        //         pt.x = this.left();
        //     else if (other.Center.x > this.right())
        //         pt.x = this.right();

        //     if (other.Center.y < this.top())
        //         pt.y = this.top();
        //     else if (other.Center.y > this.bottom())
        //         pt.y = this.bottom();

        //     let distance = pt.dist(other.Center);

        //     return distance < other.radius;
        // }
    }

    Collide(other) {
        if (other instanceof Collider) {
            let md = other.MinkowskiDifference(this);

            if (md.Min.x <= 0 &&
                md.Max.x >= 0 &&
                md.Min.y <= 0 &&
                md.Max.y >= 0) {
                let boundsPoint = md.ClosestPointOnBoundsToPoint(createVector(0, 0));

                return boundsPoint;
            }
            else
                return createVector(0, 0);
        }
    }

    MinkowskiDifference(other) {
        let topLeft = this.Min.sub(other.Max);
        let fullSize = this.Size.add(other.Size);

        let difference = new Collider(null, topLeft.add(fullSize.div(2)), fullSize.div(2));

        if (this.#parent instanceof Explosion && other.#parent instanceof City) { 
            console.log("test")
        }

        return difference;
    }


    ClosestPointOnBoundsToPoint(point) {
        // test x first
        let minDist = abs(point.x - this.Min.x);
        let boundsPoint = createVector(this.Min.x, point.y);

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
class Game {
    constructor() {
        GameManager.GetInstance().GameInstance = this;
    }
}
class GameManager {
    static #INSTANCE;

    static GetInstance() {
        if (GameManager.#INSTANCE == undefined) {
            GameManager.#INSTANCE = new GameManager();
            GameManager.#INSTANCE.Init();
        }
        return GameManager.#INSTANCE;
    }

    #allGameObjects = [];
    #collisionLayers = {};
    #gameInstance = undefined;
    #debugUpdateTimer = 0;
    #debugText = "";

    static keysPressed = [];

    set GameInstance(value) {
        this.#gameInstance = value;
    }

    Init() {
        createCanvas(Settings.GameWidth, Settings.GameHeight);

        if (Settings.Debug === true || Settings.ShowStats === true) {
            this.#UpdateDebugText();
            setInterval(() => { this.#UpdateDebugText() }, 500);
        }
    }

    RemoveGameObject(gameObject) {
        this.#allGameObjects = this.#allGameObjects.filter(go => go != gameObject);

        for (const layerId in this.#collisionLayers) {
            let index = this.#collisionLayers[layerId].indexOf(gameObject);
            if (index >= 0) {
                this.#collisionLayers[layerId].splice(index, 1);
            }
        }
    }

    AddGameObject(gameObject) {
        gameObject.Depth = this.#allGameObjects.length;
        this.#allGameObjects.push(gameObject);
    }

    get MaxDepth() {
        return this.#allGameObjects.length - 1;
    }

    AddGameObjectToCollisionLayer(gameObject, collisionLayer) {
        for (const layerId in this.#collisionLayers) {
            let index = this.#collisionLayers[layerId].indexOf(gameObject);
            if (index >= 0) {
                if (layerId === collisionLayer) {
                    return;
                }
                else {
                    this.#collisionLayers[layerId].splice(index, 1);
                }
            }
        }

        if (collisionLayer in this.#collisionLayers === false) {
            this.#collisionLayers[collisionLayer] = [];
        }

        this.#collisionLayers[collisionLayer].push(gameObject);
    }

    static Setup() {
        GameManager.GetInstance().#gameInstance = new Settings.GameClass();
    }

    static Draw() {
        GameManager.GetInstance().Update();
    }

    static KeyPressed() {
        GameManager.keysPressed.push(keyCode);
    }

    Update() {
        push();
        background(Settings.BackgroundColor);
        if (this.#gameInstance) {
            this.#gameInstance.Update();
        }
        this.#allGameObjects.slice().reverse().forEach(go => go.Display());

        for (const layerA in Settings.LayerInteractions) {
            let value = Settings.LayerInteractions[layerA];
            value.forEach(layerB => {
                if (this.#collisionLayers[layerA] && this.#collisionLayers[layerB]) {
                    this.#collisionLayers[layerA].forEach(go => go.Collide(...this.#collisionLayers[layerB]));
                }
            });
        }

        this.#allGameObjects.forEach(go => { 
            if (go.Collider) {
                let gameObjectsWithCollider = this.#allGameObjects.filter(f => f.Collider && f != go)
                go.Overlap(...gameObjectsWithCollider);
            }
        });

        if (Settings.ShowGrid) {
            this.#DrawGridOverlay();
        }
        pop();

        if (Settings.Debug === true || Settings.ShowStats === true) {
            push();
            textAlign(RIGHT, TOP);
            text(this.#debugText, width - 10, 0);
            pop();
        }

        if (GameManager.keysPressed.length > 0) {
            GameManager.keysPressed = [];
        }
    }

    #UpdateDebugText() {
        this.#debugText = `
        ${"debugMode On"}
        ${Math.round(frameRate())} fps
        `;
    }

    #DrawGridOverlay() {
        push();
        stroke('rgba(0,255,0, 0.25)');
        for (let i = 0; i < 100; ++i) {
            line(0, i * Settings.GridSize, 100 * Settings.GridSize, i * Settings.GridSize);
        }
        for (let i = 0; i < 100; ++i) {
            line(i * Settings.GridSize, 0, i * Settings.GridSize, 100 * Settings.GridSize);
        }
        pop();
    }
}

// window.preload = GameManager.Setup;
window.setup = GameManager.Setup;
window.draw = GameManager.Draw;
window.keyPressed = GameManager.KeyPressed;

p5.prototype.keyWentDown = function (key) {
    return GameManager.keysPressed.includes(key);
};

p5.prototype.createFillImage = function (src, dw, dh, sw, sh) {
    let img = createImage(dw, dh);

    src.resize(sw, sh);
    for (let i = 0; i < dw; i += src.width) {
        for (let j = 0; j < dh; j += src.height) {
            img.copy(src, 0, 0, src.width, src.height, i, j, src.width, src.height);
        }
    }
    return img;
}
class GameObject {
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

    #velocity;
    #maxSpeed = -1;
    #immovable = false;
    #collider = undefined;
    #collisionLayer = undefined;

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

        GameManager.GetInstance().AddGameObject(this);
    }

    get Removed() { 
        return this.#removed;
    }

    get Collider() { 
        return this.#collider;
    }

    get Hit() {
        return this.#collider.HitLocation;
    }

    set CollisionLayer(value) {
        GameManager.GetInstance().AddGameObjectToCollisionLayer(this, value);
        this.#collisionLayer = value;
    }

    set Life(value) {
        this.#life = value;
    }

    get Immovable() {
        return this.#immovable;
    }

    set Immovable(value) {
        this.#immovable = value;
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

    get Velocity() {
        return this.#velocity;
    }

    set Velocity(value) {
        this.#velocity.x = value.x;
        this.#velocity.y = value.y;
    }

    get Speed() {
        return this.#velocity.mag();
    }

    set Position(value) {
        this.#position.x = value.x;
        this.#position.y = value.y;
    }

    get Position() {
        return this.#position;
    }

    get Direction() {
        let direction = atan2(this.#velocity.y, this.#velocity.x);

        if (isNaN(direction))
            direction = 0;

        return direction;
    }

    Displace(displacement) {
        this.#position.add(displacement);
        this.#previousPosition = createVector(this.#position.x, this.#position.y);
        this.#newPosition = createVector(this.#position.x, this.#position.y);
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

    SetDefaultCollider() {
        this.#collider = new Collider(this, this.#position, createVector(this.Width, this.Height));
    }

    RemoveCollider() { 
        this.#collider = undefined;
    }

    Overlap(...otherSprites) {
        let spritesHit = this.#collider.Hit(true, ...otherSprites.map(sprite => sprite.#collider)); // the collider hit function needs an array of colliders, not sprites
        if (spritesHit.length > 0)
            this.OnOverlap(spritesHit);
        return spritesHit.length > 0;
    }

    OnOverlap(spritesHit) { }

    Collide(...otherSprites) {
        let spritesHit = this.#collider.Hit(false, ...otherSprites.map(sprite => sprite.#collider)); // the collider hit function needs an array of colliders, not sprites
        if (spritesHit.length > 0)
            this.OnCollide(spritesHit);
        return spritesHit.length > 0;
    }

    OnCollide(spritesHit) { }

    Remove() {
        this.RemoveCollider();
        this.#removed = true;
        GameManager.GetInstance().RemoveGameObject(this);
        delete this;
    }

    Update() {
        noStroke();
        fill("magenta");
        rect(0, 0, this.#width, this.#height);
    }

    Display() {
        if (this.#visible && !this.#removed) {
            if (this.Collider) { 
                this.Collider.UpdateCollider();   
            }
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
            if (Settings.Debug || this.#debug) {
                this.#DrawDebugInfo();
            }

        }
    }

    #DrawDebugInfo() {
        let ctx = document.querySelector("canvas").getContext("2d");
        ctx.save();

        let pos = this.Collider ? this.Collider.Center : this.Position;
        let w = this.Collider ? this.Collider.Size.x / 2 : 0;
        let h = this.Collider ? this.Collider.Size.y / 2 : 0;

        ctx.lineWidth = 2;
        ctx.strokeStyle = "#00FF00";
        ctx.strokeRect(pos.x - w / 2, pos.y - h / 2, w, h);

        ctx.beginPath();
        ctx.moveTo(pos.x - 10, pos.y);
        ctx.lineTo(pos.x + 10, pos.y);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y - 10);
        ctx.lineTo(pos.x, pos.y + 10);
        ctx.stroke();

        ctx.fillStyle = "#00FF00";
        ctx.font = '16px sans-serif';
        ctx.fillText(this.#depth + '', pos.x + 4, pos.y - 2);

        ctx.restore();
    }
}