var symbolSize = 24;
var streams = [] ;


function setup() {
  createCanvas(
  window.innerWidth,
  window.innerHeight);

  background (0);
  var x = 0;
  var y = 0;
  for (var i = 0; i <= width / symbolSize; i++) {
    var stream = new Stream ();
    stream.generateSymbols(x,y);
    streams.push(stream);
    x +=symbolSize
    }
  textSize(symbolSize);



}

function draw() {
background (0);
streams.forEach(function(stream) {
  stream.render();

});
}

function Symbol (x,y, speed) {

this.x = x;
this.y = y;

this.value = 0;
this.speed = speed;
this.switchInterval = round (random(2,20));

this.setToRandomSymbol = function () {
if (frameCount % this.switchInterval == 0) {
   this.value = String.fromCharCode (0x30a0 + round(0, 96))
    ;
  }
}



this.rain = function() {
this.y = (this.y >= height) ? 0 : this.y += this.speed;
}

}

function Stream () {
  this.symbols = [];
  this.totalSymbols = round (random (88, 40));
  this.speed = random (6, 18);

  this.generateSymbols = function (x,y) {


   for (var i = 0; i <= this.totalSymbols ; i++) {
   this.symbol = new Symbol (x, y, this.speed);
   this.symbol.setToRandomSymbol ();
   this.symbols.push (this.symbol);
   y -= symbolSize;


   }

   }

   this.render = function () {
   this.symbols.forEach(function(symbol)  {
     fill(0, 24, 255);
     text(symbol.value, symbol.x, symbol.y);
     symbol.rain ();
     symbol.setToRandomSymbol();

  });


  }

  }
