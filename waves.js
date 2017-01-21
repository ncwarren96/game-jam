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
	
<<<<<<< HEAD
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
	
	
	//initialize bottle image 
	imgBottle = new Image();
	imgBottle.x = 0;
	imgBottle.y = 0;
	imgBottle.width = 25;
	imgBottle.height = 90;
	imgBottle.src = "simon/bottle.png";
	
	//initialize Title Screen
	imgTit = new Image();
	imgTit.x = 0;
	imgTit.y = 0;
	imgTit.width = canvas.width;
	imgTit.height = canvas.height;
	imgTit.src = "simon/beach.png";
	
	bottle = new Items(imgBottle, 100, 200, 25);
=======
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
>>>>>>> origin/master
	
	wavePitch = 0;
	lastpitch = 0;
	
	haveDebris = false;
	won = false;
	debrypos = canvas.height -((LEVEL+1)*100);
	debryposX = Math.random() * ((canvas.width -100) - 100) + 100;
	
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
<<<<<<< HEAD
	ctx.drawImage(imgTit, 0, 0, imgTit.width, imgTit.height);
	
	ctx.font = "30px Arial";
	ctx.fillText("Click to begin",400,550);
	ctx.textAlign="center";
	
=======
	currentItem = bottle;
>>>>>>> origin/master
	
	canvas.addEventListener('click', function() {
		GAME_STATE = 1;
	}, false);	
}

function updatePlay(){
	dist = Math.abs(lastpitch-pitch);
	var realDist = lastpitch-pitch;
	wavePitch = getPitch();
	
	//pitch logic
	if(dist>currentItem.resistance){
		console.log("speed too fast!");

		if(realDist < 0) {
			realDist = 10;
		}else{
			realDist = -50;
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
		//init();
		//GAME_STATE=1;
	}
	if(debrypos > canvas.height){
		console.log("ALL THE WAY");
		init();
		GAME_STATE = 1;
		LEVEL++;
		if(currentItem.next != null){
			currentItem = currentItem.next;			
		}
		//currentItem = currentItem.next;
		//bottle.image.src = "simon/coconut.png";
	}
	
	lastpitch = wavePitch;
}

function draw(){
	//reset canvas
	canvas.width = canvas.width;
	canvas.height = canvas.height;
	
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

function newItem(){
	var x = random()*100;
	var y = random()*100;
	
}

function game_loop(){
	update();
}
init();
setInterval(game_loop, 30);