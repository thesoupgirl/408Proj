// A very simple gamemode that only creates balls that bounce on walls

function GameMode() {
  this.start = function() {
    var fredBounds = new Vector2(30,30);
    var fredName = "Fred";
    var fredGravityScale = 1;
    var fredDrag = 0.001;

    var fredOnTick = function() {
      //console.log("I am fred, my position is " + this.position.x);
      if (this.position.x > canvas.width && this.physics.velocity.x > 0 || this.position.x < 0 && this.physics.velocity.x < 0) {
        //console.log("boop");
        this.physics.velocity.x *= -1;
      }
      if (this.position.y > canvas.height && this.physics.velocity.y > 0 || this.position.y < 0 && this.physics.velocity.y < 0) {
        //console.log("boop");
        this.physics.velocity.y *= -1;
      }
    }
    var fredOnMousemove = function(x, y) {
      //console.log(this.name + " ");
      if (this.physics.gravityScale == 0) {
        this.position = new Vector3(x - this.offset.x, y - this.offset.y, 0);
        this.lastPosition = new Vector3(x,y,0);
      }
    }
    var fredOnMousedown = function(x, y) {
      //console.log("foo");
      this.offset = new Vector2(x - this.position.x, y - this.position.y);
      this.physics.velocity = new Vector3(0,0,0);
      this.physics.gravityScale = 0;
    }
    var fredOnMouseup = function(x, y) {
      //console.log("bar");
      this.physics.gravityScale = 1;
    }


    var canvasGameObject = new GameObject(new Vector3(0,0,0), new Vector2(canvas.width, canvas.height), "Canvas", false);
    canvasGameObject.mouseDowned = false;
    canvasGameObject.draw = function () {
      context.fillStyle = "#FFFFFF";
      context.fillRect(this.position.x,this.position.y,this.bounds.x,this.bounds.y);
    }
    canvasGameObject.onMouseup = function(x, y) {
      //  spawn fred if we downed on this thing first
      if (this.mouseDowned) {
        var fred = new GameObject(new Vector3(x - fredBounds.x/2, y - fredBounds.y/2, 0), fredBounds, fredName + " (Clone)", true);
        fred.lastPosition = fred.position;
        fred.physics.gravityScale = fredGravityScale;
        fred.physics.drag = fredDrag;
        fred.onTick = fredOnTick;
        fred.onMousedown = fredOnMousedown;
        fred.onMouseup = fredOnMouseup;
        fred.onMousemove = fredOnMousemove;
        fred.onTick = fredOnTick;
        gameObjects.push(fred);
      }
      this.mouseDowned = false;
    }
    canvasGameObject.onMousedown = function(x, y) {
      this.mouseDowned = true;
    }
    gameObjects.push(canvasGameObject);

    for (var k = 0; k < 20; k++) {
      var fred = new GameObject(new Vector3(Math.random() * canvas.width, Math.random() * canvas.height, 0), fredBounds, fredName + " " + k, true);
      //console.log(fred);
      fred.lastPosition = fred.position;
      fred.physics.gravityScale = fredGravityScale;
      fred.physics.drag = fredDrag;
      fred.physics.addForce(new Vector3(((Math.random() * 2) - 1) * 100, ((Math.random() * 2) - 1) * 100, 0));

      fred.onTick = fredOnTick;
      fred.onMousedown = fredOnMousedown;
      fred.onMouseup = fredOnMouseup;
      fred.onMousemove = fredOnMousemove;
      fred.onTick = fredOnTick;


      gameObjects.push(fred);
    }
  }
  this.tick = function() {

  }
}
