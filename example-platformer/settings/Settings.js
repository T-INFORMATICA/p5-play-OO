class Settings {
    static GameClass = Platformer;
    
    static Layers = {
        PLAYER: 0,
        GROUND: 1,
        ENEMIES: 2, 
        COINS: 3
    };

    static LayerInteractions = {
        [Settings.Layers.PLAYER]: [Settings.Layers.GROUND, Settings.Layers.ENEMIES]
    };

    static BackgroundColor = "#FFF";

    static GameWidth = 800;
    static GameHeight = 600;

    static Debug = true;
    static ShowStats = true;
    static ShowGrid = false;
    static GridSize = 50;
}