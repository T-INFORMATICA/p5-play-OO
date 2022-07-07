# p5.play Object Oriented

p5.js is a great framework to teach students the basic principles of programming: it allows them to quickly jump in and start creating sketches.

This project uses p5.js and is intended to teach students the use of classes and object-oriented programming. It is inspired by [p5.play](https://molleindustria.github.io/p5.play/), but uses the new ES6 classes and properties.

## Project startup

You will need the following file structure:
```
index.html
[MyGameClass].js
settings/
    ↳ Settings.js
```
Where `[MyGameClass]` is the name of your game.

### Setting up [MyGameClass].js

Make sure you name your file after your game (No worries, you can change it later if you want). For example, if you want to make a Snake game, you might want to call your file `Snake.js`.

Having created the file `Snake.js`, you need to add it to the `head` element of your `index.html`. Like this:

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <script src="Snake.js"></script>
    </head>
    <body>
    </body>
</html>
```

Inside of `Snake.js` you then create a new class called `Snake` that extends from `Game`. Inside the constructor, don't forget to call the constructor of the super class! 

Also, if you want, you can already add an empty `Update()` method as well.

```javascript
class Snake extends Game {
    constructor() {
        super();
    }

    Update() {
    }
}
```

### Setting up Settings.js

The `Settings.js` file contains a `Settings` class that is necessary for the game to run.

A minimal `Settings` class looks like this:

> **!!!**
> Change `MyGameClass` to whatever you named the class in `[MyGameClass].js`

```javascript
class Settings {
    // IMPORTANT! Change MyGameClass to the name of your game class
    static GameClass = MyGameClass;
    
    // Collision layers where you can put your gameObjects on
    // Add layers to your own liking...
    static Layers = {
        PLAYER: 0,
        GROUND: 1
    };

    // Set which layers can collide with which other layers
    // e.g. objects on the PLAYER layer can collide with objects on the GROUND layer
    static LayerInteractions = {
        [Settings.Layers.PLAYER]: [Settings.Layers.GROUND]
    };

    // background color for your game
    static BackgroundColor = "#FFF";

    // width and height of your game
    static GameWidth = 800;
    static GameHeight = 600;

    // debug mode: shows stats and collision boxes on screen
    static Debug = false;
    // shows stats on screen
    static ShowStats = true;
    
    // shows the grid on screen
    static ShowGrid = false;
    // the size of each box in the grid
    static GridSize = 50;
}
```

### using a CDN to include p5 and p5-play-OO

Add the following `script` elements to the `head` element of your `index.html`. Make sure these are in the same order, and are loaded in first!

```html
    <script src="https://cdn.jsdelivr.net/npm/p5/lib/p5.js"></script>
    <script src="https://cdn.jsdelivr.net/gh/t-informatica/p5-play-oo/release/lib.js"></script>
```

A example `index.html` file might look like this: 
```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Missile Command</title>
        <!-- external lib files -->
        <script src="https://cdn.jsdelivr.net/npm/p5@1.2.0/lib/p5.js"></script>
        <script src="https://cdn.jsdelivr.net/gh/t-informatica/p5-play-oo@1.0.1/release/lib.js"></script>

        <!-- your gameobject classes (inherit from GameObject) -->

        <!-- the game class -->
        <script src="MyGameClass.js"></script>
        
        <!-- SETTINGS -->
        <script src="settings/Settings.js"></script>
    </head>
    <body>
    </body>
</html>
```