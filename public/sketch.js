//var introText = ["zero","one","two","three","four"];
//var introIndex = 0;

var socket;

var playScreen = 0;
var img;
var mgr;
var descriptionImages = [];

var titleFont;
var normalFont;
var i;

let padToFour = number => number <= 9999 ? ("000"+number).slice(-4) : number;

/* here we load our images */
function preload() {

    titleFont = loadFont("/fonts/EUROS3.ttf");
    normalFont = loadFont("/fonts/simhei.ttf");
    img = loadImage("assets/handcuffs_PNG5.png");

    for (var i = 0; i < 10; i++) {
      descriptionImages[i] = loadImage("assets/images/" + padToFour(i+2) +".jpg");
      descriptionImages[i].resize(100,100);
    }
}



function setup() {

  for (var i = 0; i < 10; i++) {
    descriptionImages[i].resize(windowWidth/2,0);
  }

  createCanvas(windowWidth, windowHeight);

  fill(255);
  //Connection to the server
  socket = io.connect("http://localhost:3000");           //open connection
  //socket.on('selection',changeText);                      //selection event trigger *changetext*
  socket.on('reset', function() { location.reload(); });  //reset event trigger function


  mgr = new SceneManager();

  mgr.addScene( titleScreen_ );
  mgr.addScene( descriptionScreen_ );
  mgr.addScene( readyScreen_ );
  mgr.addScene( selectionScreen_ );
  mgr.addScene( resultScreen_ );
  mgr.addScene( playAgainScreen_ );

  mgr.showNextScene();
}

function draw() {
  mgr.draw();
}

function mousePressed()
{
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
      textSize(50);
      textFont(titleFont);
      textStyle(BOLD);
      fill('white');
      textAlign(CENTER);
      text("PARTNERS IN CRIME",width/2,height/2);
    }

    //this.draw = function() {
    //}

    this.mousePressed = function() {
      mgr.showNextScene();
    }
}

function descriptionScreen_() {
  var secStatus = 0
    this.setup = function() {
        background('black');
    }

    this.draw = function() {
      background('black');
      image(descriptionImages[secStatus],width/2 -descriptionImages[secStatus].width/2,
                                        height/2 -descriptionImages[secStatus].height/2  );
    }

    this.keyPressed = function () {
      if (keyCode === LEFT_ARROW) {
        if (secStatus > 0 ) secStatus -= 1;
      }
      else if (keyCode === RIGHT_ARROW) {
        if (secStatus <11 ) secStatus += 1;
        else mgr.showNextScene();
      }

    }
}

function readyScreen_() {
    this.setup = function() {
    }

    this.draw = function() {
    }
}

function selectionScreen_() {
    this.setup = function() {
    }

    this.draw = function() {
    }
}

function resultScreen_() {
    this.setup = function() {
    }

    this.draw = function() {
    }
}

function playAgainScreen_() {
    this.setup = function() {
    }

    this.draw = function() {
    }
}


function sendSelection(selection) {
  var data = {
    scelta: selection
  }
  socket.emit('selection',data);
}

////////// more functions
/*
function startScreen() {
   //image(img, 0, 0);

    textSize(25);
    text(introText[introIndex], width/2,height/2);
  if (introIndex ===3) {
    playScreen=1;
  }

}

function keyPressed(){

  if (playScreen === 0) {
    if (keyCode === LEFT_ARROW) {
      introIndex-=1;
    }
    else if (keyCode === RIGHT_ARROW) {
      introIndex+=1;
    }
  }


  if (playScreen === 1) {
    if (keyCode === LEFT_ARROW) {
      // option 1
    }
    else if (keyCode === RIGHT_ARROW) {
      // option 2
    }
  }

} // end keyPressed
*/
