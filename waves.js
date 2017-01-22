var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var mouseMode = false;

var GAME_STATE = 0;
var LEVEL = 1;

var mouseY;
var pitch;
var wavePitch;
var lastpitch;

var haveDebris = false;
var doUpdate = false;
var debrypos;
var debryposX;
var modY;

var dist = 0;
var won = false;

var imgBack, imgWave;
var items;
var bottle, coconut, beacBall, shell;
var currentItem;

var textY = canvas.height;
var song; // Sound Efx
var songLoad = "simon/Waves.mp3";





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

function Items(img, x, y, resistance){
	this.image = img;
	this.x = x;
	this.y = y;
	this.resistance = resistance;
	this.next = null;
	
	this.draw = function(myx, myy){
		ctx.drawImage(this.image, myx, myy, this.image.width, this.image.height);
	};
}

function imgInit(url, x, y, width, height){
	var image = new Image();
	image.x = x;
	image.y = y;
	image.width = width;
	image.height = height;
	image.src = url;
	return image;
}

function init(){
	GAME_STATE = 0;
	
	imgTit = imgInit("simon/beach.png", 0, 0, canvas.width, canvas.height);
	imgBack = imgInit("simon/sand.png", 0, 0, canvas.width, canvas.height);
	imgWave = imgInit("simon/wave.png", 0, 0, canvas.width, canvas.height);
	var imgBottle = imgInit("simon/bottle.png", 0, 0, 25, 90);
	var imgCoconut = imgInit("simon/coconut.png", 0, 0, 50, 50);	
	var imgBeachBall = imgInit("simon/BeachBall.png", 0, 0, 100, 100);
	var imgShell = imgInit("simon/shell.png", 0, 0, 50, 35);
	
	//initialize item objects: Image, x-pos, y-pos, resistance
	bottle = new Items(imgBottle, 100, 200, 20);
	coconut = new Items(imgCoconut, 100, 200, 20);
	beachBall = new Items(imgBeachBall, 100, 200, 20);
	shell = new Items(imgShell, 100, 200, 20);
	
	bottle.next = coconut;
	coconut.next = beachBall;
	beachBall.next = shell;
	
	wavePitch = 0;
	lastpitch = 0;
	
	haveDebris = false;
	won = false;
	debrypos = canvas.height -((LEVEL+1)*100);
	debryposX = Math.random() * ((canvas.width -100) - 100) + 100;
	
	song = document.getElementById("song");
	
}

function update(){
	if(GAME_STATE == 0){
		titleScreen();
		//run title scren
	}
	else if(GAME_STATE == 1){
		updatePlay();
		//run game
	}
	else if(GAME_STATE == 2){
		creditScreen()
		//pause game
	}
}

function titleScreen(){
	currentItem = bottle;

	canvas.addEventListener('click', function() {
		GAME_STATE = 1;
	}, false);	
}

function creditScreen(){
	textY--;
	song.play();
}

function updatePlay(){
	dist = Math.abs(lastpitch-pitch);
	var realDist = lastpitch-pitch;
	wavePitch = getPitch();
	
	//pitch logic
	if(dist>currentItem.resistance){
		console.log("speed too fast!");

		if(realDist < 0) {
			realDist = 15;
		}else{
			realDist = -30;
			haveDebris = false;
		}
		wavePitch = lastpitch + realDist;
	}else{
		console.log("speed ok");
	}
	
	//switch for mouse control or pitch control
	if(!mouseMode){
		modY = Math.round((wavePitch)+50);
	}else{
		modY = mouseY;
	}
	var wavepos = (canvas.height-modY);
	
	
	//haveDebris is set true if wave reaches y-pos
	if(wavepos < debrypos-100 && !haveDebris && !won){
		console.log("HIT");
		haveDebris = true;
	}


	//setting debris pos on whether we have it or not
	if(haveDebris){
		debrypos = (canvas.height-modY)+100;
	}else{
		debrypos = debrypos;
	}
	
	//WIN STATE
	if(debrypos > 450){
		won = true;
		console.log("YOU WIN!!!!!!!!!!!");
		haveDebris=false;
		debrypos+=3;
	}
	if(debrypos > canvas.height){
		console.log("ALL THE WAY");
		init();
		LEVEL++;
		//sets end level
		if(LEVEL > 2){
			GAME_STATE = 2; //credits
		}else{
			GAME_STATE = 1;	//next level
		}
		if(currentItem.next != null){
			currentItem = currentItem.next;			
		}
	}
	lastpitch = wavePitch;
}

function draw(){
	//reset canvas
	canvas.width = canvas.width;
	canvas.height = canvas.height;
	
	//TITLE SCREEN
	if(GAME_STATE ==0){
		ctx.drawImage(imgTit, 0, 0, imgTit.width, imgTit.height);
		
		ctx.font = "30px Arial";
		ctx.fillText("Click to begin",300, 550);
		ctx.textAlign="center";
	}
	
	//GAME PLAY
	else if(GAME_STATE == 1){
		//background image 
		ctx.drawImage(imgBack, 0, 0, imgBack.width, imgBack.height);
			
		//wave image
		ctx.drawImage(imgWave, 0, canvas.height-modY, imgWave.width, imgWave.height);
		
		//item image
		currentItem.draw(debryposX, debrypos);
		
		if(won){
			ctx.font = "72px Arial";
			ctx.fillText("LEVEL "+LEVEL+" SUCCESS!",30,50);
		}
	}
	
	//CREDITS
	else if(GAME_STATE == 2){
		ctx.font = "30px Arial";
		ctx.fillText("CREDITS:", 300, textY);
		ctx.fillText("Simon Benichou", 300, textY+40);
		ctx.fillText("John Harris", 300, textY+80);	
		ctx.fillText("Mason Reed", 300, textY+120);	
		ctx.fillText("Nick Warren", 300, textY+160);
		ctx.fillText("STUDIO PETS:", 300, textY+260);
		ctx.fillText("Blue the Cat", 300, textY+300);

	}
}

function newItem(){
	var x = random()*100;
	var y = random()*100;
	
}

function game_loop(){
	update();
	draw();
}
init();
setInterval(game_loop, 30);