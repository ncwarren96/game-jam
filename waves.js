var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var mouseMode = false;

var GAME_STATE = 0;
var LEVEL = 0;

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
var bottle, coconut, beacBall, shell, bottleRed, bottleBlue, flopper, baby;
var currentItem;

var textY = canvas.height;
var song; // Sound Efx
var songLoad = "simon/Waves.mp3";
var oceanSound;
var oceanSoundLoad = "simon/OceanSounds.mp3";


var count = 0;
var timer = 6;

var highScores;

function JSONScore(score){
	var JSONobj = {"score": score};
	console.log(JSONobj);
	return JSONobj;
}

function checkScores(user_score, score_array){
	for(var i = 0; i < score_array.length; i++){
		var currentScore = score_array[i];{
		console.log(currentScore.score+", "+user_score);
		if(user_score >= currentScore.score)
			return i;
		}
	}
	return -1;
}

function updateScores(array, score){
	var index = checkScores(score, array);
	console.log(index);
	if(index > -1){
		var newScore = JSONScore(score);
		array.splice(index, 0, newScore);
		array.pop();
		localStorage.setItem("WaveHighScores", JSON.stringify(highScores));
	}
}

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

canvas.addEventListener('mousedown', function(evt){
	console.log(GAME_STATE);
	if(GAME_STATE == 0){
		GAME_STATE = 1;
	}
	else if(GAME_STATE == 2){
		console.log(highScores+", "+LEVEL);
		updateScores(highScores, LEVEL);
		GAME_STATE = 3;
	}
	else if(GAME_STATE == 3){
		GAME_STATE = 0;
	}
});

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
	//localStorage.setItem("WaveHighScores", "null");
	GAME_STATE = 0;
	if(localStorage.getItem("WaveHighScores") === null){
		highScores = new Array();
		for(var i = 0; i < 5; i++){
			var newScore = JSONScore(5-i);
			highScores.push(newScore);
		}
		localStorage.setItem("WaveHighScores", JSON.stringify(highScores));
		console.log(highScores);
	}
	else{
		highScores = JSON.parse(localStorage.getItem("WaveHighScores"));
	}
	//console.log(localStorage.getItem("WaveHighScores"));
	//console.log(highScores);
	
	
	imgTit = imgInit("simon/beach.png", 0, 0, canvas.width, canvas.height);
	imgBack = imgInit("simon/sand.png", 0, 0, canvas.width, canvas.height);
	imgWave = imgInit("simon/wave.png", 0, 0, canvas.width, 1000);
	var imgBottle = imgInit("simon/bottle.png", 0, 0, 25, 90);
	var imgCoconut = imgInit("simon/coconut.png", 0, 0, 50, 50);	
	var imgBeachBall = imgInit("simon/BeachBall.png", 0, 0, 100, 100);
	var imgShell = imgInit("simon/shell.png", 0, 0, 50, 35);
	var imgBottleRed = imgInit("simon/bottleRed.png", 0, 0, 50, 35);
	var imgBottleBlue = imgInit("simon/bottleBlue.png", 0, 0, 50, 35);
	var imgFlopper = imgInit("simon/floppers.png", 0, 0, 34, 82);
	var imgBaby = imgInit("simon/baby.png", 0, 0, 150, 92);
	
	//initialize item objects: Image, x-pos, y-pos, resistance
	bottle = new Items(imgBottle, 100, 200, 35);
	coconut = new Items(imgCoconut, 100, 200, 30);
	beachBall = new Items(imgBeachBall, 100, 200, 25);
	shell = new Items(imgShell, 100, 200, 25);
	bottleRed = new Items(imgBottleRed, 100, 200, 10);
	bottleBlue = new Items(imgBottleBlue, 100, 200, 5);
	flopper = new Items(imgFlopper, 100, 200, 20);
	baby = new Items(imgBaby, 100, 200, 10);
	
	bottle.next = coconut;
	coconut.next = beachBall;
	beachBall.next = shell;
	shell.next = flopper;
	flopper.next = baby;
	baby.next = bottleRed;
	
	wavePitch = 0;
	lastpitch = 0;
	
	haveDebris = false;
	won = false;
	debrypos = canvas.height -((LEVEL+2)*100);
	debryposX = Math.random() * ((canvas.width -100) - 100) + 100;
	
	song = document.getElementById("song");
	oceanSound = document.getElementById("oceanSound");
	
}

