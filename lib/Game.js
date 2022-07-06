/**
 * Class that represents a Game. Extend this class to create a baseclass for your Game.
 */
class Game {
    /**
     * Creates a new Game instance.
     */
    constructor() {
        GameManager.GetInstance().GameInstance = this;
    }
}