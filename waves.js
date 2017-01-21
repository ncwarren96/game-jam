var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var mouseMode = false;

var GAME_STATE = 0;

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
var test;

var imgBack;

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

function init(){
	GAME_STATE = 0;
	
	//initialize background
	imgBack = new Image();
	imgBack.x = 0;
	imgBack.y = 0;
	imgBack.width = canvas.width;
	imgBack.height = canvas.height;
	imgBack.src = "simon/sand.png";
	
	//initialize wave
	imgWave = new Image();
	imgWave.x = 0;
	imgWave.y = 0;
	imgWave.width = canvas.width;
	imgWave.height = canvas.height;
	imgWave.src = "simon/wave.png";
	
	
}

function update(){
	if(GAME_STATE == 0){
		titleScreen();
		//run title scren
	}
	else if(GAME_STATE == 1){
		updatePlay();
		draw();
		//run game
	}
	else if(GAME_STATE == 2){
		//pause game
	}
}

function titleScreen(){
	ctx.font = "30px Arial";
	ctx.fillText("Click to begin",10,50);
	
	canvas.addEventListener('click', function() {
		GAME_STATE = 1;
	}, false);	
}

function updatePlay(){
	dist = Math.abs(lastpitch-pitch);
	var realDist = lastpitch-pitch;
	wavePitch = getPitch();
	
	var downSlow = true;
	if(dist>10){
		console.log("speed: "+ dist +" too fast!");
		if(realDist < 0) {
			realDist = 10;
		}else{
			realDist = -25;
			downSlow = false;
		}
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
		modY = Math.round((wavePitch)+50);
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
		debrypos = modY;
	}else{
		debrypos = 200;
	}
	
	lastpitch = wavePitch;
}

function draw(){
	//reset canvas
	canvas.width = canvas.width;
	canvas.height = canvas.height;
	
	//background image 
	ctx.drawImage(imgBack, 0, 0, imgBack.width, imgBack.height);
	
	ctx.fillStyle = "blue";
	//console.log(canvas.height-modY);
	
	//wave image
	ctx.drawImage(imgWave, 0, modY, imgWave.width, imgWave.height);
	//ctx.fillRect(0, canvas.height-modY, canvas.width, modY);
	
	ctx.fillStyle = "red";
	ctx.fillRect(300, debrypos, 100, 100);
}

function game_loop(){
	update();
}
init();
setInterval(game_loop, 30);