function update(){
	//console.log(GAME_STATE);
	if(GAME_STATE == 0){
		titleScreen();
		//run title scren
	}
	else if(GAME_STATE == 1){
		updatePlay();
		//run game
	}
	else if(GAME_STATE == 2){
		creditScreen();
		//pause game
	}
	else if(GAME_STATE == 3){
		//highScores();
	}
}

function titleScreen(){
	oceanSound.play();
	currentItem = bottle;
	timer = 60;
	textY = canvas.height;
	level = 0;
	/*canvas.addEventListener('click', function() {
		GAME_STATE = 1;
	}, false);	*/
}

function creditScreen(){
	textY--;
	song.play();
	if(textY+300 < 0){
		console.log(highScores+", "+LEVEL);
		updateScores(highScores, LEVEL);
		GAME_STATE = 3;
	}
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
		//console.log("speed ok");
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
	
	if(debrypos<50){
		debrypos = 50;
	}


	//setting debris pos on whether we have it or not
	if(haveDebris){
		debrypos = (canvas.height-modY)+100;
	}else{
		debrypos = debrypos;
	}
	
	if (GAME_STATE = 1){
		oceanSound.pause();
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
		
		GAME_STATE = 1;	//next level
		
		if(currentItem.next != null){
			currentItem = currentItem.next;			
		}
	}
	lastpitch = wavePitch;
	count += 1;
	if(count%30 == 0){
		timer -= 1;
	}
	if(timer == 0){
		GAME_STATE = 2;
	}
}

function draw(){
	//reset canvas
	canvas.width = canvas.width;
	canvas.height = canvas.height;
	
	//TITLE SCREEN
	if(GAME_STATE ==0){
		ctx.drawImage(imgTit, 0, 0, imgTit.width, imgTit.height);
		
		ctx.fillStyle = "white";
		ctx.font = "30px Arial";
		ctx.fillText("[CLICK TO BEGIN]",280, 550);
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
			ctx.fillStyle = "white";
			ctx.font = "72px Arial";
			ctx.fillText("SUCCESS!",200,100);
		}
		ctx.fillStyle = "white";
		//display timer
		ctx.font = "30px Arial";
		ctx.fillText("Time:", 10, 40);
		ctx.font = "40px Arial";
		ctx.fillText(timer, 90, 40);
		
		//display score
		ctx.font = "30px Arial";
		ctx.fillText(LEVEL + " items collected!", canvas.width-270, canvas.height-30);
		
	}
	
	//CREDITS
	else if(GAME_STATE == 2){
		ctx.font = "30px Arial";
		ctx.fillText("Rockhard Software Presents:", 300, textY-40);
		ctx.fillText("Screaming Wave Rampage in Sea Minor", 300, textY);
		ctx.fillText("Simon Benichou -- Art, Programming, Crying", 300, textY+40);
		ctx.fillText("John Harris -- food runs, moral support, idea guy, slave", 300, textY+80);
		ctx.fillText("Mason Reed -- Programming, gifted vocal chords", 300, textY+120);
		ctx.fillText("Nick Warren -- Programing, high quality mic man, ooooooooOOOOOOOOO", 300, textY+160);
		ctx.fillText("STUDIO PETS:", 300, textY+260);
		ctx.fillText("Blue the Cat", 300, textY+300);
		ctx.fillText("Special Thanks", 300, textY+400);
		ctx.fillText("Katy Martinez", 300, textY+440);
		ctx.fillText("Sara Dibble", 300, textY+480);
		ctx.fillText("oooooooooOOOOOOOOH", 300, textY+520);
		

	}
	
	else if(GAME_STATE == 3){
		ctx.font = "30px Arial";
		ctx.fillText("Your Score: ", 100, 30);
		ctx.fillText(level, 300, 30);
		for(var i = 1; i <= highScores.length; i++){
			ctx.fillText(i+": "+highScores[i-1].score, 100, 30+(40*i));
		}
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