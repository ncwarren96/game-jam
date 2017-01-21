var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

var h = 10;
function update(){
	h = getPitch();
	console.log(h/2);
}
function draw(){

	ctx.fillStyle = "blue";
	ctx.rect(0, c.height-h, c.width, h);
	
	ctx.fill();
}



function game_loop(){
	update();
	draw();
}
setInterval(game_loop, 60);