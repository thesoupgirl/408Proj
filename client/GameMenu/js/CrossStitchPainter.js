// A coloring game emulating cross stitch, fill colors from a given coded legend in a grid-based canvas
// Do not rename the GameMode function - As this is necessary for the game engine to load
function GameMode() {
  var self = this; // Standard for a reference to the gamemode
  /**
   * Game State monitors what point/screen this game should have
   * 0 - Empty Canvas
   */
  this.gameState = 0;

  this.start = function() {
    // Painter background
    var bgwidth = 800;
    var bgheight = 600;
    var bgGameObject = new GameObject(new Vector3(0, 0, -1), new Vector2(bgwidth, bgheight), "Canvas Background", false);
    bgGameObject.draw = function() {
        if (self.gameState == 0) {
            context.fillStyle = "#5272bd"
            context.fillRect(this.position.x, this.position.y, this.bounds.x, this.bounds.y);
        }
    };
    addGameObject(bgGameObject);

    //PAINTER UI
    //Painter UI Panel
    var panelWidth = 100;
    var panelHeight = 600;
    var panelGameObject = new GameObject(new Vector3(0, 0, 0), new Vector2(panelWidth, panelHeight), "Painter Panel", false);
    panelGameObject.draw = function() {
        if (self.gameState == 0) {
            context.fillStyle = "#6da0f2"
            context.fillRect(this.position.x, this.position.y, this.bounds.x, this.bounds.y);
        }
    }
    addGameObject(panelGameObject);

    //Button Template
    var buttonWidth = 98;
    var buttonHeight = 98;

    //File Button
    var fileButtonGameObject = new GameObject(new Vector3(0, 0, 1), new Vector2(buttonWidth, buttonHeight), "File Button", false);
    fileButtonGameObject.draw = function() {
        if (self.gameState == 0) {
            context.fillStyle = "#6da0f2"
            context.fillRect(this.position.x, this.position.y, this.bounds.x, this.bounds.y);
            context.lineWidth = 4;
            context.strokeStyle = "#638fe2"
            context.strokeRect(this.position.x, this.position.y, this.bounds.x, this.bounds.y);

            var fileImg = new Image();
            fileImg.src = "../src/game2/file_icon.png";
            context.drawImage(fileImg, this.position.x + 25, this.position.y + 25, this.bounds.x / 2, this.bounds.y / 2);
        }
    };
    addGameObject(fileButtonGameObject);

    //Color Button
    var colorButtonGameObject = new GameObject(new Vector3(0, 100, 1), new Vector2(buttonWidth, buttonHeight), "Color Button", false);
    colorButtonGameObject.draw = function() {
        if (self.gameState == 0) {
            context.fillStyle = "#6da0f2"
            context.fillRect(this.position.x, this.position.y, this.bounds.x, this.bounds.y);
            context.lineWidth = 4;
            context.strokeStyle = "#638fe2"
            context.strokeRect(this.position.x, this.position.y, this.bounds.x, this.bounds.y);

            var colorImg = new Image();
            colorImg.src = "../src/game2/color_icon.png";
            context.drawImage(colorImg, this.position.x + 25, this.position.y + 25, this.bounds.x / 2, this.bounds.y / 2);
        }
    };
    addGameObject(colorButtonGameObject);

    //Scrolling Palette
    var scrollPaletteGameObject = new GameObject(new Vector3(0, 200, 1), new Vector2(buttonWidth, buttonHeight * 2), "Scrolling Palette", false);
    scrollPaletteGameObject.draw = function() {
        if (self.gameState == 0) {
            context.fillStyle = "#82a9f9"
            context.fillRect(this.position.x, this.position.y, this.bounds.x, this.bounds.y);
        }
    };
    addGameObject(scrollPaletteGameObject);

    //Drag Button
    var dragButtonGameObject = new GameObject(new Vector3(0, 400, 1), new Vector2(buttonWidth, buttonHeight), "Drag Button", false);
    dragButtonGameObject.draw = function() {
        if (self.gameState == 0) {
            context.fillStyle = "#6da0f2"
            context.fillRect(this.position.x, this.position.y, this.bounds.x, this.bounds.y);
            context.lineWidth = 4;
            context.strokeStyle = "#638fe2"
            context.strokeRect(this.position.x, this.position.y, this.bounds.x, this.bounds.y);

            var handImg = new Image();
            handImg.src = "../src/game2/drag_icon.png";
            context.drawImage(handImg, this.position.x + 25, this.position.y + 25, this.bounds.x / 2, this.bounds.y / 2);
        }
    };
    addGameObject(dragButtonGameObject);

    //Zoom Button
    var zoomButtonGameObject = new GameObject(new Vector3(0, 500, 1), new Vector2(buttonWidth, buttonHeight), "Zoom Button", false);
    zoomButtonGameObject.draw = function() {
        if (self.gameState == 0) {
            context.fillStyle = "#6da0f2"
            context.fillRect(this.position.x, this.position.y, this.bounds.x, this.bounds.y);
            context.lineWidth = 4;
            context.strokeStyle = "#638fe2"
            context.strokeRect(this.position.x, this.position.y, this.bounds.x, this.bounds.y);

            var zoomImg = new Image();
            zoomImg.src = "../src/game2/zoom_icon.png";
            context.drawImage(zoomImg, this.position.x + 25, this.position.y + 25, this.bounds.x / 2, this.bounds.y / 2);
        }
    };
    addGameObject(zoomButtonGameObject);

  };

  this.tick = function() {

  };

};
