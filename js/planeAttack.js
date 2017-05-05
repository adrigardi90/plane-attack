//Keycodes
const LEFT = 37;
const UP = 38;
const RIGHT = 39;
const DOWN = 40;

var score = 0;
var bestScore = 0;
var firstMove = false;
var start = true;
var resetClock = false;
var interval = 10;
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

//Listening event to the pressed key
addEventListener("keydown", function(e){
	firstMove == false ? firstMove = true : firstMove =  firstMove;
	keyActions[e.keyCode] = true;
}, true);

//Listening event when the key is released
addEventListener("keyup", function(e){
	delete keyActions[e.keyCode];
}, true);


// -------------- Functions -------------------

//Init positions	
function init(){

	if(start){
		//First plane position
		planeObj.x = canvas.width / 2;
		planeObj.y = canvas.height /2;	
		start = false;	

		//New game
		if(resetClock){
			clock = setInterval(function(){
						if(firstMove){
							checkClock();
							document.getElementById("clock").setAttribute("value", '00 : ' + String("0" + interval).slice(-2));
							document.getElementById("score").setAttribute("value", '- '+ score + ' -');
							document.getElementById("bestscore").setAttribute("value", 'Mejor puntuacion : ' + bestScore);
						}
					},1000) 
		}
		
	}
	
	//Random first bird position
	birdObj.x = Math.round(Math.random()*(canvas.width - 35));
	birdObj.y = Math.round(Math.random()*(canvas.height - 60));
}

//Update the plane position
function updatePosition(elapsed){

	var distance = (planeObj.speed / 100) * elapsed;

	if(keyActions.hasOwnProperty(UP)){
		//(planeObj.y > 0) ? planeObj.y -= distance : planeObj.y = 0 ;
		(planeObj.y > -70) ? planeObj.y -= distance : planeObj.y = canvas.height;
	}

	if(keyActions.hasOwnProperty(DOWN)){
		//(planeObj.y < canvas.height - 80) ? planeObj.y += distance : planeObj.y = canvas.height - 80;
		(planeObj.y < canvas.height) ? planeObj.y += distance : planeObj.y = -70;
	}

	if(keyActions.hasOwnProperty(RIGHT)){
		//(planeObj.x < canvas.width - 80) ? planeObj.x += distance : planeObj.x = canvas.width - 80;
		(planeObj.x < canvas.width) ? planeObj.x += distance : planeObj.x = -70;
	}

	if(keyActions.hasOwnProperty(LEFT)){
		//(planeObj.x > 0) ? planeObj.x -= distance : planeObj.x = 0;
		(planeObj.x > -70) ? planeObj.x -= distance : planeObj.x = canvas.width;
	}

	//Touch bird?
	if( planeObj.x <= (birdObj.x + 30) && planeObj.y <= (birdObj.y + 16)
		&& birdObj.x <=(planeObj.x + 40) &&  birdObj.y <= (planeObj.y + 40)){
		score++;
		init();

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

//Time control and reset
function checkClock(){

	if(interval === 0){
		clearInterval(clock);	
		start = true;
		interval = 10;
		resetClock = true;
		firstMove = false;
		score > bestScore ? bestScore = score : bestScore;
		score = 0;
		init();
	}else{
		interval--;	
	}
}

//Append canvas to div tag
window.onload = function(){
	document.getElementById("main").appendChild(canvas);
	document.getElementById("clock").setAttribute("value", '00 : ' + interval);
	document.getElementById("bestscore").setAttribute("value", 'Mejor puntuacion : ' + bestScore);
	document.getElementById("score").setAttribute("value", '- '+ score + ' -');
}

init();		

//Control game time
var clock = setInterval(function(){
				if(firstMove){
					checkClock();
					document.getElementById("clock").setAttribute("value", '00 : ' + String("0" + interval).slice(-2));
					document.getElementById("score").setAttribute("value", '- '+ score + ' -');
					document.getElementById("bestscore").setAttribute("value", 'Mejor puntuacion : ' + bestScore);
				}
			},1000) 

//Exec main program
setInterval(main, 1);