describe("StressManagerGameEngine", function() {
    var TestGamemode = require("../../client/GameMenu/js/TestGamemode");
    var StressManagerGameEngine = require("../../client/GameMenu/js/StressManagerGameEngine");
    var gamemode;
    var engine;

    beforeEach(function () {
      gamemode = new TestGamemode();
      engine = new StressManagerGameEngine();
    });

    it("should initialize correctly", function () {
      // Check vars
      expect(gameObjects.length).toBe(0);
      expect(timeInc).toBe(10);
    });

    describe("when a new gameobject is created", function () {
      var testGameObject;
      beforeEach(function () {
        // add gameobject
        testGameObject = new GameObject(new Vector3(0,0,0), new Vector2(10, 10), "Test Game Object", true);
        addGameobject(testGameObject);
      })

      it ("should be clicked through", function () {
        expect(testGameObject.clickThrough).toBe(true);
      });
      it ("should have correct physics properties", function () {
        expect(testGameObject.physics.gravityScale).toBe(0);
        expect(testGameObject.physics.mass).toBe(1);
        expect(testGameObject.physics.velocity.x).toBe(0);
        expect(testGameObject.physics.velocity.y).toBe(0);
        expect(testGameObject.physics.velocity.z).toBe(0);
        expect(testGameObject.physics.drag).toBe(0);
      });
      it ("should have been ticking", function () {
        sleep(5000);

        spyOn(engine, "tick");
        spyOn(testGameObject, "onTick");

        expect(engine.tick).toHaveBeenCalled();
        expect(testGameObject.onTick).toHaveBeenCalled();

      });
      it ("should have been ticking physics", function () {
          sleep(5000);

          spyOn(testGameObject.physics, "onTick");

          expect(testGameObject.physicsTick).toHaveBeenCalled();
      });
    });

    describe("when a gameobject is pushed", function () {
      beforeEach(function () {
        // TODO add gameobject
        // TODO push gameobject in all 3 directions
      })
      it ("should move for each tick", function () {

        expect(true).toBe(true);
      });
      it ("should update the gameobject array by depth", function() {

        expect(true).toBe(true);
      });
    });

    describe ("when the game is paused", function() {
      beforeEach(function() {
        //TODO create scene with moving objects
      });
      it ("should stop objects when paused", function() {

        expect(true).toBe(true);
      });
      it ("should resume objects when resumed", function() {

        expect(true).toBe(true);
      });
    });
  function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds){
        break;
      }
    }
  };
});
