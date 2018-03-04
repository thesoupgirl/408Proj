// A coloring game emulating cross stitch, fill colors from a given coded legend in a grid-based canvas
// Do not rename the GameMode function - As this is necessary for the game engine to load
function GameMode() {
  var self = this; // Standard for a reference to the gamemode
  /**
   * Game State monitors what point/screen this game should have
   * 0 - Empty Canvas
   * 1 - First Template
   * 2 - Second Template
   * 3 - Third Template
   * 4 - Blank
   */
  this.gameState = 1;

  /**
   * File Window State monitors what point/screen this file window should have
   * 0 - Closed
   * 1 - Choice
   * 2 - Template Select
   * 3 - Define Blank
   * 4 - Warning
   */
  this.fileWindowState = 0;

  //For clearing the canvas
  this.deleteOnRestart = []; //array of game objects to be deleted
  this.clearGame = function() {
    for (var i = 0, len = self.deleteOnRestart.length; i < len; i++) {
      //console.log(gameObjects[i]);
      self.deleteOnRestart[i].destroy = true;
    }
  };

  this.start = function() {
    // Called when the game starts
    // Painter background
    var bgwidth = 800;
    var bgheight = 600;
    var bgGameObject = new GameObject(new Vector3(0, 0, -1), new Vector2(bgwidth, bgheight), "Canvas Background", false);
    bgGameObject.draw = function() {
        context.fillStyle = "#5272bd"
        context.fillRect(this.position.x, this.position.y, this.bounds.x, this.bounds.y);

    };
    addGameObject(bgGameObject);

    //PAINTER UI
    //Painter UI Panel
    var panelWidth = 100;
    var panelHeight = 600;
    var panelGameObject = new GameObject(new Vector3(0, 0, 0), new Vector2(panelWidth, panelHeight), "Painter Panel", false);
    panelGameObject.draw = function() {
        context.fillStyle = "#6da0f2"
        context.fillRect(this.position.x, this.position.y, this.bounds.x, this.bounds.y);
        
    }
    addGameObject(panelGameObject);

    //Button Template
    var buttonWidth = 98;
    var buttonHeight = 98;

    //File Button
    var fileButtonGameObject = new GameObject(new Vector3(0, 0, 1), new Vector2(buttonWidth, buttonHeight), "File Button", false);
    fileButtonGameObject.draw = function() {
        context.fillStyle = "#6da0f2"
        context.fillRect(this.position.x, this.position.y, this.bounds.x, this.bounds.y);
        context.lineWidth = 4;
        context.strokeStyle = "#638fe2"
        context.strokeRect(this.position.x, this.position.y, this.bounds.x, this.bounds.y);

        var fileImg = new Image();
        fileImg.src = "../src/game2/file_icon.png";
        context.drawImage(fileImg, this.position.x + 25, this.position.y + 25, this.bounds.x / 2, this.bounds.y / 2);
        
    };

    fileButtonGameObject.onMouseup = function() {
        //Activate File Window
        if (self.fileWindowState == 0) {
            self.fileWindowState = 1;
        } else if (self.fileWindowState == 1) {
            self.fileWindowState = 0;
        } 
    };
    addGameObject(fileButtonGameObject);

    //File Window for choosing between loading an existing template or starting a blank canvas
    //Fine Window
    var fileWindowWidth = 400;
    var fileWindowHeight = 200;
    var fileWindowGameObject = new GameObject(new Vector3(bgwidth / 2 - fileWindowWidth / 2, bgheight / 2 - fileWindowHeight / 2, 2), new Vector2(fileWindowWidth, fileWindowHeight), "File Window", false);

    fileWindowGameObject.draw = function() {
        if (self.fileWindowState != 0) {
            context.fillStyle = "#6da0f2"
            context.fillRect(this.position.x, this.position.y, this.bounds.x, this.bounds.y);
            context.lineWidth = 4;
            context.strokeStyle = "#638fe2"
            context.strokeRect(this.position.x, this.position.y, this.bounds.x, this.bounds.y);
        }
    };
    addGameObject(fileWindowGameObject);

    //Template Button
    var fileChoiceButtonWidth = 150;
    var fileChoiceButtonHeight = 100;
    var fileChoiceTemplateButtonGameObject = new GameObject(new Vector3(bgwidth / 2 - fileWindowWidth / 2 + 25, bgheight / 2 - fileWindowHeight / 2 + 25, 3), new Vector2(fileChoiceButtonWidth, fileChoiceButtonHeight), "Template Choice", false);
    fileChoiceTemplateButtonGameObject.draw = function() {
        if (self.fileWindowState == 1) {
            context.fillStyle = "#6da0f2"
            context.fillRect(this.position.x, this.position.y, this.bounds.x, this.bounds.y);
            context.lineWidth = 4;
            context.strokeStyle = "#638fe2"
            context.strokeRect(this.position.x, this.position.y, this.bounds.x, this.bounds.y);
            context.fillStyle = "#FFFFFF";
            context.font = "30px Arial";
            context.fillText("Load", this.position.x + 40, this.position.y + 40);
            context.fillText("Template", this.position.x + 15, this.position.y + 80);
        }
    }
    fileChoiceTemplateButtonGameObject.onMouseup = function() {
        if (self.fileWindowState == 1) {
            self.fileWindowState = 2;
        }
    };
    addGameObject(fileChoiceTemplateButtonGameObject);

    //Blank Button
    var fileChoiceBlankButtonGameObject = new GameObject(new Vector3(bgwidth / 2 + 25, bgheight / 2 - fileWindowHeight / 2 + 25, 3), new Vector2(fileChoiceButtonWidth, fileChoiceButtonHeight), "Blank Choice", false);
    fileChoiceBlankButtonGameObject.draw = function() {
        if (self.fileWindowState == 1) {
            context.fillStyle = "#6da0f2"
            context.fillRect(this.position.x, this.position.y, this.bounds.x, this.bounds.y);
            context.lineWidth = 4;
            context.strokeStyle = "#638fe2"
            context.strokeRect(this.position.x, this.position.y, this.bounds.x, this.bounds.y);
            context.fillStyle = "#FFFFFF";
            context.font = "30px Arial";
            context.fillText("Create", this.position.x + 30, this.position.y + 40);
            context.fillText("Blank", this.position.x + 37, this.position.y + 80);
        }
    }
    fileChoiceBlankButtonGameObject.onMouseup = function() {
        if (self.fileWindowState == 1) {
            self.fileWindowState = 3;
        }
    };
    addGameObject(fileChoiceBlankButtonGameObject);

    //Cancel and Return Buttons
    //Return button
    var returnButtonGameObject = new GameObject(new Vector3(bgwidth / 2 - fileWindowWidth / 4 + 25, bgheight / 2 - fileWindowHeight / 2 + 140, 3), new Vector2(fileChoiceButtonWidth, fileChoiceButtonHeight / 2), "Return Button", false);
    returnButtonGameObject.draw = function() {
        if (self.fileWindowState != 1 && self.fileWindowState != 0) {
            context.fillStyle = "#6da0f2"
            context.fillRect(this.position.x, this.position.y, this.bounds.x, this.bounds.y);
            context.lineWidth = 4;
            context.strokeStyle = "#638fe2"
            context.strokeRect(this.position.x, this.position.y, this.bounds.x, this.bounds.y);
            context.fillStyle = "#FFFFFF";
            context.font = "30px Arial";
            context.fillText("Back", this.position.x + 40, this.position.y + 35);
        }
    };

    returnButtonGameObject.onMouseup = function() {
        if (self.fileWindowState > 1) {
            self.fileWindowState = 1;
            console.log("Return button is clicked");
            //console.log("File Window State is: " + self.fileWindowState);
        }
    };
    addGameObject(returnButtonGameObject);

    var cancelButtonGameObject = new GameObject(new Vector3(bgwidth / 2 - fileWindowWidth / 4 + 25, bgheight / 2 - fileWindowHeight / 2 + 140, 3), new Vector2(fileChoiceButtonWidth, fileChoiceButtonHeight / 2), "Cancel Button", false);
    cancelButtonGameObject.draw = function() {
        if (self.fileWindowState == 1) {
            context.fillStyle = "#6da0f2"
            context.fillRect(this.position.x, this.position.y, this.bounds.x, this.bounds.y);
            context.lineWidth = 4;
            context.strokeStyle = "#638fe2"
            context.strokeRect(this.position.x, this.position.y, this.bounds.x, this.bounds.y);
            context.fillStyle = "#FFFFFF";
            context.font = "30px Arial";
            context.fillText("Cancel", this.position.x + 30, this.position.y + 35);
        }
    };
    cancelButtonGameObject.onMouseup = function() {
        if (self.fileWindowState == 1) {
            console.log("Cancel button is clicked");
            self.fileWindowState = 0;
        }
    };
    addGameObject(cancelButtonGameObject);

    //TEMPLATE SECTION
    //Template One
    var templateButtonEdgeLen = 100;
    var tempOneButtonGameObject = new GameObject(new Vector3(bgwidth / 2 - fileWindowWidth / 2 + 25, bgheight / 2 - fileWindowHeight / 2 + 25, 4), new Vector2(templateButtonEdgeLen, templateButtonEdgeLen), "Template One Button", false);
    tempOneButtonGameObject.draw = function() {
        if (self.fileWindowState == 2) {
            context.fillStyle = "#6da0f2"
            context.fillRect(this.position.x, this.position.y, this.bounds.x, this.bounds.y);
            context.lineWidth = 4;
            context.strokeStyle = "#638fe2"
            context.strokeRect(this.position.x, this.position.y, this.bounds.x, this.bounds.y);
            context.fillStyle = "#FFFFFF";
            context.font = "60px Arial";
            context.fillText("1", this.position.x + 35, this.position.y + 70);
        }
    };
    tempOneButtonGameObject.onMouseup = function() {
        console.log("Template 1 button is clicked");
        if (self.gameState != 0) {
            console.log("Template 1 button is clicked");
            self.fileWindowState = 4;
        }
    };
    addGameObject(tempOneButtonGameObject);

    //Template Two
    var tempTwoButtonGameObject = new GameObject(new Vector3(bgwidth / 2 - fileWindowWidth / 8, bgheight / 2 - fileWindowHeight / 2 + 25, 4), new Vector2(templateButtonEdgeLen, templateButtonEdgeLen), "Template Two Button", false);
    tempTwoButtonGameObject.draw = function() {
        if (self.fileWindowState == 2) {
            context.fillStyle = "#6da0f2"
            context.fillRect(this.position.x, this.position.y, this.bounds.x, this.bounds.y);
            context.lineWidth = 4;
            context.strokeStyle = "#638fe2"
            context.strokeRect(this.position.x, this.position.y, this.bounds.x, this.bounds.y);
            context.fillStyle = "#FFFFFF";
            context.font = "60px Arial";
            context.fillText("2", this.position.x + 35, this.position.y + 70);
        }
    };
    addGameObject(tempTwoButtonGameObject);

    //Template Three
    var tempThreeButtonGameObject = new GameObject(new Vector3(bgwidth / 2 + fileWindowWidth / 4 - 25, bgheight / 2 - fileWindowHeight / 2 + 25, 4), new Vector2(templateButtonEdgeLen, templateButtonEdgeLen), "Template Three Button", false);
    tempThreeButtonGameObject.draw = function() {
        if (self.fileWindowState == 2) {
            context.fillStyle = "#6da0f2"
            context.fillRect(this.position.x, this.position.y, this.bounds.x, this.bounds.y);
            context.lineWidth = 4;
            context.strokeStyle = "#638fe2"
            context.strokeRect(this.position.x, this.position.y, this.bounds.x, this.bounds.y);
            context.fillStyle = "#FFFFFF";
            context.font = "60px Arial";
            context.fillText("3", this.position.x + 35, this.position.y + 70);
        }
    };
    addGameObject(tempThreeButtonGameObject);


    //Warning 
    var warningWindowWidth = 400;
    var warningWindowHeight = 200;
    var warningWindowGameObject = new GameObject(new Vector3(bgwidth / 2 - fileWindowWidth / 2, bgheight / 2 - fileWindowHeight / 2, 2), new Vector2(fileWindowWidth, fileWindowHeight), "File Window", false);
    warningWindowGameObject.draw = function() {
        if (self.fileWindowState == 4) {
            context.fillStyle = "#6da0f2"
            context.fillRect(this.position.x, this.position.y, this.bounds.x, this.bounds.y);
            context.lineWidth = 4;
            context.strokeStyle = "#638fe2"
            context.strokeRect(this.position.x, this.position.y, this.bounds.x, this.bounds.y);
            context.fillStyle = "#FFFFFF";
            context.font = "60px Arial";
            context.fillText("Meep", this.position.x + 35, this.position.y + 70);
        }
    }

    //Color Button
    var colorButtonGameObject = new GameObject(new Vector3(0, 100, 1), new Vector2(buttonWidth, buttonHeight), "Color Button", false);
    colorButtonGameObject.draw = function() {
        context.fillStyle = "#6da0f2"
        context.fillRect(this.position.x, this.position.y, this.bounds.x, this.bounds.y);
        context.lineWidth = 4;
        context.strokeStyle = "#638fe2"
        context.strokeRect(this.position.x, this.position.y, this.bounds.x, this.bounds.y);

        var colorImg = new Image();
        colorImg.src = "../src/game2/color_icon.png";
        context.drawImage(colorImg, this.position.x + 25, this.position.y + 25, this.bounds.x / 2, this.bounds.y / 2);
    };
    addGameObject(colorButtonGameObject);

    //Scrolling Palette
    var scrollPaletteGameObject = new GameObject(new Vector3(0, 200, 1), new Vector2(buttonWidth, buttonHeight * 2), "Scrolling Palette", false);
    scrollPaletteGameObject.draw = function() {
        context.fillStyle = "#82a9f9"
        context.fillRect(this.position.x, this.position.y, this.bounds.x, this.bounds.y);
    };
    addGameObject(scrollPaletteGameObject);

    //Drag Button
    var dragButtonGameObject = new GameObject(new Vector3(0, 400, 1), new Vector2(buttonWidth, buttonHeight), "Drag Button", false);
    dragButtonGameObject.draw = function() {
        context.fillStyle = "#6da0f2"
        context.fillRect(this.position.x, this.position.y, this.bounds.x, this.bounds.y);
        context.lineWidth = 4;
        context.strokeStyle = "#638fe2"
        context.strokeRect(this.position.x, this.position.y, this.bounds.x, this.bounds.y);

        var handImg = new Image();
        handImg.src = "../src/game2/drag_icon.png";
        context.drawImage(handImg, this.position.x + 25, this.position.y + 25, this.bounds.x / 2, this.bounds.y / 2);
    };

    dragButtonGameObject.onMouseup = function() {
        console.log("Return button clickThrough: " + returnButtonGameObject.clickThrough);
    };
    addGameObject(dragButtonGameObject);

    //Zoom Button
    var zoomButtonGameObject = new GameObject(new Vector3(0, 500, 1), new Vector2(buttonWidth, buttonHeight), "Zoom Button", false);
    zoomButtonGameObject.draw = function() {
        context.fillStyle = "#6da0f2"
        context.fillRect(this.position.x, this.position.y, this.bounds.x, this.bounds.y);
        context.lineWidth = 4;
        context.strokeStyle = "#638fe2"
        context.strokeRect(this.position.x, this.position.y, this.bounds.x, this.bounds.y);

        var zoomImg = new Image();
        zoomImg.src = "../src/game2/zoom_icon.png";
        context.drawImage(zoomImg, this.position.x + 25, this.position.y + 25, this.bounds.x / 2, this.bounds.y / 2);
    };

    zoomButtonGameObject.onMouseup = function() {
        console.log("Current file window state: " + self.fileWindowState + " Current game state: " + self.gameState);
    };
    addGameObject(zoomButtonGameObject);

  };

  this.tick = function() {
    // Called every frame update

  };

};
