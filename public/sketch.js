var introText = ["zero","one","two","three","four"];
var introIndex = 0;

var socket;

var playScreen = 0;
var img;

/* here we load our images */
function preload() {
  //img = loadImage("assets/background.jpg");
}


function setup() {
  createCanvas(windowWidth, windowHeight);

  fill(255);

  socket = io.connect("http://localhost:3000");           //open connection
  socket.on('selection',changeText);                      //selection event trigger *changetext*
  socket.on('reset', function() { location.reload(); });  //reset event trigger function
}

function changeText(data) {                               //test placeholder
  introText[0]=data.scelta;

}

function mousePressed() {                                 //send data placeholder
  var data = {
    messaggio: "scelta effettuata",
    scelta: "collaborare"
  }
  socket.emit('selection',data);
}

function draw() {
  clear();
  background(0);

  if (playScreen === 0) {
      startScreen();

  } else if (playScreen === 1) {
  // this will be our game
  ellipse(width/2,height/2,50,50);
  } else if (playScreen === 2) {
      // this will be our end screen

}
}


////////// more functions

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
