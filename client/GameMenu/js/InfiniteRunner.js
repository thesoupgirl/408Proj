// An infinite runner game with cute little puppies and kitties :)

// Do not rename the GameMode function - As this is necessary for the game engine to load
function GameMode() {
  var self = this; // Standard for a reference to the gamemode
  /**
  * Game State monitors what point/screen this game should have
  * 0 - Title screen
  * 1 - Character Select
  * 2 - Game
  * 3 - Game Over
  */
  this.gameState = 0;
  /**
  * Dog = 0, Cat = 1 cuz dogs are better
  */
  var animalSelect = 0;
  this.deleteOnRestart = [];
  this.clearGame = function () {
    for (var i = 0, len = self.deleteOnRestart.length; i < len; i++) {
      //console.log(gameObjects[i]);
      self.deleteOnRestart[i].destroy = true;
    }
    self.animalGameObject.physics.drag = 0;
    self.animalGameObject.position = new Vector3(100, 400, 50);

  }
  this.restart = function () {
    //console.log("starting game");
    self.gameState = 2;
    self.clearGame();
  }
  this.gameOver = function () {
    self.gameState = 3; // Game over
    self.animalGameObject.physics.drag = 10;
  }
  this.start = function() {
    // Called when the game starts

    // Canvas with base house images
    var canvasGameObject = new GameObject(new Vector3(0,0,-15), new Vector2(canvas.width, canvas.height), "Canvas", false);
    canvasGameObject.draw = function () {
      var img=new Image();
      img.src = "../src/game1/background.png";
      context.drawImage(img,0,0);
    }

    addGameObject(canvasGameObject);

    // ALL TITLE SCREEN GAME OBJECTS

    // Title card
    var titleWidth = 450;
    var titleHeight = 200;
    var titleGameObject = new GameObject(new Vector3((canvas.width / 2) - titleWidth/2, (canvas.height / 2) - (titleHeight/2) - 100, 0), new Vector2(titleWidth, titleHeight), "Main Title", false);
    titleGameObject.draw = function () {
      if (self.gameState == 0) {
        context.fillStyle = "#FFFFFF";
        context.fillRect(this.position.x,this.position.y,this.bounds.x,this.bounds.y);
        context.fillStyle = "#000000";
        context.strokeRect(this.position.x, this.position.y, this.bounds.x, this.bounds.y);
        context.font = "60px Arial";
        context.fillText("Cute Animal",this.position.x + 50,this.position.y + 80);
        context.fillText("Bullshit",this.position.x + 120,this.position.y + 160);

      }
    }

    // Start button
    var startWidth = 300;
    var startHeight = 100;
    var startGameObject = new GameObject(new Vector3((canvas.width / 2) - startWidth/2, (canvas.height / 2) - (startHeight/2) + 100, 0), new Vector2(startWidth, startHeight), "Start button", false);
    startGameObject.clickThrough = true;
    startGameObject.draw = function () {
      if (self.gameState == 0) {
        context.fillStyle = "#FFFFFF";
        context.fillRect(this.position.x,this.position.y,this.bounds.x,this.bounds.y);
        context.fillStyle = "#000000";
        context.strokeRect(this.position.x, this.position.y, this.bounds.x, this.bounds.y);
        context.font = "30px Arial";
        context.fillText("Start",this.position.x + 120,this.position.y + 60);
      }
    }
    startGameObject.onMouseup = function () {
      if (self.gameState == 0) {
        self.gameState = 1;
      }
    }

    addGameObject(titleGameObject);
    addGameObject(startGameObject);
    // ALL CHARACTER SELECT GAME OBJECTS

    // dog selector
    var dogWidth = 300;
    var dogHeight = 300;
    var dogOptionGameObject = new GameObject(new Vector3((canvas.width / 2) - dogWidth, (canvas.height / 2) - (dogHeight/2), 1, 0), new Vector2(dogWidth, dogHeight), "Dog button", false);
    dogOptionGameObject.clickThrough = true;
    dogOptionGameObject.draw = function () {
      if (self.gameState == 1) {
        context.fillStyle = "#FFFFFF";
        context.fillRect(this.position.x,this.position.y,this.bounds.x,this.bounds.y);
        context.fillStyle = "#000000";
        context.strokeRect(this.position.x, this.position.y, this.bounds.x, this.bounds.y);
        context.font = "30px Arial";
        context.fillText("Dog",this.position.x + 120,this.position.y + (this.bounds.y/2));
      }
    }
    dogOptionGameObject.onMouseup = function () {
      if (self.gameState == 1) {
        self.gameState = 2;
        animalSelect = 0;
        self.restart();
      }
    }
    // cat selector
    var catWidth = 300;
    var catHeight = 300;
    var catOptionGameObject = new GameObject(new Vector3(400, (canvas.height / 2) - (catHeight/2), 1), new Vector2(catWidth, catHeight), "Cat button", false);
    catOptionGameObject.clickThrough = true;
    catOptionGameObject.draw = function () {
      if (self.gameState == 1) {
        context.fillStyle = "#FFFFFF";
        context.fillRect(this.position.x,this.position.y,this.bounds.x,this.bounds.y);
        context.fillStyle = "#000000";
        context.strokeRect(this.position.x, this.position.y, this.bounds.x, this.bounds.y);
        context.font = "30px Arial";
        context.fillText("Cat",this.position.x + 120,this.position.y + (this.bounds.y/2));
      }
    }
    catOptionGameObject.onMouseup = function () {
      if (self.gameState == 1) {
        self.gameState = 2;
        animalSelect = 1;
        self.restart();
      }
    }
    addGameObject(dogOptionGameObject);
    addGameObject(catOptionGameObject);

    // ALL GAME GAME OBJECTS


    //  dog/cat object
    self.baseSpeed = 100;
    var animalWidth = 80;
    var animalHeight = 50;
    var animalGameObject = new GameObject(new Vector3(0, (canvas.height / 2) - (animalHeight/2), 1), new Vector2(animalWidth, animalHeight), "Animal Object", true);
    animalGameObject.clickThrough = true;
    animalGameObject.physics.gravityScale = 0;
    animalGameObject.physics.drag = 0; // Since we directly set velocity
    animalGameObject.draw = function () {
      if (self.gameState == 2 || self.gameState == 3) {
        context.fillStyle = "#FFFFFF";
        context.fillRect(this.position.x,this.position.y,this.bounds.x,this.bounds.y);
        context.fillStyle = "#000000";
        context.strokeRect(this.position.x, this.position.y, this.bounds.x, this.bounds.y);
      }
    }
    animalGameObject.onTick = function () {
      if (self.gameState == 2) {
        // Idk do the bounds checking thing
        var depth = parseInt(((this.position.y - 390)/55).toFixed(0)) + 1;
        this.position.z = parseInt(depth); // So we have the image constnatly moving in the foreground/background
        //console.log("Position: " + this.position.x + " " + this.position.y + " " + depth);

        // Top: 335
        var top = 335;
        var bottom = canvas.height - animalHeight - 10;
        var left = 0;
        var right = canvas.width - animalWidth;
        if (this.position.y <= top) {
          this.position.y = top;
          if (this.physics.velocity.y <= 0) this.physics.velocity.y = 0;
          this.canTop = false;
        } else {
          this.canTop = true;
        }
        if (this.position.y >= bottom) {
          this.position.y = bottom;
          if (this.physics.velocity.y >= 0) this.physics.velocity.y = 0;
          this.canBottom = false;
        } else {
          this.canBottom = true;
        }
        if (this.position.x <= left) {
          this.position.x = left;
          if (this.physics.velocity.x <= 0) this.physics.velocity.x = 0;
          this.canLeft = false;
        } else {
          this.canLeft = true;
        }
        if (this.position.x >= right) {
          this.position.x = right;
          if (this.physics.velocity.x >= 0) this.physics.velocity.x = 0;
          this.canRight = false;
        } else {
          this.canRight = true;
        }

      } else {
        this.physics.velocity = new Vector3(0,0,0);
      }
    }
    this.checkKeyDown = function (e) {
      if (self.gameState != 2) return;
      var code = e.keyCode;
      switch (code) {
          case 37: if (animalGameObject.canLeft) animalGameObject.physics.velocity.x = self.baseSpeed * -1; break; //Left key
          case 38: if (animalGameObject.canTop) animalGameObject.physics.velocity.y = self.baseSpeed * -1; break; //Up key
          case 39: if (animalGameObject.canRight) animalGameObject.physics.velocity.x = self.baseSpeed * 1; break; //Right key
          case 40: if (animalGameObject.canBottom) animalGameObject.physics.velocity.y = self.baseSpeed * 1; break; //Down key
          default: //Everything else
      }
    }
    this.checkKeyUp = function (e) {
      if (self.gameState != 2) return;
      var code = e.keyCode;
      switch (code) {
          case 37: if (animalGameObject.physics.velocity.x <= 0) animalGameObject.physics.velocity.x = 0; break; //Left key
          case 38: if (animalGameObject.physics.velocity.y <= 0) animalGameObject.physics.velocity.y = 0; break; //Up key
          case 39: if (animalGameObject.physics.velocity.x >= 0) animalGameObject.physics.velocity.x = 0; break; //Right key
          case 40: if (animalGameObject.physics.velocity.y >= 0) animalGameObject.physics.velocity.y = 0; break; //Down key
          default: //Everything else
      }
    }
    window.addEventListener('keydown',this.checkKeyDown,false);
    window.addEventListener('keyup',this.checkKeyUp,false);

    // score counter
    var scorePosition = new Vector3(0,0,1);
    var scoreWidth = 200;
    var scoreHeight = 50;
    var scoreCounterGameObject = new GameObject(scorePosition, new Vector2(scoreWidth, scoreHeight), "Score Counter", false);
    scoreCounterGameObject.score = 0;
    scoreCounterGameObject.draw = function () {
      if (self.gameState == 2 || self.gameState == 3) {
        context.fillStyle = "#FFFFFF";
        context.fillRect(this.position.x,this.position.y,this.bounds.x,this.bounds.y);
        context.fillStyle = "#000000";
        context.strokeRect(this.position.x, this.position.y, this.bounds.x, this.bounds.y);
        context.font = "30px Arial";
        context.fillText("Score: " + this.score,this.position.x + 20,this.position.y + (this.bounds.y/2) + 10);
      }
    }
    scoreCounterGameObject.onTick = function () {
      if (self.gameState != 2) {
        this.startTime = time;
      } else {
        this.score = (time - this.startTime)/10;
      }
    }
    self.animalGameObject = animalGameObject;
    addGameObject(animalGameObject);
    addGameObject(scoreCounterGameObject);
    // ALL GAME OVER GAME OBJECTS

    // game over title
    var gameOverWidth = 450;
    var gameOverHeight = 200;
    var gameOverGameObject = new GameObject(new Vector3((canvas.width / 2) - gameOverWidth/2, (canvas.height / 2) - (gameOverHeight/2) - 100, 10), new Vector2(gameOverWidth, gameOverHeight), "Game Over Title", false);
    gameOverGameObject.draw = function () {
      if (self.gameState == 3) {
        context.fillStyle = "#FFFFFF";
        context.fillRect(this.position.x,this.position.y,this.bounds.x,this.bounds.y);
        context.fillStyle = "#000000";
        context.strokeRect(this.position.x, this.position.y, this.bounds.x, this.bounds.y);
        context.font = "60px Arial";
        context.fillText("Game",this.position.x + 140,this.position.y + 80);
        context.fillText("Over",this.position.x + 160,this.position.y + 160);
      }
    }

    // restart
    var restartWidth = 300;
    var restartHeight = 100;
    var restartGameObject = new GameObject(new Vector3((canvas.width / 2) - restartWidth/2, (canvas.height / 2) + 100 - (restartHeight/2) + 100, 10), new Vector2(restartWidth, restartHeight), "Restart button", false);
    restartGameObject.clickThrough = true;
    restartGameObject.draw = function () {
      if (self.gameState == 3) {
        context.fillStyle = "#FFFFFF";
        context.fillRect(this.position.x,this.position.y,this.bounds.x,this.bounds.y);
        context.fillStyle = "#000000";
        context.strokeRect(this.position.x, this.position.y, this.bounds.x, this.bounds.y);
        context.font = "30px Arial";
        context.fillText("Restart",this.position.x + 100,this.position.y + 60);
      }
    }
    restartGameObject.onMouseup = function () {
      if (self.gameState == 3) {
        self.clearGame();
        self.gameState = 1; // Back to animal select
      }
    }

    addGameObject(gameOverGameObject);
    addGameObject(restartGameObject);



  }
  // Nextspawn is for ensuring that the next item isn't colliding
  self.nextSpawnNoCollide = 0;
  self.nextSpawnObstacle = 0;
  self.noCollideRate = 5;
  self.obstacleRate = 5;
  self.backgroundVelocity = -80;
  this.obstacles = [];
  this.tick = function() {
    // Called every frame update

    // if game state is game, spawn (nocollides, collides, treats) that move and despawn
    if (self.gameState == 2) {
      var movingTicking = function() {
        if (self.gameState == 2) {
          this.physics.velocity.x = self.backgroundVelocity;
          //console.log(this);
          if (this.position.x + this.bounds.x <= 0) {
            deleteGameObject(this);
          }
        } else {
          this.physics.velocity.x = 0;
        }
      }

      // NoCollide moving objects

      if (time >= this.nextSpawnNoCollide && Math.random() <= (0.2/(timeInc * self.noCollideRate))) {
        var decorType = (Math.random() * 4).toFixed(0);
        //console.log("Spawning a thing of type " + decorType);
        // Defaults
        var decorY = 40;
        var decorDimensions = new Vector2(200, 342);
        var decorPath = "../src/game1/decor1.png";

        switch (parseInt(decorType)) {
          case 0:
          // DOOR
            decorY = 40;
            decorDimensions = new Vector2(200, 342);
            decorPath = "../src/game1/decor1.png";
            break;
          case 1:
          // PICTURE FRAME
            decorY = 60;
            decorDimensions = new Vector2(137, 96);
            decorPath = "../src/game1/decor2.png";
            break;
          case 2:
          // PLANT
            decorY = 300;
            decorDimensions = new Vector2(63, 92);
            decorPath = "../src/game1/decor3.png";
            break;
          case 3:
          // WINDOWS
            decorY = 30;
            decorDimensions = new Vector2(200, 202);
            decorPath = "../src/game1/decor4.png";

            break;

          default:

        }
        this.nextSpawnNoCollide = time + (-1000 * decorDimensions.x / self.backgroundVelocity);
        //console.log("Next spawn no collide: in " + (this.nextSpawnNoCollide - time));
        var noCollideGameObject = new GameObject(new Vector3(canvas.width,decorY,-1), decorDimensions, "Decor" + time, true);
        noCollideGameObject.physics.drag = 0;
        noCollideGameObject.physics.gravityScale = 0;
        noCollideGameObject.draw = function () {
          var img=new Image();
          img.src = decorPath;
          context.drawImage(img,this.position.x,this.position.y, this.bounds.x, this.bounds.y);
        }
        noCollideGameObject.onTick = movingTicking;
        addGameObject(noCollideGameObject);
        this.deleteOnRestart.push(noCollideGameObject)
      }


      // Obstacles
      var obstacleRate = 8;

      if (time >= this.nextSpawnObstacle && Math.random() <= (0.2/(timeInc * self.obstacleRate))) {
        var obstacleType = (Math.random() * 5).toFixed(0);
        // console.log("Spawning an obstacle of type " + obstacleType);
        // Defaults
        var obstacleDimensions = new Vector2(283, 150);
        var obstaclePath = "../src/game1/obstacle1.png";

        switch (parseInt(obstacleType)) {
          case 0:
          // High table
            obstacleDimensions = new Vector2(283, 150);
            obstaclePath = "../src/game1/obstacle1.png";
            break;
          case 1:
          // Low table
            obstacleDimensions = new Vector2(441, 150);
            obstaclePath = "../src/game1/obstacle2.png";
            break;
          case 2:
          // Chair
            obstacleDimensions = new Vector2(148, 150);
            obstaclePath = "../src/game1/obstacle3.png";
            break;
          case 3:
          // Sofa
            obstacleDimensions = new Vector2(298, 150);
            obstaclePath = "../src/game1/obstacle4.png";
            break;
          case 5:
          // Cabinet
            obstacleDimensions = new Vector2(124, 150);
            obstaclePath = "../src/game1/obstacle5.png";
            break;
          case 6:
          // Cubby?
            obstacleDimensions = new Vector2(252, 150);
            obstaclePath = "../src/game1/obstacle6.png";

            break;

          default:

        }
        var chosenLane = parseInt((Math.random() * 3).toFixed(0)); //up to 4 options
        var chosenLaneOffset = obstacleDimensions.y;
        switch (parseInt(chosenLane)) {
          case 0:
            chosenLaneOffset = 420 - chosenLaneOffset;
            break;
          case 1:
            chosenLaneOffset = 475 - chosenLaneOffset;
            break;
          case 2:
            chosenLaneOffset = 530 - chosenLaneOffset;
            break;
          case 3:
            chosenLaneOffset = 585 - chosenLaneOffset;
            break;
          default:

        }
        console.log("spawning in lane " + chosenLane)

        this.nextSpawnObstacle = time + (-1000 * obstacleDimensions.x / self.backgroundVelocity);
        var obstacleGameObject = new GameObject(new Vector3(canvas.width,chosenLaneOffset,parseInt(chosenLane)), obstacleDimensions, "Obstacle" + time, true);
        //console.log("Spawned game object at " + chosenLane);
        obstacleGameObject.physics.drag = 0;
        obstacleGameObject.physics.gravityScale = 0;
        obstacleGameObject.image = obstaclePath;
        obstacleGameObject.chosenLane = chosenLane;
        obstacleGameObject.draw = function () {
          var img=new Image();
          img.src = this.image;
          context.drawImage(img,this.position.x,this.position.y, this.bounds.x, this.bounds.y);
        }
        obstacleGameObject.movingTicking = movingTicking;
        obstacleGameObject.onTick = function () {
          this.movingTicking();
          // Search for collision for animal
          if ((self.animalGameObject.position.x >= this.position.x && self.animalGameObject.position.x <= this.position.x + this.bounds.x) || (self.animalGameObject.position.x +  self.animalGameObject.bounds.x >= this.position.x && self.animalGameObject.position.x + self.animalGameObject.bounds.x <= this.position.x + this.bounds.x)) {
            // Lined up horizontally, now vertically?
            var top = this.position.y  + this.bounds.y;
            var bottom = top - 55;
            if ((self.animalGameObject.position.y + self.animalGameObject.bounds.y >= bottom && self.animalGameObject.position.y + self.animalGameObject.bounds.y <= top)) {
              console.log("PHAT COLLISION: bottom: " + bottom + ", top: " + top + ", pos: " + (self.animalGameObject.position.y + self.animalGameObject.bounds.y));
              self.gameOver();
            }
          }
        }
        addGameObject(obstacleGameObject);
        this.deleteOnRestart.push(obstacleGameObject);
      }

    }
  }
}
