
//Keycodes
const LEFT = 37;
const UP = 38;
const RIGHT = 39;
const DOWN = 40;

var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;

// ---------------- Plane --------------------
//Plane object
var planeObj = {
	speed: 50
}

//Plane image
var planeReady = false;
var planeImage = new Image();
planeImage.onload = function () {
	planeReady = true;
};
planeImage.src = "images/plane.png";


// -------------- Bird -----------------------
// Bird object
var birdObj = {
	speed: 50
}

//Bird image
var birdReady =  false;
var birdImage = new Image();
birdImage.onload = function () {
	birdReady = true;
};
birdImage.src = "images/bird.png";


// ------------- Key listeners ----------------

var keyActions = {};

addEventListener("keydown", function(e){
	keyActions[e.keyCode] = true;
}, true);

addEventListener("keyup", function(e){
	delete keyActions[e.keyCode];
}, true);


//Init positions	
function init(){
	//First plane position
	planeObj.x = canvas.width / 2;
	planeObj.y = canvas.height /2;

	//Random first bird position
	birdObj.x = Math.round(Math.random()*(canvas.width - 35));
	birdObj.y = Math.round(Math.random()*(canvas.height - 60));
}

//Main cicle 
function main(){

	if(planeReady){
		ctx.drawImage(planeImage, planeObj.x, planeObj.y, 80, 80);	
	}

	if(birdReady){
		ctx.drawImage(birdImage, birdObj.x, birdObj.y, 60, 35);	
	}

}

//Append canvas to div tag
window.onload = function(){
	document.getElementById("main").appendChild(canvas);
}

init();
setInterval(main, 1);