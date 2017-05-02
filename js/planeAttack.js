//Keycodes
const LEFT = 37;
const UP = 38;
const RIGHT = 39;
const DOWN = 40;

var lastUpdate = Date.now();
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;

// ---------------- background ---------------
//Plane image
var backgroundReady = false;
var backgroundImage = new Image();
backgroundImage.onload = function () {
	backgroundReady = true;
};
backgroundImage.src = "images/sky.jpg";

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
	speed: 100
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


// -------------- Functions -------------------

//Init positions	
function init(){

	//First plane position
	planeObj.x = canvas.width / 2;
	planeObj.y = canvas.height /2;

	//Random first bird position
	birdObj.x = Math.round(Math.random()*(canvas.width - 35));
	birdObj.y = Math.round(Math.random()*(canvas.height - 60));
}

//Update the plane position
function updatePosition(elapsed){

	var distance = (planeObj.speed / 100) * elapsed;

	if(keyActions.hasOwnProperty(UP)){
		(planeObj.y > 0) ? planeObj.y -= distance : planeObj.y = 0 ;
	}

	if(keyActions.hasOwnProperty(DOWN)){
		(planeObj.y < canvas.height - 80) ? planeObj.y += distance : planeObj.y = canvas.height - 80;
	}

	if(keyActions.hasOwnProperty(RIGHT)){
		(planeObj.x < canvas.width - 80) ? planeObj.x += distance : planeObj.x = canvas.width - 80;
	}

	if(keyActions.hasOwnProperty(LEFT)){
		(planeObj.x > 0) ? planeObj.x -= distance : planeObj.x = 0;
	}
}

//Draw all the objects
function paintPosition(){

	//We need to draw the backgroundImage all the time, in order to refresh and delete the last plane position
	if(backgroundReady){
		ctx.drawImage(backgroundImage, 0, 0);	
	}

	if(planeReady){
		ctx.drawImage(planeImage, planeObj.x, planeObj.y, 80, 80);	
	}

	if(birdReady){
		ctx.drawImage(birdImage, birdObj.x, birdObj.y, 60, 35);	
	}
}

//Main program cicle 
function main(){

	var now = Date.now();
	var elapsed = (now - this.lastUpdate);

	updatePosition(elapsed);
	paintPosition();

	this.lastUpdate = now;
}

//Append canvas to div tag
window.onload = function(){
	document.getElementById("main").appendChild(canvas);
}

init();
setInterval(main, 1);