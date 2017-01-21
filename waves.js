var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");


var mouseMode = true;
var mouseY = 0;
var pitch = 0;
var lastpitch = 0;

var haveDebris = false;
var debrypos = 100;
var modY;

//mouse event listener and getting mouse Y pos
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }
canvas.addEventListener('mousemove', function(evt) {
    var mousePos = getMousePos(canvas, evt);
	mouseY = mousePos.y;
    //console.log('Mouse position: ' + mousePos.x + ',' + mousePos.y);
}, false);



function update(){
	pitch = getPitch();
	lastpitch = pitch;
	
	
	//switch for mouse control or pitch control
	if(!mouseMode){
		modY = pitch;
	}else{
		modY = mouseY;
	}
	
	//haveDebris is set true if wave reaches ypos
	if(canvas.height-modY < debrypos && !haveDebris){
		console.log("HIT");
		haveDebris = true;
	}
	
	//setting debris pos on whether we have it or not
	if(haveDebris){
		debrypos = canvas.height-modY;
	}else{
		debrypos = 100;
	}
}

function draw(){
	//reset canvas
	canvas.width = canvas.width;
	canvas.height = canvas.height;
	
	
	ctx.fillStyle = "blue";
	console.log(canvas.height-modY);

	ctx.fillRect(0, canvas.height-modY, canvas.width, modY);
	
	ctx.fillStyle = "red";
	ctx.fillRect(300, debrypos, 100, 100);
	

		
	
	
	//ctx.fill();
}

function game_loop(){
	update();
	draw();
}
setInterval(game_loop, 60);