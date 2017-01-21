var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var mouseMode = true;

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }
  var mouseY
  canvas.addEventListener('mousemove', function(evt) {
    var mousePos = getMousePos(canvas, evt);
	mouseY = mousePos.y
    //console.log('Mouse position: ' + mousePos.x + ',' + mousePos.y);
  }, false);

var h = 0;
var haveDebris = false;
var debrypos = 100;
var modY;


function update(){
	h = getPitch();
	
	if(!mouseMode){
		modY = h;
	}else{
		modY = mouseY;
	}
	
	if(haveDebris){
		debrypos = canvas.height-modY;
	}else{
		debrypos = 100;
	}
	
	if(canvas.height-modY < debrypos && !haveDebris){
		console.log("HIT");
		haveDebris = true;
	}
	
}
function draw(){
	canvas.width = canvas.width;
	canvas.height = canvas.height;
	ctx.fillStyle = "blue";
	console.log(canvas.height-modY);

	
	ctx.fillRect(0, canvas.height-modY, canvas.width, modY);
	//ctx.fill();

	
	ctx.fillStyle = "red";
	ctx.fillRect(300, debrypos, 100, 100);
	

		
	
	
	//ctx.fill();
}

function game_loop(){
	update();
	draw();
}
setInterval(game_loop, 60);