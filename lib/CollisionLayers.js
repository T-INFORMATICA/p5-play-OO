class CollisionLayers {
    static Layers = {
        PLAYER: 0,
        GROUND: 1
    };

    static Interactions = {
        [CollisionLayers.Layers.PLAYER]: [CollisionLayers.Layers.GROUND]
    };
}