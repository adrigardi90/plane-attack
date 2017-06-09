//Keycodes
const LEFT = 37;
const UP = 38;
const RIGHT = 39;
const DOWN = 40;

//Global var
var totalSeconds = 0;
var score = 0;
var bestScore = 0;
var firstMove = true;
var start = true;
var resetClock = false;
var interval = 10;
var lastUpdate = Date.now();

//Canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 850;
canvas.height = 510;

//Background image
var backgroundReady = false;
var backgroundImage = new Image();
backgroundImage.onload =  () => backgroundReady = true;
backgroundImage.src = "images/sky2.png";

//Plane
var planeObj = {speed: 400}
var planeReady = false;
var planeImage = new Image();
planeImage.onload = () => planeReady = true;
planeImage.src = "images/plane.png";

//Bird 
var birdObj = {speed: 100}
var birdReady =  false;
var birdImage = new Image();
birdImage.onload = () => birdReady = true;
birdImage.src = "images/bird.png";


//KEY LISTENERS
var keyActions = {};

//Listening event to the pressed key
addEventListener("keydown", (e) => {
	firstMove == true ? firstMove = false : firstMove =  firstMove;
	keyActions[e.keyCode] = true;
}, true);

//Listening event when the key is released
addEventListener("keyup", (e) => {
	delete keyActions[e.keyCode];
}, true);


//Init positions	
function init(){

	if(start){

		//First plane position
		planeObj.x = canvas.width / 2;
		planeObj.y = canvas.height /2;	
		start = false;	

		//New game
		if(resetClock){
			clock = setInterval(() => 
				{
					if(!firstMove){
						checkClock();
						/*document.getElementById("dial1").setAttribute("class", "startSecond1");
						document.getElementById("dial2").setAttribute("class", "startSecond2");*/
						document.getElementById("clock").setAttribute("value", '00 : ' + String("0" + interval).slice(-2));
						document.getElementById("score").setAttribute("value", score );
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

	var distance = planeObj.speed * elapsed;

	//UP key
	if(keyActions.hasOwnProperty(UP)){
		(planeObj.y > -70) ? planeObj.y -= distance : planeObj.y = canvas.height;
	}

	//DOWN key
	if(keyActions.hasOwnProperty(DOWN)){
		(planeObj.y < canvas.height) ? planeObj.y += distance : planeObj.y = -70;
	}

	//RIGHT key
	if(keyActions.hasOwnProperty(RIGHT)){
		(planeObj.x < canvas.width) ? planeObj.x += distance : planeObj.x = -70;
	}

	//LEFT key
	if(keyActions.hasOwnProperty(LEFT)){
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
function paintPosition(delta){

	//We need to draw the backgroundImage all the time, in order to refresh and delete the last plane position
	if(backgroundReady){
		
		if(!firstMove){
			totalSeconds += delta;

			var vx = 100; // the background scrolls with a speed of 100 pixels/sec
			var numImages = Math.ceil(canvas.width / backgroundImage.width) + 1;
			var xpos = totalSeconds * vx % backgroundImage.width;

			ctx.save();
			ctx.translate(-xpos, 0);

			for (var i = 0; i < numImages; i++) {
				ctx.drawImage(backgroundImage, i * backgroundImage.width, 0);
			}

			ctx.restore();
		}else{
			ctx.drawImage(backgroundImage, 0, 0, backgroundImage.width, backgroundImage.height);
			totalSeconds = 0;
		}
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

	updatePosition(elapsed/1000);
	paintPosition(elapsed/1000);

	this.lastUpdate = now;
}

//Time control and reset
function checkClock(){

	if(interval === 0){
		clearInterval(clock);	
		start = true;
		interval = 10;
		resetClock = true;
		firstMove = true;
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
	document.getElementById("score").setAttribute("value", score );
}

init();		

//Control game time
var clock = setInterval( 
	() => {
		if(!firstMove){
			checkClock();
			
			document.getElementById("clock").setAttribute("value", '00 : ' + String("0" + interval).slice(-2));
			document.getElementById("score").setAttribute("value",  score );
			document.getElementById("bestscore").setAttribute("value", 'Mejor puntuacion : ' + bestScore);
		}
	},1000) 

//Exec main program
setInterval(main, 1);