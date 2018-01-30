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

 this.add = function (v2) {
   return new Vector2(this.x + v2.x, this.y + v2.y);
 }

 this.subtract = function (v2) {
   return new Vector2(this.x - v2.x, this.y - v2.y);
 }

 this.times = function (value) {
   return new Vector2(this.x * value, this.y * value);
 }

 this.dividedBy = function (value) {
   return new Vector2(this.x / value, this.y / value);
 }

 this.cross = function (v1, v2) {
   return new Vector2(0,0); // TODO
 }

 this.dot = function (v1, v2) {
   return new Vector2(0,0); // TODO
 }
}

// A three-dimensional vector
function Vector3(x, y, z) {
 this.x = x;
 this.y = y;
 this.z = z;

 this.add = function (v2) {
   return new Vector3(this.x + v2.x, this.y + v2.y, this.z + v2.z);
 }

 this.subtract = function (v2) {
   return new Vector3(this.x - v2.x, this.y - v2.y, this.z - v2.z);
 }

 this.times = function (value) {
   return new Vector3(this.x * value, this.y * value, this.z * value);
 }

 this.dividedBy = function (value) {
   return new Vector3(this.x / value, this.y / value, this.z / value);
 }

 this.cross = function (v2) {
   return new Vector3(0,0,0); // TODO
 }

 this.dot = function (v2) {
   return new Vector3(0,0,0); // TODO
 }
}

// Physics for any sort of object that would retain speed
function PhysicsProperties() {

  this.gravityScale = 0;              // How much this object is affected by gravity
  this.mass = 1;                      // Uh, mass
  this.velocity = new Vector3(0, 0, 0); // Velocity is measured in pixels per second

  // Float, Vector3
  this.physicsTick = function (position) {
    //if (time == 0) console.log(position);
    //console.log(timeInc / 1000);
    //console.log(position.x);
    return position.add(this.velocity.times(timeInc / 1000)); // since time inc is in ms, we want seconds
  }
  // Vector3
  this.setVelocity = function (newVelocity) {
    this.velocity = newVelocity;
  }
  // Vector3
  this.addForce = function (velocityDiff) {
    // Force = Mass * Acceleration
    // Acceleration = Force / Mass
    this.setVelocity(this.velocity.add(velocityDiff.dividedBy(this.mass)));
    //console.log("New velocity: " + this.velocity.x + " " + (timeInc));
  }
};

// Core gameobjects that draw images, receive events, etc
function GameObject(position, bounds, name, hasPhysics) {
  this.position = position;               // Vector3
  this.bounds = bounds;                   // Vector2
  this.hasPhysics = hasPhysics;
  if (hasPhysics) this.physics = new PhysicsProperties();
  this.name = name;

  this.draw = function () {
    // Can be overridden by whoever creates this,
    // but for now we only draw a tiny circle
    context.beginPath();
    context.arc(this.position.x,this. position.y,5,0,2*Math.PI);
    context.stroke();
  }

  this.onTick = function () {
    // Can be overridden by whoever creates this,
    // But for now we do nothing
  }

  // int, int
  // Called by core gamemode loop
  this.tick = function () {
    this.draw();
    this.onTick();
    if (this.hasPhysics) this.position = this.physics.physicsTick(this.position)
  };

  // int, int, world position of the click on this element
  this.click = function (x, y) {
    // Can be overridden by whoever creates this,
    // but for now we just print the name of this object
    console.log(name + " clicked at ()" + x + "," + y + ")")
  }
}

var canvas = document.getElementById("myCanvas");  // canvas to draw on
var context = canvas.getContext("2d");             // canvas context to draw on
var time = 0;                                      // to calculate last time, in case of frame droppage
var timeInc = 10;                                  // time increment in ms
var gameObjects = [];                              // list of gameobjects to handle clicking, physics, and
var gameMode = new GameMode();

function onPageLoaded() {
	context.font = "30px Arial";
	setInterval(tick, timeInc);

  gameMode.start();
};

function tick() {
	context.clearRect(0, 0, canvas.width, canvas.height);
  // For each gameobject, tick
  for (var i = 0, len = gameObjects.length; i < len; i++) {
    //console.log(gameObjects[i]);
    gameObjects[i].tick();
  }
  gameMode.tick();
	time+=timeInc;
};

function click(event) {
  var x = event.pageX - canvas.offsetLeft;
  var y = event.pageY - canvas.offsetTop;

  //console.log("clicked on " + x + " " + y);

  // TODO iterate through game objects, send click event
}

/*function draw() {
	context.fillText("Time: " + time,10,50);
};*/

window.onload = onPageLoaded;
canvas.addEventListener('click', click);
