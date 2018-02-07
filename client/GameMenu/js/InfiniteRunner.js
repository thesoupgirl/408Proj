// An infinite runner

// Do not rename the GameMode function - As this is necessary for the game engine to load
function GameMode() {
  /**
  * Game State monitors what point/screen this game should have
  * 0 - Title screen
  * 1 - Character Select
  * 2 - Game
  * 3 - Game Over
  */
  var gameState = 0;
  /**
  * Dog = 0, Cat = 1 cuz dogs are better
  */
  var animalSelect = 0;

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
      if (gameState == 0) {
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
      if (gameState == 0) {
        context.fillStyle = "#FFFFFF";
        context.fillRect(this.position.x,this.position.y,this.bounds.x,this.bounds.y);
        context.fillStyle = "#000000";
        context.strokeRect(this.position.x, this.position.y, this.bounds.x, this.bounds.y);
        context.font = "30px Arial";
        context.fillText("Start",this.position.x + 120,this.position.y + 60);
      }
    }
    startGameObject.onMouseup = function () {
      if (gameState == 0) {
        gameState = 1;
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
      if (gameState == 1) {
        context.fillStyle = "#FFFFFF";
        context.fillRect(this.position.x,this.position.y,this.bounds.x,this.bounds.y);
        context.fillStyle = "#000000";
        context.strokeRect(this.position.x, this.position.y, this.bounds.x, this.bounds.y);
        context.font = "30px Arial";
        context.fillText("Dog",this.position.x + 120,this.position.y + (this.bounds.y/2));
      }
    }
    dogOptionGameObject.onMouseup = function () {
      if (gameState == 1) {
        gameState = 2;
        animalSelect = 0;
      }
    }
    // cat selector
    var catWidth = 300;
    var catHeight = 300;
    var catOptionGameObject = new GameObject(new Vector3(400, (canvas.height / 2) - (catHeight/2), 1), new Vector2(catWidth, catHeight), "Cat button", false);
    catOptionGameObject.clickThrough = true;
    catOptionGameObject.draw = function () {
      if (gameState == 1) {
        context.fillStyle = "#FFFFFF";
        context.fillRect(this.position.x,this.position.y,this.bounds.x,this.bounds.y);
        context.fillStyle = "#000000";
        context.strokeRect(this.position.x, this.position.y, this.bounds.x, this.bounds.y);
        context.font = "30px Arial";
        context.fillText("Cat",this.position.x + 120,this.position.y + (this.bounds.y/2));
      }
    }
    catOptionGameObject.onMouseup = function () {
      if (gameState == 1) {
        gameState = 2;
        animalSelect = 1;
      }
    }
    addGameObject(dogOptionGameObject);
    addGameObject(catOptionGameObject);

    // ALL GAME GAME OBJECTS


    // TODO dog/cat object
    var animalWidth = 80;
    var animalHeight = 50;
    var animalGameObject = new GameObject(new Vector3(400, (canvas.height / 2) - (animalHeight/2), 1), new Vector2(animalWidth, animalHeight), "Animal Object", true);
    animalGameObject.clickThrough = true;
    animalGameObject.physics.gravityScale = 0;
    animalGameObject.physics.drag = 0; // Since we directly set velocity
    animalGameObject.draw = function () {
      if (gameState == 2 || gameState == 3) {
        context.fillStyle = "#FFFFFF";
        context.fillRect(this.position.x,this.position.y,this.bounds.x,this.bounds.y);
        context.fillStyle = "#000000";
        context.strokeRect(this.position.x, this.position.y, this.bounds.x, this.bounds.y);
      }
    }
    animalGameObject.onTick = function () {
      if (gameState != 2) {
        this.position = new Vector3(100, 400, 50);
      }
      else {
        // Idk do the bounds checking thing
        console.log("Position: " + this.position.x + " " + this.position.y);
        // Top: 370
        var top = 370;
        var bottom = canvas.height - animalHeight - 10;
        var left = 0;
        var right = canvas.width - animalWidth;
        if (this.position.y <= top) {
          this.position.y = top;
          if (this.physics.velocity.y < 0) this.physics.velocity.y = 0;
          this.canTop = false;
        } else {
          this.canTop = true;
        }
        if (this.position.y >= bottom) {
          this.position.y = bottom;
          if (this.physics.velocity.y > 0) this.physics.velocity.y = 0;
          this.canBottom = false;
        } else {
          this.canBottom = true;
        }
        if (this.position.x <= left) {
          this.position.x = left;
          if (this.physics.velocity.x < 0) this.physics.velocity.x = 0;
          this.canLeft = false;
        } else {
          this.canLeft = true;
        }
        if (this.position.x >= right) {
          this.position.x = right;
          if (this.physics.velocity.x > 0) this.physics.velocity.x = 0;
          this.canRight = false;
        } else {
          this.canRight = true;
        }

      }
    }
    var baseSpeed = 100;
    this.checkKeyDown = function (e) {
      var code = e.keyCode;
      switch (code) {
          case 37: if (animalGameObject.canLeft) animalGameObject.physics.velocity.x = baseSpeed * -1; break; //Left key
          case 38: if (animalGameObject.canTop) animalGameObject.physics.velocity.y = baseSpeed * -1; break; //Up key
          case 39: if (animalGameObject.canRight) animalGameObject.physics.velocity.x = baseSpeed * 1; break; //Right key
          case 40: if (animalGameObject.canBottom) animalGameObject.physics.velocity.y = baseSpeed * 1; break; //Down key
          default: //Everything else
      }
    }
    this.checkKeyUp = function (e) {
      var code = e.keyCode;
      switch (code) {
          case 37: if (animalGameObject.physics.velocity.x < 0) animalGameObject.physics.velocity.x = 0; break; //Left key
          case 38: if (animalGameObject.physics.velocity.y < 0) animalGameObject.physics.velocity.y = 0; break; //Up key
          case 39: if (animalGameObject.physics.velocity.x > 0) animalGameObject.physics.velocity.x = 0; break; //Right key
          case 40: if (animalGameObject.physics.velocity.y > 0) animalGameObject.physics.velocity.y = 0; break; //Down key
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
      if (gameState == 2 || gameState == 3) {
        context.fillStyle = "#FFFFFF";
        context.fillRect(this.position.x,this.position.y,this.bounds.x,this.bounds.y);
        context.fillStyle = "#000000";
        context.strokeRect(this.position.x, this.position.y, this.bounds.x, this.bounds.y);
        context.font = "30px Arial";
        context.fillText("Score: " + this.score,this.position.x + 20,this.position.y + (this.bounds.y/2) + 10);
      }
    }
    scoreCounterGameObject.onTick = function () {
      if (gameState != 2) {
        this.startTime = time;
      } else {
        this.score = (time - this.startTime)/10;
      }
    }
    addGameObject(animalGameObject);
    addGameObject(scoreCounterGameObject);
    // ALL GAME OVER GAME OBJECTS

    // game over title
    var gameOverWidth = 450;
    var gameOverHeight = 200;
    var gameOverGameObject = new GameObject(new Vector3((canvas.width / 2) - gameOverWidth/2, (canvas.height / 2) - (gameOverHeight/2) - 100, 0), new Vector2(gameOverWidth, gameOverHeight), "Game Over Title", false);
    gameOverGameObject.draw = function () {
      if (gameState == 3) {
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
    var restartGameObject = new GameObject(new Vector3((canvas.width / 2) - restartWidth/2, (canvas.height / 2) - (restartHeight/2) + 100, 0), new Vector2(restartWidth, restartHeight), "Restart button", false);
    restartGameObject.clickThrough = true;
    restartGameObject.draw = function () {
      if (gameState == 3) {
        context.fillStyle = "#FFFFFF";
        context.fillRect(this.position.x,this.position.y,this.bounds.x,this.bounds.y);
        context.fillStyle = "#000000";
        context.strokeRect(this.position.x, this.position.y, this.bounds.x, this.bounds.y);
        context.font = "30px Arial";
        context.fillText("Restart",this.position.x + 100,this.position.y + 60);
      }
    }
    restartGameObject.onMouseup = function () {
      if (gameState == 3) {
        gameState = 1;
      }
    }

    addGameObject(gameOverGameObject);
    addGameObject(restartGameObject);



  }
  // Nextspawn is for ensuring that the next item isn't colliding
  this.nextSpawnNoCollide = 0;
  this.tick = function() {
    // Called every frame update

    // TODO if game state is game, spawn (nocollides, collides, treats) that move and despawn
    if (gameState == 2) {
      var backgroundVelocity = -80;
      var movingTicking = function() {
        if (gameState == 2) {
          this.physics.velocity.x = backgroundVelocity;
          //console.log(this);
          if (this.position.x + this.bounds.x < 0) {
            deleteGameObject(this);
          }
        } else {
          this.physics.velocity.x = 0;
        }
      }

      // NoCollide moving objects
      var noCollideRate = 5;

      if (time > this.nextSpawnNoCollide && Math.random() < (0.2/(timeInc * noCollideRate))) {
        var decorType = (Math.random() * 4).toFixed(0);
          console.log("Spawning a thing of type " + decorType);
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
        this.nextSpawnNoCollide = time + (-1000 * decorDimensions.x / backgroundVelocity);
        console.log("Next spawn no collide: in " + (this.nextSpawnNoCollide - time));
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
      }

    }
  }
}
