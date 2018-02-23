/**
 * I don't like how monolithic javascript can be,
 * so someone please clarify if I am doing things horribly wrong.
 *
 * This script handles core game logic, such as objects, collision, and physics.
 * This script should be loaded after the game logic is initialized.
 */
// A two-dimensional vector
function Vector2(x, y) {
  this.x = x;
  this.y = y;

  this.add = function(v2) {
    return new Vector2(this.x + v2.x, this.y + v2.y);
  };

  this.subtract = function(v2) {
    return new Vector2(this.x - v2.x, this.y - v2.y);
  };

  this.times = function(value) {
    return new Vector2(this.x * value, this.y * value);
  };

  this.dividedBy = function(value) {
    return new Vector2(this.x / value, this.y / value);
  };

  this.cross = function(v1, v2) {
    return new Vector2(0, 0); // TODO
  };

  this.dot = function(v1, v2) {
    return new Vector2(0, 0); // TODO
  };
};

// A three-dimensional vector
function Vector3(x, y, z) {
  this.x = x;
  this.y = y;
  this.z = z;

  this.add = function(v2) {
    return new Vector3(this.x + v2.x, this.y + v2.y, this.z + v2.z);
  };

  this.subtract = function(v2) {
    return new Vector3(this.x - v2.x, this.y - v2.y, this.z - v2.z);
  };

  this.times = function(value) {
    return new Vector3(this.x * value, this.y * value, this.z * value);
  };

  this.dividedBy = function(value) {
    return new Vector3(this.x / value, this.y / value, this.z / value);
  };

  this.cross = function(v2) {
    return new Vector3(0, 0, 0); // TODO
  };

  this.dot = function(v2) {
    return new Vector3(0, 0, 0); // TODO
  };
};

// Physics for any sort of object that would retain speed
function PhysicsProperties() {

  this.gravityScale = 0; // How much this object is affected by gravity
  this.mass = 1; // Uh, mass
  this.velocity = new Vector3(0, 0, 0); // Velocity is measured in pixels per second
  this.drag = 0; // Velocity lost per second

  // Vector3
  this.setVelocity = function(newVelocity) {
    this.velocity = newVelocity;
  };
  // Vector3
  this.addForce = function(velocityDiff) {
    // Force = Mass * Acceleration
    // Acceleration = Force / Mass
    this.setVelocity(this.velocity.add(velocityDiff.dividedBy(this.mass)));
    //console.log("New velocity: " + this.velocity.x + " " + (timeInc));
  };

  // Float, Vector3
  // Return the position of the object
  this.physicsTick = function(position) {
    //console.log(timeInc / 1000);
    //console.log(position.x);
    var timeDiffS = timeInc / 1000;
    this.setVelocity(this.velocity.add(new Vector3(0, 9.8, 0).times(timeDiffS * this.gravityScale)));
    this.setVelocity(this.velocity.add(this.velocity.times(timeDiffS * -1 * this.drag)));
    return position.add(this.velocity.times(timeDiffS)); // since time inc is in ms, we want seconds
  };
};

// Core gameobjects that draw images, receive events, etc
function GameObject(position, bounds, name, hasPhysics) {
  this.name = name;
  this.destroy = false; // To destroy at the end of each tick
  this.position = position; // Vector3
  this.bounds = bounds; // Vector2
  this.hasPhysics = hasPhysics;
  this.clickThrough = true; // Some objects may not even register a click method, so we click through by default
  this.lastZ = position.z; // Used to see if we should sort the gameobject array again
  if (hasPhysics) this.physics = new PhysicsProperties();

  this.draw = function() {
    // Can be overridden by whoever creates this,
    // but for now we only draw a tiny circle
    context.fillStyle = "#FF0000";
    context.fillRect(this.position.x, this.position.y, this.bounds.x, this.bounds.y);
  };

  this.onTick = function() {
    // Can be overridden by whoever creates this,
    // But for now we do nothing
  };

  // int, int
  // Called by core gamemode loop
  this.tick = function() {
    this.draw();
    this.onTick();
    if (this.hasPhysics) {
      this.position = this.physics.physicsTick(this.position);
    }
  };

  // int, int, world position of the click on this element
  this.onMousedown = function(x, y) {
    // Can be overridden by whoever creates this,
    // but for now we just print the name of this object
    //console.log(name + " mouse down at (" + x + "," + y + ")");
  };
  // int, int, world position of the click on this element
  this.onMouseup = function(x, y) {
    // Can be overridden by whoever creates this,
    // but for now we just print the name of this object
    //console.log(name + " mouse up at (" + x + "," + y + ")");
  };
  this.onMousemove = function(x, y) {
    // Can be overridden by whoever creates this,
    // but for now we just print the name of this object
    //console.log(name + " mouse move at (" + x + "," + y + ")");
  };
};

