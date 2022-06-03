class Settings {
    static GameClass = MissileCommand;
    
    static Layers = {
        MISSILES: 0,
        CITIES: 1,
        EXPLOSIONS: 2
    };

    static LayerInteractions = {
        [Settings.Layers.MISSILES]: [Settings.Layers.CITIES]
    };

    static BackgroundColor = "#FFF";

    static GameWidth = 800;
    static GameHeight = 600;

    static Debug = true;
    static ShowStats = true;
    static ShowGrid = false;
    static GridSize = 50;
}