var introText = ["zero","one","two","three","four"];
var introIndex = 0;

var socket;

var playScreen = 0;
var img;
var mgr;

/* here we load our images */
function preload() {
  //img = loadImage("assets/background.jpg");
}



function setup() {
  createCanvas(windowWidth, windowHeight);

  fill(255);
  //Connection to the server
  socket = io.connect("http://localhost:3000");           //open connection
  socket.on('selection',changeText);                      //selection event trigger *changetext*
  socket.on('reset', function() { location.reload(); });  //reset event trigger function


  mgr = new sceneManager();

  mgr.addScene( titleScreen_ );
  mgr.addScene( descriptionScreen_ );
  mgr.addScene( readyScreen_ );
  mgr.addScene( selectionScreen_ );
  mgr.addScene( resultScreen_ );
  mgr.addScene( playAgainScreen_ );
}

function draw() {
  mgr.draw();
}

function mousePressed()
{
    mgr.mousePressed();
}

// =============================================================
// =                         BEGIN SCENES                      =
// =============================================================

function titleScreen_() {
    this.setup = function() {
    }

    this.draw = function() {
    }
}

function descriptionScreen_() {
    this.setup = function() {
    }

    this.draw = function() {
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
