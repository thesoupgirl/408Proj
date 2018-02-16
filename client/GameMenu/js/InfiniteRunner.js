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
    self.scoreCounterGameObject.score = 0;
    self.animalGameObject.physics.drag = 0;
    self.animalGameObject.position = new Vector3(100, 400, 50);
    self.animalGameObject.unstableTime = 0;
    self.animalGameObject.physics.velocity = new Vector3(0,0,0);
    self.backgroundVelocity = self.startBackgroundVelocity;

  }
  this.restart = function () {
    //console.log("starting game");
    self.gameState = 2;
    self.clearGame();
  }
  this.gameOver = function () {
    self.gameState = 3; // Game over
    self.animalGameObject.physics.drag = 10;
    self.animalGameObject.physics.addForce(new Vector3(300, 0, 0));
    self.animalGameObject.unstableTime = 0;
    self.animalGameObject.inputs = new Vector2(0,0);
    self.animalGameObject.unstableInput = new Vector2(0,0);
  }
  this.loadImages = function () {
    for (var i = 1; i <= 11; i++) {
      var img1 = new Image();
      img1.src = "../src/game1/dog_roll/" + i + ".png";
      context.drawImage(img1, -100, -100, 101, 101);
    }
    for (var i = 1; i <= 8; i++) {
      var img1 = new Image();
      img1.src = "../src/game1/dog_run/" + i + ".png";
      context.drawImage(img1, -100, -100, 101, 101);
    }
    for (var i = 1; i <= 6; i++) {
      var img1 = new Image();
      img1.src = "../src/game1/cat_run/" + i + ".png";
      context.drawImage(img1, -100, -100, 101, 101);
    }
    for (var i = 1; i <= 14; i++) {
      var img1 = new Image();
      img1.src = "../src/game1/cat_roll/" + i + ".png";
      context.drawImage(img1, -100, -100, 101, 101);
    }
  }
  this.start = function() {
    // Called when the game starts
    this.loadImages();
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
        animalGameObject.animalSelect = 0;
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
        animalGameObject.animalSelect = 1;
        self.restart();
      }
    }
    addGameObject(dogOptionGameObject);
    addGameObject(catOptionGameObject);

    // ALL GAME GAME OBJECTS


    //  dog/cat object
    self.baseSpeed = 200;
    var animalWidth = 80;
    var animalHeight = 50;
    var animalGameObject = new GameObject(new Vector3(0, -500, 1), new Vector2(animalWidth, animalHeight), "Animal Object", true);
    animalGameObject.clickThrough = true;
    animalGameObject.physics.gravityScale = 0;
    animalGameObject.physics.drag = 0; // Since we directly set velocity
    animalGameObject.animalSelect = 0;
    animalGameObject.lastTime = time;
    animalGameObject.animFrames = 80; // New animation frame every 100 ms
    animalGameObject.animIndex = 1;
    animalGameObject.unstableTime = 0;
    animalGameObject.unstableInput = new Vector2(0,0);
    animalGameObject.input = new Vector2(0,0);

    animalGameObject.draw = function () {
      // We still render the image, just out of bounds
      // That way we don't have gif resource loading issues
      var maxFrames = this.animalSelect == 0 ? this.unstableTime > 0 ? 10 : 7 : this.unstableTime > 0 ? 13 : 5;
        if (time - this.lastTime > this.animFrames && self.gameState != 3) {
          this.animIndex = (this.animIndex + 1) % (maxFrames + 1);
          this.lastTime = time;
        }
        var img=new Image();
        var animalType = this.animalSelect == 0 ? "dog" : "cat";
        var movementType = this.unstableTime > 0 ? "roll" : "run";
        img.src = "../src/game1/" + animalType + "_" + movementType + "/" + (this.animIndex+1) + ".png";
        context.drawImage(img,this.position.x - 20,this.position.y - 20, this.bounds.x + 40, this.bounds.y + 40);

    }
    animalGameObject.onTick = function () {
      if (self.gameState == 2 || self.gameState == 3) {
        // Idk do the bounds checking thing
        var depth = parseInt(((this.position.y - 390)/55).toFixed(0)) + 1;
        this.position.z = parseInt(depth); // So we have the image constnatly moving in the foreground/background
        //console.log("Position: " + this.position.x + " " + this.position.y + " " + depth);
        // unstable
        if (this.unstableTime > 0) {
          this.unstableTime = this.unstableTime - timeInc;
          //this.unstableInput = new Vector2(Math.random(), Math.random());
          this.unstableInput = new Vector2(self.baseSpeed * ((Math.random() * 2) - 1), self.baseSpeed * ((Math.random() * 2) - 1));
          this.unstableInput = this.unstableInput.times(2);
          //console.log(this.unstableInput.x + " " + this.unstableInput.y);
        } else {
          this.unstableTime = 0;
          this.unstableInput = new Vector2(0,0);
        }
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

        //  if no collisions, do the thing
        var inputs = this.input.add(this.unstableInput);
        if (self.gameState != 3) {
          this.physics.velocity.x = inputs.x;
          this.physics.velocity.y = inputs.y;
        }
        //console.log("inputs: " + this.input.x + " " + this.input.y);
        if (this.physics.velocity.y > 0 && !this.canBottom) this.physics.velocity.y = 0;
        if (this.physics.velocity.y < 0 && !this.canTop) this.physics.velocity.y = 0;
        if (this.physics.velocity.x < 0 && !this.canLeft) this.physics.velocity.x = 0;
        if (this.physics.velocity.x > 0 && !this.canRight) this.physics.velocity.x = 0;
        //console.log(this.unstableTime + " Velcity: " + this.physics.velocity.x + " " + this.physics.velocity.y);

      } else {
        this.physics.velocity = new Vector3(0,0,0);
        this.position.x = -500;
        this.input = new Vector2(0,0);
        this.unstableInput = new Vector2(0,0);
      }
    }
    this.checkKeyDown = function (e) {
      if (self.gameState != 2) return;
      var code = e.keyCode;
      switch (code) {
          case 37: if (animalGameObject.canLeft) animalGameObject.input.x = self.baseSpeed * -1; break; //Left key
          case 38: if (animalGameObject.canTop) animalGameObject.input.y = self.baseSpeed * -1; break; //Up key
          case 39: if (animalGameObject.canRight) animalGameObject.input.x = self.baseSpeed * 1; break; //Right key
          case 40: if (animalGameObject.canBottom) animalGameObject.input.y = self.baseSpeed * 1; break; //Down key
          default: //Everything else
      }
    }
    this.checkKeyUp = function (e) {
      if (self.gameState != 2) return;
      var code = e.keyCode;
      switch (code) {
          case 37: if (animalGameObject.input.x <= 0) animalGameObject.input.x = 0; break; //Left key
          case 38: if (animalGameObject.input.y <= 0) animalGameObject.input.y = 0; break; //Up key
          case 39: if (animalGameObject.input.x >= 0) animalGameObject.input.x = 0; break; //Right key
          case 40: if (animalGameObject.input.y >= 0) animalGameObject.input.y = 0; break; //Down key
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
    self.scoreCounterGameObject = scoreCounterGameObject;
    scoreCounterGameObject.score = 0;
    scoreCounterGameObject.draw = function () {
      if (self.gameState == 2 || self.gameState == 3) {
        context.fillStyle = "#FFFFFF";
        context.fillRect(this.position.x,this.position.y,this.bounds.x,this.bounds.y);
        context.fillStyle = "#000000";
        context.strokeRect(this.position.x, this.position.y, this.bounds.x, this.bounds.y);
        context.font = "30px Arial";
        context.fillText("Score: " + parseInt(this.score),this.position.x + 20,this.position.y + (this.bounds.y/2) + 10);
      }
    }
    scoreCounterGameObject.onTick = function () {
      if (self.gameState != 2) {
        this.startTime = time;
      } else {
        this.score += (time - this.lastTime)/50;
      }
      this.lastTime = time;
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
  // Rate is, of course, rate. The higher, the less spawned.
  self.nextSpawnNoCollide = 0;
  self.noCollideRate = 5;

  self.nextSpawnObstacle = 0;
  self.obstacleRate = 5;

  self.nextSpawnTreat = 0;
  self.treatRate = 15;

  self.nextSpawnPlayable = 0;
  self.playableRate = 20;

  self.startBackgroundVelocity = -120;
  self.backgroundVelocity = -120;
  self.increaseTime = 0;

  this.obstacles = [];
  this.tick = function() {
    // Called every frame update
    var speedIncreaseInterval = 5000; // Every 50 ms we increase speed by 1
    if (time > self.increaseTime + speedIncreaseInterval && self.gameState == 2) {
      self.increaseTime = time;
      self.backgroundVelocity -= 10;
      console.log("Speeding up");
    }
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
            decorY = 75;
            decorDimensions = new Vector2(180, 307);
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
            decorY = 150;
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
            obstacleDimensions = new Vector2(220, 75);
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
          case 4:
          // Cabinet
            obstacleDimensions = new Vector2(124, 150);
            obstaclePath = "../src/game1/obstacle5.png";
            break;
          case 5:
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
            chosenLaneOffset = 595 - chosenLaneOffset;
            break;
          default:

        }
        //console.log("spawning in lane " + chosenLane)

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
              //console.log("PHAT COLLISION: bottom: " + bottom + ", top: " + top + ", pos: " + (self.animalGameObject.position.y + self.animalGameObject.bounds.y));
              if (self.gameState == 2) self.gameOver();
            }
          }
        }
        addGameObject(obstacleGameObject);
        this.deleteOnRestart.push(obstacleGameObject);
      }

      // Treats
      var treatScore = 500;

      if (time >= this.nextSpawnTreat && Math.random() <= (0.2/(timeInc * self.treatRate))) {
        var treatType = (Math.random() * 2).toFixed(0);
        // console.log("Spawning an treat of type " + treatType);
        // Defaults
        var treatDimensions = new Vector2(0, 0);
        var treatPath = "";

        switch (parseInt(treatType)) {
          case 0:
          // Treat
            if (self.animalGameObject.animalSelect == 1) {
              treatDimensions = new Vector2(50, 37);
              treatPath = "../src/game1/treat1.png";

            } else {
              treatDimensions = new Vector2(50, 50);
              treatPath = "../src/game1/treat4.png";

            }
            break;
          case 1:
          // Treat
            if (self.animalGameObject.animalSelect == 1) {
              treatDimensions = new Vector2(50, 35);
              treatPath = "../src/game1/treat2.png";
            } else {
              treatDimensions = new Vector2(50, 22);
              treatPath = "../src/game1/treat5.png";
            }
            break;
          case 2:
          // Treat
            if (self.animalGameObject.animalSelect == 1) {
                treatDimensions = new Vector2(50, 34);
                treatPath = "../src/game1/treat3.png";
            } else {
                treatDimensions = new Vector2(50, 43);
                treatPath = "../src/game1/treat6.png";
            }
            break;
          default:

        }
        var chosenLane = parseInt((Math.random() * 3).toFixed(0)); //up to 4 options
        var chosenLaneOffset = treatDimensions.y;
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
        //console.log("spawning in lane " + chosenLane)

        this.nextSpawntreat = time + (-1000 * treatDimensions.x / self.backgroundVelocity);
        var treatGameObject = new GameObject(new Vector3(canvas.width,chosenLaneOffset,parseInt(chosenLane)), treatDimensions, "Treat " + time, true);
        //console.log("Spawned game object at " + chosenLane);
        treatGameObject.physics.drag = 0;
        treatGameObject.physics.gravityScale = 0;
        treatGameObject.image = treatPath;
        treatGameObject.chosenLane = chosenLane;
        treatGameObject.draw = function () {
          var img=new Image();
          img.src = this.image;
          context.drawImage(img,this.position.x,this.position.y, this.bounds.x, this.bounds.y);
        }
        treatGameObject.movingTicking = movingTicking;
        treatGameObject.onTick = function () {
          this.movingTicking();
          // Search for collision for animal
          if ((self.animalGameObject.position.x >= this.position.x && self.animalGameObject.position.x <= this.position.x + this.bounds.x) || (self.animalGameObject.position.x +  self.animalGameObject.bounds.x >= this.position.x && self.animalGameObject.position.x + self.animalGameObject.bounds.x <= this.position.x + this.bounds.x)) {
            // Lined up horizontally, now vertically?
            var top = this.position.y  + this.bounds.y;
            var bottom = top - 55;
            if ((self.animalGameObject.position.y >= this.position.y && self.animalGameObject.position.y <= this.position.y + this.bounds.y) || (self.animalGameObject.position.y +  self.animalGameObject.bounds.y >= this.position.y && self.animalGameObject.position.y + self.animalGameObject.bounds.y <= this.position.y + this.bounds.y) || (self.animalGameObject.position.y <= this.position.y && self.animalGameObject.position.y + self.animalGameObject.bounds.y > this.position.y + this.bounds.y)) {
              //console.log("PHAT COLLISION: bottom: " + bottom + ", top: " + top + ", pos: " + (self.animalGameObject.position.y + self.animalGameObject.bounds.y));
              self.scoreCounterGameObject.score += treatScore;
              // Floaty up score
              var scoreGameObject = new GameObject(this.position, new Vector2(200, 100), "Score thingy", true);
              scoreGameObject.physics.drag = 3;
              scoreGameObject.physics.gravityScale = 0;
              scoreGameObject.movingTicking = movingTicking;
              scoreGameObject.score = treatScore;
              scoreGameObject.spawnTime = time;
              scoreGameObject.scoreLifetime = 3000;
              scoreGameObject.scoreFontSize = 20;
              scoreGameObject.onTick = function () {
                this.movingTicking();
                if (time - this.spawnTime > this.scoreLifetime) {
                  deleteGameObject(this);
                }
              }
              scoreGameObject.draw = function () {
                var fontFactor = Math.sqrt(this.scoreFontSize * ((-((time - this.spawnTime)/this.scoreLifetime)) + 1));
                //console.log(fontFactor);
                if (fontFactor < 1 || isNaN(fontFactor)) fontFactor = 0; //Workaround
                var fontSize = 10 * fontFactor;
                context.font = (fontSize) + "px Arial";
                context.fillText("+" + this.score, this.position.x, this.position.y);
              }
              scoreGameObject.physics.addForce(new Vector3(0, -100, 0));
              addGameObject(scoreGameObject);
              self.deleteOnRestart.push(scoreGameObject);
              deleteGameObject(this);
            }
          }
        }
        addGameObject(treatGameObject);
        this.deleteOnRestart.push(treatGameObject);
      }

      // Playables
      var playableScore = 1000;

      if (time >= this.nextSpawnPlayable && Math.random() <= (0.2/(timeInc * self.playableRate))) {
        var playableType = (Math.random() * 3).toFixed(0);
        // console.log("Spawning an treat of type " + treatType);
        // Defaults
        var playableDimensions = new Vector2(0, 0);
        var playablePath = "";
        var playableBrokenDimensions = new Vector2(0, 0);
        var playableBrokenPath = "";
        var playableBrokenYOffset = 0;

        switch (parseInt(playableType)) {
          case 0:
          // playable
          if (self.animalGameObject.animalSelect == 1) {
            playableDimensions = new Vector2(50, 125);
            playablePath = "../src/game1/playable1.png";
            playableBrokenDimensions = new Vector2(125, 50);
            playableBrokenPath = "../src/game1/playable1_2.png";
            playableBrokenYOffset = 75;
          } else {
            // playable
            playableDimensions = new Vector2(100, 51);
            playablePath = "../src/game1/playable5.png";
            playableBrokenDimensions = new Vector2(133.2, 67);
            playableBrokenPath = "../src/game1/playable5_2.png";
          }
            break;
          case 1:
          // playable
          if (self.animalGameObject.animalSelect == 1) {
            playableDimensions = new Vector2(70, 56);
            playablePath = "../src/game1/playable2.png";
            playableBrokenDimensions = new Vector2(56, 70);
            playableBrokenPath = "../src/game1/playable2_2.png";
          } else {
            playableDimensions = new Vector2(65, 31);
            playablePath = "../src/game1/playable4.png";
            playableBrokenDimensions = new Vector2(65, 31);
            playableBrokenPath = "../src/game1/playable4.png";
          }

            break;
          case 2:
          if (self.animalGameObject.animalSelect == 1) {
            playableDimensions = new Vector2(150, 39);
            playablePath = "../src/game1/playable3.png";
            playableBrokenDimensions = new Vector2(150, 39);
            playableBrokenPath = "../src/game1/playable3.png";
          } else {
          // playable
          playableDimensions = new Vector2(50,46);
          playablePath = "../src/game1/playable6.png";
          playableBrokenDimensions = new Vector2(136, 44);
          playableBrokenPath = "../src/game1/playable6_2.png";

          }
            break;
          case 3:
            break;

          default:

        }
        var chosenLane = parseInt((Math.random() * 3).toFixed(0)); //up to 4 options
        var chosenLaneOffset = playableDimensions.y;
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
        //console.log("spawning in lane " + chosenLane)

        this.nextSpawnplayable = time + (-1000 * playableDimensions.x / self.backgroundVelocity);
        var playableGameObject = new GameObject(new Vector3(canvas.width,chosenLaneOffset,parseInt(chosenLane)), playableDimensions, "playable " + time, true);
        //console.log("Spawned game object at " + chosenLane);
        playableGameObject.physics.drag = 0;
        playableGameObject.physics.gravityScale = 0;
        playableGameObject.image = playablePath;
        playableGameObject.image2 = playableBrokenPath;
        playableGameObject.bounds2 = playableBrokenDimensions;
        playableGameObject.chosenLane = chosenLane;
        playableGameObject.used = false;
        playableGameObject.playableBrokenYOffset = playableBrokenYOffset;
        playableGameObject.spriteType = 0;
        playableGameObject.draw = function () {
          var img=new Image();
          switch (parseInt(this.spriteType)) {
            case 0:
              img.src = this.image;
              context.drawImage(img,this.position.x,this.position.y, this.bounds.x, this.bounds.y);
              break;
            case 1:
              img.src = this.image2;
              context.drawImage(img,this.position.x,this.position.y + playableBrokenYOffset, this.bounds2.x, this.bounds2.y);
              break;
            default:

          }
        }
        playableGameObject.movingTicking = movingTicking;
        playableGameObject.onTick = function () {
          this.movingTicking();
          // Search for collision for animal
          if (!this.used && ((self.animalGameObject.position.x >= this.position.x && self.animalGameObject.position.x <= this.position.x + this.bounds.x) || (self.animalGameObject.position.x +  self.animalGameObject.bounds.x >= this.position.x && self.animalGameObject.position.x + self.animalGameObject.bounds.x <= this.position.x + this.bounds.x))) {
            // Lined up horizontally, now vertically?
            var top = this.position.y  + this.bounds.y;
            var bottom = top - 55;
            if ((self.animalGameObject.position.y >= this.position.y && self.animalGameObject.position.y <= this.position.y + this.bounds.y) || (self.animalGameObject.position.y +  self.animalGameObject.bounds.y >= this.position.y && self.animalGameObject.position.y + self.animalGameObject.bounds.y <= this.position.y + this.bounds.y)  || (self.animalGameObject.position.y <= this.position.y && self.animalGameObject.position.y + self.animalGameObject.bounds.y > this.position.y + this.bounds.y)) {
              //console.log("PHAT COLLISION: bottom: " + bottom + ", top: " + top + ", pos: " + (self.animalGameObject.position.y + self.animalGameObject.bounds.y));
              self.scoreCounterGameObject.score += playableScore;
              // Floaty up score
              var scoreGameObject = new GameObject(this.position, new Vector2(200, 100), "Score thingy", true);
              scoreGameObject.physics.drag = 3;
              scoreGameObject.physics.gravityScale = 0;
              scoreGameObject.movingTicking = movingTicking;
              scoreGameObject.score = playableScore;
              scoreGameObject.spawnTime = time;
              scoreGameObject.scoreLifetime = 3000;
              scoreGameObject.scoreFontSize = 20;
              scoreGameObject.onTick = function () {
                this.movingTicking();
                if (time - this.spawnTime > this.scoreLifetime) {
                  deleteGameObject(this);
                }
              }
              scoreGameObject.draw = function () {
                var fontFactor = Math.sqrt(this.scoreFontSize * ((-((time - this.spawnTime)/this.scoreLifetime)) + 1));
                //console.log(fontFactor);
                if (fontFactor < 1 || isNaN(fontFactor)) fontFactor = 0; //Workaround
                var fontSize = 10 * fontFactor;
                context.font = (fontSize) + "px Arial";
                context.fillText("+" + this.score, this.position.x, this.position.y);
              }
              scoreGameObject.physics.addForce(new Vector3(0, -100, 0));
              addGameObject(scoreGameObject);
              self.deleteOnRestart.push(scoreGameObject);

              // change sprite
              this.spriteType = 1;
              // add player game object time disoriented
              self.animalGameObject.unstableTime += 3000;
              self.animalGameObject.animIndex = 0;
              this.used = true;
              //deleteGameObject(this);
            }
          }
        }
        addGameObject(playableGameObject);
        this.deleteOnRestart.push(playableGameObject);
      }


    }
  }
}
