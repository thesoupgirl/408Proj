describe("StressManagerGameEngine", function() {
    var Engine = require('../../client/GameMenu/js/StressManagerGameEngine');
    var TestGameMode = require('../../client/GameMenu/js/TestGamemode');
    var engine;
    var gamemode;

    beforeEach(function () {
      engine = new Engine();
      gamemode = new TestGameMode();
    });

    it("should initialize correctly", function () {
      // Check vars
      // TODO check timescale
      // TODO empty game object array
    });

    describe("when a new gameobject is created", function () {
      beforeEach(function () {
        // TODO add gameobject
      })

      it ("should be clicked through", function () {

      });
      it ("should have correct physics properties", function () {

      });
      it ("should have been ticking", function () {

      });
      it ("should have been ticking physics", function () {

      });
    });

    describe("when a gameobject is pushed", function () {
      beforeEach(function () {
        // TODO add gameobject
        // TODO push gameobject in all 3 directions
      })
      it ("should move for each tick", function () {

      });
      it ("should update the gameobject array by depth", function() {

      });
    });

    describe ("when the game is paused", function() {
      beforeEach(function() {
        //TODO create scene with moving objects
      });
      it ("should stop objects when paused", function() {

      });
      it ("should resume objects when resumed", function() {

      });
    });
});
