var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

var h = 10;
function update(){
	
}
function draw(){
	ctx.rect(0, c.height-h, c.width, h);
	ctx.fillStyle = "blue";
	ctx.fill();
}



function game_loop(){
	update();
	draw();
}
setInterval(game_loop, 60);