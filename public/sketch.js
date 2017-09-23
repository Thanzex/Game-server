var socket;
var playScreen = 0;
var readyImg;
var mgr;
var descriptionImages = [];
var resultImages = [];
var welcome_image;
var knowYourFateImage;
var selectionImage;
var playAgainImage;

var titleFont;
var normalFont;
var i;
var otherPlayerCompleted = false;
var otherChoice;
var choice;
var end;

var HOST = 'localhost';

var symbolSize = 24;
var streams = [];

let padToFour = number => number <= 9999 ? ("000" + number).slice(-4) : number;

/* here we load our images */
function preload() {

  titleFont = loadFont("/fonts/EUROS3.ttf");
  normalFont = loadFont("/fonts/simhei.ttf");

  readyImg = loadImage('assets/images/READY.jpeg');
  selectionImage = loadImage('assets/images/selection_screen.png');
  welcome_image = loadImage('assets/images/welcome_screen_new.jpg');
  knowYourFateImage = loadImage('assets/images/waiting_screen.jpeg');
  playAgainImage = loadImage('assets/images/playagain_screen.jpeg');

  for (var i = 0; i < 10; i++) {
    descriptionImages[i] = loadImage("assets/images/" + padToFour(i + 2) + ".jpg");
  }
  for (var i = 0; i < 8; i++) {
    resultImages[i] = loadImage("assets/images/" + padToFour(i + 16) + ".jpg")
  }
}

var fps = 30;

function setup() {
  frameRate(fps);

  for (var i = 0; i < 10; i++) {
    descriptionImages[i].resize(windowWidth, 0);
  }
  for (var i = 0; i < 8; i++) {
    resultImages[i].resize(windowWidth, 0);
  }
  readyImg.resize(windowWidth / 2, 0);

  createCanvas(windowWidth, windowHeight);

  fill(255);
  //Connection to the server
  socket = io.connect("http://" + HOST + ":3000"); //open connection
  socket.on('selection', waitForYou); //selection event trigger
  socket.on('reset', function() {
    location.reload();
  }); //reset event trigger function


  mgr = new SceneManager();

  mgr.addScene(titleScreen_);
  mgr.addScene(descriptionScreen_);
  mgr.addScene(readyScreen_);
  mgr.addScene(selectionScreen_);
  mgr.addScene(waitScreen_);
  mgr.addScene(resultScreen_);
  mgr.addScene(playAgainScreen_);

  mgr.showNextScene();
}

function draw() {
  mgr.draw();
}

function mousePressed() {
  mgr.mousePressed();
}

function keyPressed() {
  mgr.keyPressed();
}

// =============================================================
// =                         BEGIN SCENES                      =
// =============================================================

function titleScreen_() {
  this.setup = function() {
    background('black');
    image(welcome_image, width / 2 - welcome_image.width / 2, height / 2 - welcome_image.height / 2);
  }

  this.mousePressed = function() {
    mgr.showNextScene();
  }
  this.keyPressed = function() {
    mgr.showNextScene();
  }
}

function descriptionScreen_() {
  var secStatus = 0
  this.setup = function() {
    background('black');
    secStatus = 0;
  }

  this.draw = function() {
    background('black');
    image(descriptionImages[secStatus], width / 2 - descriptionImages[secStatus].width / 2,
      height / 2 - descriptionImages[secStatus].height / 2);
  }

  this.keyPressed = function() {
    if (keyCode === LEFT_ARROW) {
      if (secStatus > 0) secStatus -= 1;
    } else if (keyCode === RIGHT_ARROW) {
      if (secStatus < 9) secStatus += 1;
      else mgr.showNextScene();
    }

  }
  this.mousePressed = function() {}
}

function readyScreen_() {
  this.setup = function() {
    background('black');
    image(readyImg, width / 2 - readyImg.width / 2, height / 2 - readyImg.height / 2);
  }

  this.keyPressed = function() {
    if (keyCode === LEFT_ARROW) {
    } else if (keyCode === RIGHT_ARROW) {
      mgr.showNextScene();
    }
  }
}

