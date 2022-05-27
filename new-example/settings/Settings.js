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