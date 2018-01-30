// A very simple gamemode that only creates balls that bounce on walls

function GameMode() {
  this.start = function() {
    for (var k = 0; k < 20; k++) {
      var fred = new GameObject(new Vector3(Math.random() * canvas.width, Math.random() * canvas.height, 0), new Vector2(10,10), "Fred", true);
      //console.log(fred);
      fred.physics.addForce(new Vector3(((Math.random() * 2) - 1) * 100, ((Math.random() * 2) - 1) * 100, 0));
      fred.onTick = function() {
        //console.log("I am fred, my position is " + this.position.x);
        if (this.position.x > canvas.width && this.physics.velocity.x > 0 || this.position.x < 0 && this.physics.velocity.x < 0) {
          console.log("boop");
          this.physics.velocity.x *= -1;
        }
        if (this.position.y > canvas.height && this.physics.velocity.y > 0 || this.position.y < 0 && this.physics.velocity.y < 0) {
          console.log("boop");
          this.physics.velocity.y *= -1;
        }
      }
      gameObjects.push(fred);
    }
  }
  this.tick = function() {

  }
}
