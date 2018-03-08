// A coloring game emulating cross stitch, fill colors from a given coded legend in a grid-based canvas
// Do not rename the GameMode function - As this is necessary for the game engine to load
function GameMode() {
  var self = this; // Standard for a reference to the gamemode
  /**
   * Game State monitors what point/screen this game should have
   * 0 - Empty Canvas
   * 1 - Canvas Exists
   */
  this.gameState = 0;

  /**
   * File Window State monitors what point/screen this file window should have
   * 0 - Closed
   * 1 - Open
   * 2 - Template Choice
   * 3 - Warning
   */
  this.fileWindowState = 0;
  this.clicked = false;

  /**
   * Temporary value for template choice
   * 0 - None
   * 1
   * 2
   * 3
   * 4 - Blank
   */
  this.tempTemplateChoice = 0;

  this.colorEnabled = false;
  this.dragEnabled = false;
  this.zoomEnabled = false;

  this.blankWidth = 0;
  this.blankHeight = 0;

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
    var bgGameObject = new GameObject(new Vector3(0, 0, -5), new Vector2(bgwidth, bgheight), "Canvas Background", false);
    bgGameObject.draw = function() {
        context.fillStyle = "#5272bd"
        context.fillRect(this.position.x, this.position.y, this.bounds.x, this.bounds.y);

    };
    addGameObject(bgGameObject);


    //This is the canvas object that will be painted on
    var gridEdgeLen = 100;
    var i;
    //First Canvas
    var firstCanvasGameObject = new GameObject(new Vector3(100, 0, -2), new Vector2(gridEdgeLen, gridEdgeLen), "First Canvas", false);
    firstCanvasGameObject.gridArray = [];
    for (i = 0; i < 4; i++) {
        firstCanvasGameObject.gridArray.push(false);
    }
    //console.log(firstCanvasGameObject.gridArray[0]);

    firstCanvasGameObject.draw = function(itisme) {
        
        for (i = 0; i < 8; i++) {
            var gridGameObject = new GameObject(new Vector3(this.position.x + 50 * (i % 2), this.position.y + 50 * (Math.floor(i / 2)), -1), new Vector2(gridEdgeLen / 2, gridEdgeLen / 2), "Grid", false);
            gridGameObject.myindex = i;
            gridGameObject.draw = function(itisme) {
                if (!firstCanvasGameObject.gridArray[itisme.myindex]) {
                    context.fillStyle = "#FFFFFF";
                } else {
                    context.fillStyle = "#FF0000";
                    //console.log(firstCanvasGameObject.gridArray);
                    //console.log("filling red at " + i);
                }
                context.fillRect(this.position.x, this.position.y, this.bounds.x, this.bounds.y);
                context.lineWidth = 2;
                context.strokeStyle = "#000000";
                context.strokeRect(this.position.x, this.position.y, this.bounds.x, this.bounds.y);

            };
            //console.log("before " + i);
      
            gridGameObject.onMouseup = function(x, y, itisme) {
                //console.log(itisme.myindex);
                if (!firstCanvasGameObject.gridArray[itisme.myindex]) {
                    console.log("Grid clicked");
                    firstCanvasGameObject.gridArray[itisme.myindex] = true;
                }
            };
            //console.log("after" + i);
            addGameObject(gridGameObject);
        }

        //context.fillStyle = "#FFFFFF";
        //context.fillRect(this.position.x, this.position.y, this.bounds.x, this.bounds.y);
    };
    /*
    firstCanvasGameObject.onMouseup = function() {
        context.fillStyle = "#FF0000";
        context.fillRect(this.position.x, this.position.y, this.bounds.x, this.bounds.y);
    }
    */
    addGameObject(firstCanvasGameObject);



    //PAINTER UI
    //Painter UI Panel
    var panelWidth = 100;
    var panelHeight = 600;
    var panelGameObject = new GameObject(new Vector3(0, 0, -4), new Vector2(panelWidth, panelHeight), "Painter Panel", false);
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
        } else {
            self.fileWindowState = 0;
        } 
    };
    addGameObject(fileButtonGameObject);

    //File Window for choosing between loading an existing template or starting a blank canvas
    //File Window
    var fileWindowWidth = 200;
    var fileWindowHeight = 100;
    var fileWindowGameObject = new GameObject(new Vector3(100, 0, 2), new Vector2(fileWindowWidth, fileWindowHeight), "File Window", false);

    fileWindowGameObject.draw = function() {
        if (self.fileWindowState > 0) {
            context.fillStyle = "#6da0f2"
            context.fillRect(this.position.x, this.position.y, this.bounds.x, this.bounds.y);
            context.lineWidth = 4;
            context.strokeStyle = "#638fe2"
            context.strokeRect(this.position.x, this.position.y, this.bounds.x, this.bounds.y);
        }
    };
    addGameObject(fileWindowGameObject);


    //Template Button
    var fileChoiceButtonWidth = 200;
    var fileChoiceButtonHeight = 50;
    var fileChoiceTemplateButtonGameObject = new GameObject(new Vector3(100, 0, 3), new Vector2(fileChoiceButtonWidth, fileChoiceButtonHeight), "Template Choice", false);
    fileChoiceTemplateButtonGameObject.clickThrough = true;
    fileChoiceTemplateButtonGameObject.draw = function() {
        if (self.fileWindowState > 0) {
            fileChoiceTemplateButtonGameObject.clickThrough = false;
            context.fillStyle = "#6da0f2"
            context.fillRect(this.position.x, this.position.y, this.bounds.x, this.bounds.y);
            context.lineWidth = 4;
            context.strokeStyle = "#638fe2"
            context.strokeRect(this.position.x, this.position.y, this.bounds.x, this.bounds.y);
            context.fillStyle = "#FFFFFF";
            context.font = "25px Arial";
            context.fillText("Load Template", this.position.x + 17, this.position.y + 35);
        } else {
            fileChoiceTemplateButtonGameObject.clickThrough = true;
        }
    }
    fileChoiceTemplateButtonGameObject.onMouseup = function() {
        if (self.fileWindowState > 0) {
            console.log("Load Template clicked");
            self.fileWindowState = 2;
            console.log("file Window State = " + self.fileWindowState);
        }
    };
    addGameObject(fileChoiceTemplateButtonGameObject);

    //Blank Button
    var fileChoiceBlankButtonGameObject = new GameObject(new Vector3(100, 50, 3), new Vector2(fileChoiceButtonWidth, fileChoiceButtonHeight), "Blank Choice", false);
    fileChoiceBlankButtonGameObject.draw = function() {
        if (self.fileWindowState > 0) {
            context.fillStyle = "#6da0f2"
            context.fillRect(this.position.x, this.position.y, this.bounds.x, this.bounds.y);
            context.lineWidth = 4;
            context.strokeStyle = "#638fe2"
            context.strokeRect(this.position.x, this.position.y, this.bounds.x, this.bounds.y);
            context.fillStyle = "#FFFFFF";
            context.font = "25px Arial";
            context.fillText("Create Blank", this.position.x + 25, this.position.y + 35);
        }
    }
    fileChoiceBlankButtonGameObject.onMouseup = function() {
        var bW = 0;
        var bH = 0;
        self.tempTemplateChoice = 4;
        if (self.fileWindowState > 0) {
            bW = prompt("Please enter the dimensions \nEnter the width", "");
            while (bW <= 0 || isNaN(bW)) {
                if (bW == null) {
                    bW = 0;
                    break;
                }
                bW = prompt("Invalid input.\nEnter the width", "");
            }
            bH = prompt("Enter the height", "");
            while (bH <= 0 || isNaN(bH)) {
                if (bH == null) {
                    bH = 0;
                    break;
                }
                bH = prompt("Invalid input.\nEnter the height", "");
            }
            self.blankWidth = bW;
            self.blankHeight = bH;
            console.log(self.blankWidth * self.blankHeight);

            if (bW * bH != 0) {
                if (self.gameState == 1) {
                    self.fileWindowState = 3;
                } else {
                    //console.log("gameState is " + self.gameState);
                    self.gameState = 1;
                    self.fileWindowState = 0;
                    console.log("Running blank template of size" + bW + " * " + bH);
                }
            }
        }
    };
    addGameObject(fileChoiceBlankButtonGameObject);


    //TEMPLATE SECTION
    //Template One
    var templateButtonEdgeLen = 50;
    var tempOneButtonGameObject = new GameObject(new Vector3(305, 0, 4), new Vector2(templateButtonEdgeLen, templateButtonEdgeLen), "Template One Button", false);
    tempOneButtonGameObject.draw = function() {
        if (self.fileWindowState > 1) {
            console.log("template 1 drawn");
            context.fillStyle = "#6da0f2"
            context.fillRect(this.position.x, this.position.y, this.bounds.x, this.bounds.y);
            context.lineWidth = 4;
            context.strokeStyle = "#638fe2"
            context.strokeRect(this.position.x, this.position.y, this.bounds.x, this.bounds.y);
            context.fillStyle = "#FFFFFF";
            context.font = "30px Arial";
            context.fillText("1", this.position.x + 16, this.position.y + 35);
        }
    };
    tempOneButtonGameObject.onMouseup = function() {
        if (self.fileWindowState > 1) {
            self.tempTemplateChoice = 1;
            if (self.gameState != 0) {
                self.fileWindowState = 3;
            } else {
                self.gameState = 1;
                self.fileWindowState = 0;
                console.log("Running first template");
            }
        }
    };
    addGameObject(tempOneButtonGameObject);

    //Template Two
    var tempTwoButtonGameObject = new GameObject(new Vector3(355, 0, 4), new Vector2(templateButtonEdgeLen, templateButtonEdgeLen), "Template Two Button", false);
    tempTwoButtonGameObject.draw = function() {
        if (self.fileWindowState > 1) {
            context.fillStyle = "#6da0f2"
            context.fillRect(this.position.x, this.position.y, this.bounds.x, this.bounds.y);
            context.lineWidth = 4;
            context.strokeStyle = "#638fe2"
            context.strokeRect(this.position.x, this.position.y, this.bounds.x, this.bounds.y);
            context.fillStyle = "#FFFFFF";
            context.font = "30px Arial";
            context.fillText("2", this.position.x + 16, this.position.y + 35);
        }
    };
    tempTwoButtonGameObject.onMouseup = function() {
        if (self.fileWindowState > 1) {
            self.tempTemplateChoice = 2;
            if (self.gameState != 0) {
                self.fileWindowState = 3;
            } else {
                self.gameState = 1;
                self.fileWindowState = 0;
                console.log("Running second template");
            }
        }
    };
    addGameObject(tempTwoButtonGameObject);

    //Template Three
    var tempThreeButtonGameObject = new GameObject(new Vector3(405, 0, 4), new Vector2(templateButtonEdgeLen, templateButtonEdgeLen), "Template Three Button", false);
    tempThreeButtonGameObject.draw = function() {
        if (self.fileWindowState > 1) {
            context.fillStyle = "#6da0f2"
            context.fillRect(this.position.x, this.position.y, this.bounds.x, this.bounds.y);
            context.lineWidth = 4;
            context.strokeStyle = "#638fe2"
            context.strokeRect(this.position.x, this.position.y, this.bounds.x, this.bounds.y);
            context.fillStyle = "#FFFFFF";
            context.font = "30px Arial";
            context.fillText("3", this.position.x + 16, this.position.y + 35);
        }
    };
    tempThreeButtonGameObject.onMouseup = function() {
        if (self.fileWindowState > 1) {
            self.tempTemplateChoice = 3;
            if (self.gameState != 0) {
                self.fileWindowState = 3;
            } else {
                self.gameState = 1;
                self.fileWindowState = 0;
                console.log("Running third template");
            }
        }
    };
    addGameObject(tempThreeButtonGameObject);

    //Warning 
    var warningWindowWidth = 400;
    var warningWindowHeight = 150;
    var warningWindowGameObject = new GameObject(new Vector3(bgwidth / 2 - warningWindowWidth / 2, bgheight / 2 - warningWindowHeight / 2, 4), new Vector2(warningWindowWidth, warningWindowHeight), "File Window", false);
    warningWindowGameObject.draw = function() {
        if (self.fileWindowState == 3) {
            context.fillStyle = "#6da0f2"
            context.fillRect(this.position.x, this.position.y, this.bounds.x, this.bounds.y);
            context.lineWidth = 4;
            context.strokeStyle = "#638fe2"
            context.strokeRect(this.position.x, this.position.y, this.bounds.x, this.bounds.y);
            context.fillStyle = "#FFFFFF";
            context.font = "20px Arial";
            context.fillText("This will overwrite the current canvas.", this.position.x + 35, this.position.y + 35);
            context.fillText("Are you sure you want to", this.position.x + 85, this.position.y + 65);
            context.fillText("start a new template?", this.position.x + 105, this.position.y + 85);

            var optionButtonwidth = 60;
            var optionButtonheight = 30;
            var yesButtonGameObject = new GameObject(new Vector3(bgwidth / 2 - warningWindowWidth / 4, bgheight / 2 + warningWindowHeight / 8 + 10, 5), new Vector2(optionButtonwidth, optionButtonheight), "Yes Button", false);
            yesButtonGameObject.draw = function() {
                if (self.fileWindowState == 3) {
                    context.fillStyle = "#6da0f2"
                    context.fillRect(this.position.x, this.position.y, this.bounds.x, this.bounds.y);
                    context.lineWidth = 4;
                    context.strokeStyle = "#638fe2"
                    context.strokeRect(this.position.x, this.position.y, this.bounds.x, this.bounds.y);
                    context.fillStyle = "#FFFFFF";
                    context.font = "20px Arial";
                    context.fillText("Yes", this.position.x + 15, this.position.y + 22);
                }

            }
            yesButtonGameObject.onMouseup = function() {
                if (self.fileWindowState == 3) {
                    //console.log("Starting new template of choice " + self.tempTemplateChoice)
                    self.gameState = 1;
                    self.fileWindowState = 0;
                    //self.tempTemplateChoice = 0;
                }
            };
            addGameObject(yesButtonGameObject);

            var noButtonGameObject = new GameObject(new Vector3(bgwidth / 2 - warningWindowWidth / 4 + 140, bgheight / 2 + warningWindowHeight / 8 + 10, 5), new Vector2(optionButtonwidth, optionButtonheight), "No Button", false);
            noButtonGameObject.draw = function() {
                if (self.fileWindowState == 3) {
                    context.fillStyle = "#6da0f2"
                    context.fillRect(this.position.x, this.position.y, this.bounds.x, this.bounds.y);
                    context.lineWidth = 4;
                    context.strokeStyle = "#638fe2"
                    context.strokeRect(this.position.x, this.position.y, this.bounds.x, this.bounds.y);
                    context.fillStyle = "#FFFFFF";
                    context.font = "20px Arial";
                    context.fillText("No", this.position.x + 18, this.position.y + 22);
                }
            }
            noButtonGameObject.onMouseup = function() {
                if (self.fileWindowState == 3) {
                    self.fileWindowState = 2;
                    //self.tempTemplateChoice = 0;
                    //console.log("Returning to current template");
                }
            };
            addGameObject(noButtonGameObject);
        }
    };
    addGameObject(warningWindowGameObject);



    //Color Button
    var colorButtonGameObject = new GameObject(new Vector3(0, 100, 1), new Vector2(buttonWidth, buttonHeight), "Color Button", false);
    colorButtonGameObject.draw = function() {
        if (self.colorEnabled) {
            context.fillStyle = "#a0c0fb";
        } else {
            context.fillStyle = "#6da0f2"
        }
        context.fillRect(this.position.x, this.position.y, this.bounds.x, this.bounds.y);
        context.lineWidth = 4;
        context.strokeStyle = "#638fe2"
        context.strokeRect(this.position.x, this.position.y, this.bounds.x, this.bounds.y);

        var colorImg = new Image();
        colorImg.src = "../src/game2/color_icon.png";
        context.drawImage(colorImg, this.position.x + 25, this.position.y + 25, this.bounds.x / 2, this.bounds.y / 2);
    };
    colorButtonGameObject.onMouseup = function() {
        if (!self.colorEnabled) {
            self.dragEnabled = false;
            self.zoomEnabled = false;
            self.colorEnabled = true;
        }
    };
    addGameObject(colorButtonGameObject);

    //Scrolling Palette
    var scrollPaletteGameObject = new GameObject(new Vector3(0, 200, -3), new Vector2(buttonWidth, buttonHeight * 2), "Scrolling Palette", false);
    scrollPaletteGameObject.draw = function() {
        context.fillStyle = "#82a9f9"
        context.fillRect(this.position.x, this.position.y, this.bounds.x, this.bounds.y);
    };
    addGameObject(scrollPaletteGameObject);

    //Drag Button
    var dragButtonGameObject = new GameObject(new Vector3(0, 400, 1), new Vector2(buttonWidth, buttonHeight), "Drag Button", false);
    dragButtonGameObject.draw = function() {
        if (self.dragEnabled) {
            context.fillStyle = "#a0c0fb";
        } else {
            context.fillStyle = "#6da0f2"
        }        
        context.fillRect(this.position.x, this.position.y, this.bounds.x, this.bounds.y);
        context.lineWidth = 4;
        context.strokeStyle = "#638fe2"
        context.strokeRect(this.position.x, this.position.y, this.bounds.x, this.bounds.y);

        var handImg = new Image();
        handImg.src = "../src/game2/drag_icon.png";
        context.drawImage(handImg, this.position.x + 25, this.position.y + 25, this.bounds.x / 2, this.bounds.y / 2);
    };
    dragButtonGameObject.onMouseup = function() {
        if (!self.dragEnabled) {
            self.dragEnabled = true;
            self.zoomEnabled = false;
            self.colorEnabled = false;
            console.log(self.fileWindowState);
        }
    };
    addGameObject(dragButtonGameObject);

    //Zoom Button
    var zoomButtonGameObject = new GameObject(new Vector3(0, 500, 1), new Vector2(buttonWidth, buttonHeight), "Zoom Button", false);
    zoomButtonGameObject.draw = function() {
        if (self.zoomEnabled) {
            context.fillStyle = "#a0c0fb";
        } else {
            context.fillStyle = "#6da0f2"
        }   
        context.fillRect(this.position.x, this.position.y, this.bounds.x, this.bounds.y);
        context.lineWidth = 4;
        context.strokeStyle = "#638fe2"
        context.strokeRect(this.position.x, this.position.y, this.bounds.x, this.bounds.y);

        var zoomImg = new Image();
        zoomImg.src = "../src/game2/zoom_icon.png";
        context.drawImage(zoomImg, this.position.x + 25, this.position.y + 25, this.bounds.x / 2, this.bounds.y / 2);
        //console.log("zoom drawn");
    };
    zoomButtonGameObject.onMouseup = function() {
        if (!self.zoomEnabled) {
            self.dragEnabled = false;
            self.zoomEnabled = true;
            self.colorEnabled = false;
        }    
    };
    addGameObject(zoomButtonGameObject);





  };

  this.tick = function() {
    // Called every frame update

  };

};