function selectionScreen_() {
  this.setup = function() {
    sendData('Deciding.');
    background('black');
    image(selectionImage, width / 2 - selectionImage.width / 2, height / 2 - selectionImage.height / 2);
    //  /* ===============MATRIX==============
    background('black');
    var x = 0;
    var y = 0;
    for (var i = 0; i <= windowWidth / symbolSize; i++) {
      var stream = new Stream_();
      stream.generateSymbols(x, y);
      streams.push(stream);
      x += symbolSize
    }
    textSize(symbolSize);
    //  */ //==============MATRIX==============
  }

  this.draw = function() {
    ///* ===============MATRIX==============
    background(0);
    streams.forEach(function(stream) {
      stream.render();
    });
    image(selectionImage, width / 2 - selectionImage.width / 2, height / 2 - selectionImage.height / 2);
    //*/ //==============MATRIX==============
    if (otherPlayerCompleted) {
      //add text or sound
    }
  }

  function Symbol(x, y, speed) {
    this.x = x;
    this.y = y;
    this.value = 0;
    this.speed = speed;
    this.switchInterval = round(random(2, 20));

    this.setToRandomSymbol = function() {
      if (frameCount % this.switchInterval == 0) {
        this.value = (random() > 0.5) ? 0 : 1;
      }
    }

    this.rain = function() {
      this.y = (this.y >= height) ? 0 : this.y += this.speed;
    }
  }

  function Stream_() {
    this.symbols = [];
    this.totalSymbols = round(height / 24);
    this.speed = random(6, 18);

    this.generateSymbols = function(x, y) {
      for (var i = 0; i <= this.totalSymbols; i++) {
        this.symbol = new Symbol(x, y, this.speed);
        this.symbol.setToRandomSymbol();
        this.symbols.push(this.symbol);
        y -= symbolSize;
      }
    }

    this.render = function() {
      this.symbols.forEach(function(symbol) {
        fill(0, 24, 255);
        text(symbol.value, symbol.x, symbol.y);
        symbol.rain();
        symbol.setToRandomSymbol();
      });
    }
  }

  this.keyPressed = function() {
    if (keyCode === LEFT_ARROW) {
      //SILENT
      sendSelection('silent');
      choice = 'silent'
      if (!otherPlayerCompleted) mgr.showNextScene();
      else mgr.showScene(resultScreen_);
    } else if (keyCode === RIGHT_ARROW) {
      //TALK
      sendSelection('talk');
      choice = 'talk'
      if (!otherPlayerCompleted) mgr.showNextScene();
      else mgr.showScene(resultScreen_);
    }
  }
}

function waitScreen_() {
  this.setup = function() {
    background('black');
    image(knowYourFateImage, width / 2 - knowYourFateImage.width / 2, height / 2 - knowYourFateImage.height / 2);

  }

  this.draw = function() {
    //POSSIBLE GIF
    if (otherPlayerCompleted) {
      console.log("Done");
      mgr.showNextScene();
    }
  }
}


function resultScreen_() {
  var secStatus = 0;
  this.setup = function() {
    console.log("Result screen");
    if (otherChoice == 'silent' && choice == 'silent') end = 0; //BOTH SILENT
    else if (otherChoice == 'talk' && choice == 'talk') end = 1; //BOTH TALK
    else if (otherChoice == 'talk' && choice == 'silent') end = 2; //OTHER TALKED
    else if (otherChoice == 'silent' && choice == 'talk') end = 3; //YOU TALKED
  }

  this.draw = function() {
    background('black');
    image(resultImages[secStatus + end * 2], windowWidth / 2 - resultImages[secStatus + end * 2].width / 2, windowHeight / 2 - resultImages[secStatus + end * 2].height / 2);
  }

  this.keyPressed = function() {
    if (keyCode === RIGHT_ARROW) {
      if (secStatus == 0) secStatus += 1;
      else mgr.showNextScene();
    }

  }

}

function playAgainScreen_() {
  this.setup = function() {
    background('black');
    image(playAgainImage, width / 2 - playAgainImage.width / 2, height / 2 - playAgainImage.height / 2);
  }

  this.keyPressed = function() {
    console.log('key pressed');
    disconnect_();
  }

  //this.draw = function() {}
}

//==================================================================
//=                         END SCENES                             =
//==================================================================

function sendSelection(choice) {
  var data = {
    'choice': choice
  }
  console.log("Sending choice: " + data.choice);
  socket.emit('selection', data);
}

function sendData(data) {
  var send = {
    'choice': data
  }
  console.log("Sending data: " + send.choice);
  socket.emit('stats', send);
}

function disconnect_() {
  console.log("Disconnecting.");
  socket.disconnect();
  location.reload();
}

function waitForYou(choice) {
  otherPlayerCompleted = true;
  otherChoice = choice.choice;
}
//===========================MATRIX FUNCTIONS=======================//