var canvas = document.getElementById("myCanvas"); // canvas to draw on
var context = canvas.getContext("2d"); // canvas context to draw on
context.font = "30px Arial";
context.fillText("Loading...", (canvas.width/2)  - 50, canvas.height/2);
var time = 0; // to calculate last time, in case of frame droppage
var timeInc = 10; // time increment in ms
var gameObjects = []; // list of gameobjects to handle clicking, physics, and
var gameMode = new GameMode();

function sortGameObjectArray() {
  gameObjects.sort(function(a, b) {
    //console.log("sorting " + a.name + ", " + a.position.z + " " + b.name + ", " + b.position.z);
    var posA = a.position.z;
    var posB = b.position.z;
    if (posA < posB) return -1;
    if (posA > posB) return 1;
    return 0;
  });
};

function addGameObject(gameObject) {
  gameObjects.push(gameObject);
  sortGameObjectArray();
};

function deleteGameObject(gameObject) {
  gameObject.destroy = true;
};

function onPageLoaded() {

  setInterval(tick, timeInc);

  gameMode.start();
};
var clearScreen = true;
function tick() {
  if (this.clearScreen) context.clearRect(0, 0, canvas.width, canvas.height);
  // For each gameobject, tick
  var mustSort = false;
  for (var i = 0, len = gameObjects.length; i < len; i++) {
    //console.log(gameObjects[i]);
    // Call the individual game object tick
    gameObjects[i].tick();
    // Scan for changes in depth
    if (gameObjects[i].lastZ != gameObjects[i].position.z) {
      //console.log(gameObjects[i].name + " " + gameObjects[i].lastZ + " " + gameObjects[i].position.z + " " + gameObjects[i].position + " " + gameObjects[i].physics.velocity);
      mustSort = true;
    }
    // Update the last depth
    gameObjects[i].lastZ = gameObjects[i].position.z;
  }
  // Sort once, if necessary
  if (mustSort) {
    //console.log("restorting");
    sortGameObjectArray();
  }
  var hitEnd = false;
  // Continuously loop through gameobjects and splice all gameobjects that we must destroy
  while (!hitEnd) {
    for (var i = 0, len = gameObjects.length; i < len; i++) {
      if (gameObjects[i].destroy) {
        gameObjects.splice(i, 1);
        break;
      }
      if (i == len - 1) hitEnd = true;
    }
  }


  // Tell the gamemode to continue
  gameMode.tick();
  time += timeInc;
};


function mousemove(event) {
  var x = event.pageX - canvas.offsetLeft;
  var y = event.pageY - canvas.offsetTop;
  //console.log("clicked on " + x + " " + y);
  // Click top level first
  for (var i = gameObjects.length - 1, len = gameObjects.length; i >= 0; i--) {
    if (gameObjects[i].position.x < x && gameObjects[i].position.x + gameObjects[i].bounds.x > x &&
      gameObjects[i].position.y < y && gameObjects[i].position.y + gameObjects[i].bounds.y > y) {
      gameObjects[i].onMousemove(x, y);
      if (!gameObjects[i].clickThrough) break;
    }
  }
};

function mousedown(event) {
  var x = event.pageX - canvas.offsetLeft;
  var y = event.pageY - canvas.offsetTop;
  //console.log("clicked on " + x + " " + y);
  for (var i = gameObjects.length - 1, len = gameObjects.length; i >= 0; i--) {
    if (gameObjects[i].position.x < x && gameObjects[i].position.x + gameObjects[i].bounds.x > x &&
      gameObjects[i].position.y < y && gameObjects[i].position.y + gameObjects[i].bounds.y > y) {
      gameObjects[i].onMousedown(x, y);
      if (!gameObjects[i].clickThrough) break;
    }
  }
};

function mouseup(event) {
  var x = event.pageX - canvas.offsetLeft;
  var y = event.pageY - canvas.offsetTop;
  //console.log("clicked on " + x + " " + y);
  for (var i = gameObjects.length - 1, len = gameObjects.length; i >= 0; i--) {
    if (gameObjects[i].position.x < x && gameObjects[i].position.x + gameObjects[i].bounds.x > x &&
      gameObjects[i].position.y < y && gameObjects[i].position.y + gameObjects[i].bounds.y > y) {
      gameObjects[i].onMouseup(x, y);
      if (!gameObjects[i].clickThrough) break;
    }
  }
};
var lastTimeInc = timeInc;

function pause() {
  // Unpause
  if (timeInc == 0) {
    resume();
  } else {
    //console.log(timeInc);
    lastTimeInc = timeInc;
    timeInc = 0;
    setInterval(tick, timeInc);
      //console.log(timeInc);
  }
};

function resume() {
  //console.log(timeInc);
  timeInc = lastTimeInc;
  setInterval(tick, timeInc);
    //console.log(timeInc);
};

window.onload = onPageLoaded;
canvas.addEventListener('mousedown', mousedown);
canvas.addEventListener('mouseup', mouseup);
canvas.addEventListener('mousemove', mousemove)
