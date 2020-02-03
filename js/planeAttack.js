// Keycodes
const keyCodes = [LEFT, UP, RIGHT, DOWN] = [37, 38, 39, 40]
// KEY LISTENERS
let keyActions = {}

// Global var
const GAME_DURATION = 10
let [score, bestScore, interval] = [0, 0, GAME_DURATION]
let firstMove = true
let clock
let lastUpdate = Date.now()
let totalSeconds = 0

// Canvas
const canvas = document.createElement("canvas")
const ctx = canvas.getContext("2d")
canvas.width = 850
canvas.height = 510

// Background image
const backgroundObj = { image: new Image(), ready: false }
backgroundObj.image.onload = () => backgroundObj.ready = true
backgroundObj.image.src = "images/sky.png"

// Plane
const planeObj = { speed: 400, width: 80, height: 80, image: new Image(), ready: false }
planeObj.image.onload = () => planeObj.ready = true
planeObj.image.src = "images/plane.png"

// Bird 
const birdObj = { width: 60, height: 32, image: new Image(), ready: false }
birdObj.image.onload = () => birdObj.ready = true
birdObj.image.src = "images/bird.png"

// Elements
let timerElem, scoreElem, bestScoreElem


/**
 * Add the key listeners
 */
function addEventListeners() {

	//Listening event to the pressed key
	addEventListener("keydown", (e) => {
		if (!keyCodes.find(key => e.keyCode === key)) return
		if (firstMove) {
			firstMove = false
			setTimer()
		}

		keyActions[e.keyCode] = true
	}, true)

	//Listening event when the key is released
	addEventListener("keyup", (e) => {
		delete keyActions[e.keyCode]
	}, true)
}

/**
 * Update rating values
 * @param {*} interval game time left
 * @param {*} score current score
 * @param {*} bestScore best score
 */
function updateScoreAndTime(interval, score, bestScore) {
	timerElem.setAttribute("value", '00 : ' + interval)
	bestScoreElem.setAttribute("value", 'Best score: ' + bestScore)
	scoreElem.setAttribute("value", score)
}

/**
 * Calculate the elements position in canvas
 */
function calculateFirstPositions() {

	if (firstMove) {
		// First plane position in the middle
		planeObj.x = (canvas.width / 2) - (planeObj.width / 2)
		planeObj.y = (canvas.height / 2) - (planeObj.height / 2)
	}

	// Random first bird position
	birdObj.x = Math.round(Math.random() * (canvas.width - birdObj.width))
	birdObj.y = Math.round(Math.random() * (canvas.height - birdObj.height))
}


/**
 * Update the plane position and calculate if the bird
 * has been hit
 * @param {*} elapsed time (s)
 */
function updateElements(elapsed) {

	// distance (pixels) = (pixels/second) * seconds
	const distance = planeObj.speed * elapsed
	// Max pixels before the plan cross the limits
	const sizeBeforeCrossing = planeObj.width - 10

	// UP key
	if (keyActions.hasOwnProperty(UP)) {
		// Crossing top canvas side?
		(planeObj.y > -sizeBeforeCrossing) ? planeObj.y -= distance : planeObj.y = canvas.height
	}

	// DOWN key
	if (keyActions.hasOwnProperty(DOWN)) {
		// Crossing bottom
		(planeObj.y < canvas.height) ? planeObj.y += distance : planeObj.y = -sizeBeforeCrossing
	}

	// RIGHT key
	if (keyActions.hasOwnProperty(RIGHT)) {
		// Crossing right
		(planeObj.x < canvas.width) ? planeObj.x += distance : planeObj.x = -sizeBeforeCrossing
	}

	// LEFT key
	if (keyActions.hasOwnProperty(LEFT)) {
		// Crossing left
		(planeObj.x > -sizeBeforeCrossing) ? planeObj.x -= distance : planeObj.x = canvas.width
	}

	// Did we hit the bird?
	if (planeObj.x <= (birdObj.x + (birdObj.width/2)) && 
		planeObj.y <= (birdObj.y + (birdObj.height/2)) && 
		birdObj.x <= (planeObj.x + (planeObj.width/2)) && 
		birdObj.y <= (planeObj.y + (planeObj.height/2))) {
		score++
		calculateFirstPositions()
	}
}

/**
 * Paint all the elements in the canvas
 * @param {*} elapsed time (s)
 */
function paintElements(elapsed) {

	// We draw the backgroundImage all the time to refresh and delete the last plane position
	// We start moving the background when the first key has been pressed
	if (!firstMove) {
		totalSeconds += elapsed

		const vx = 100 // the background scrolls with a speed of 100 pixels/sec
		const numImages = Math.ceil(canvas.width / backgroundObj.image.width) + 1
		const xpos = (totalSeconds * vx) % backgroundObj.image.width

		ctx.save()
		ctx.translate(-xpos, 0)

		for (let i = 0; i < numImages; i++) {
			ctx.drawImage(backgroundObj.image, i * backgroundObj.image.width, 0)
		}

		ctx.restore()
	} else {
		// Reset background image in canvas to position 0 0 (dx dy)
		ctx.drawImage(backgroundObj.image, 0, 0, backgroundObj.image.width, backgroundObj.image.height)
		totalSeconds = 0
	}

	// Paint the plane. Size 80x80
	ctx.drawImage(planeObj.image, planeObj.x, planeObj.y, planeObj.width, planeObj.height)
	// Paint the bird. Size 60x32
	ctx.drawImage(birdObj.image, birdObj.x, birdObj.y, birdObj.width, birdObj.height)
}

/**
 * Main program
 */
function main() {

	// No logic untill the elements are ready
	if (!backgroundObj.ready || !birdObj.ready || !planeObj.ready) return

	// Calculate elapsed time (seconds)
	const now = Date.now()
	const elapsed = (now - lastUpdate) / 1000

	// Udpate elements
	updateElements(elapsed)
	// Paint elements
	paintElements(elapsed)
	// Update values
	updateScoreAndTime(String("0" + interval).slice(-2), score, bestScore)

	// Update time
	lastUpdate = now
}

/**
 * Control the game time
 */
function setTimer() {
	clock = setInterval(() => {
		// Game over 
		if (interval === 0) {
			clearInterval(clock)
			firstMove = true
			interval = GAME_DURATION
			score > bestScore ? bestScore = score : bestScore // Update best score
			score = 0
			return calculateFirstPositions()
		}

		// 1 less second
		interval--
	}, 1000)
}

// Append canvas to div tag
window.onload = function () {
	document.getElementById("board").appendChild(canvas)

	timerElem = document.getElementById("clock")
	bestScoreElem = document.getElementById("bestscore")
	scoreElem = document.getElementById("score")

	updateScoreAndTime(interval, score, bestScore)
}


//********************* PROGRAM *****************************/

// Calculate positions
calculateFirstPositions()

// Add key event listeners
addEventListeners()

// Execute main program every 1 ms
setInterval(main, 16)