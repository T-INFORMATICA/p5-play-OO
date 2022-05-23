class Settings {
    static Layers = {
        PLAYER: 0,
        GROUND: 1
    };

    static LayerInteractions = {
        [Settings.Layers.PLAYER]: [Settings.Layers.GROUND]
    };

    static BackgroundColor = "#FFF";
}