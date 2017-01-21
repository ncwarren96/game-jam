var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var mouseMode = false;
var mouseY = 0;
var lastmouse = 0;
var pitch;
var wavePitch = 0;
var lastpitch = 0;

var haveDebris = false;
var doUpdate = false;
var debrypos = 200;
var modY;

var dist = 0;

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
	dist = Math.abs(lastpitch-pitch);
	var realDist = lastpitch-pitch;
	wavePitch = getPitch();
	
	if(dist>10){
		console.log("speed: "+ dist +" too fast!");
		if(realDist < 0) {realDist = 10}
		else {realDist = -10}
		wavePitch = lastpitch + realDist;
		doUpdate = false;
	}else{
		console.log("speed: "+dist);
		//wavePitch = getPitch();
		doUpdate = true;
	}
	
	//lastpitch = pitch;
	
	//switch for mouse control or pitch control
	if(!mouseMode){
		modY = (wavePitch/2)+50;
	}else{
		modY = mouseY;
	}
	
	//haveDebris is set true if wave reaches ypos
	if(canvas.height-modY < debrypos && !haveDebris){
		console.log("HIT");
		haveDebris = true;
	}
	//console.log(modY);
	//setting debris pos on whether we have it or not
	if(haveDebris){
		debrypos = canvas.height-modY;
	}else{
		debrypos = 200;
	}
	
	lastpitch = wavePitch;
}

function draw(){
	//reset canvas
	canvas.width = canvas.width;
	canvas.height = canvas.height;
	
	
	ctx.fillStyle = "blue";
	//console.log(canvas.height-modY);

	ctx.fillRect(0, canvas.height-modY, canvas.width, modY);
	
	ctx.fillStyle = "red";
	ctx.fillRect(300, debrypos, 100, 100);
}

function game_loop(){
	update();
	draw();
}
setInterval(game_loop, 30);