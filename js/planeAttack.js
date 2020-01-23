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

// Canvas
const canvas = document.createElement("canvas")
const ctx = canvas.getContext("2d")
canvas.width = 850
canvas.height = 510

// Background image
let backgroundReady = false
const backgroundImage = new Image()
backgroundImage.onload = () => backgroundReady = true
backgroundImage.src = "images/sky.png"

// Plane
let planeObj = { speed: 400, width: 80, height: 80, image: new Image() }
let planeReady = false
planeObj.image.onload = () => planeReady = true
planeObj.image.src = "images/plane.png"

// Bird 
let birdObj = { width: 60, height: 32, image: new Image() }
let birdReady = false
birdObj.image.onload = () => birdReady = true
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
 * @param {*} elapsed time (ms)
 */
function updateElements(elapsed) {

	const distance = planeObj.speed * elapsed

	// UP key
	if (keyActions.hasOwnProperty(UP)) {
		(planeObj.y > -70) ? planeObj.y -= distance : planeObj.y = canvas.height
	}

	// DOWN key
	if (keyActions.hasOwnProperty(DOWN)) {
		(planeObj.y < canvas.height) ? planeObj.y += distance : planeObj.y = -70
	}

	// RIGHT key
	if (keyActions.hasOwnProperty(RIGHT)) {
		(planeObj.x < canvas.width) ? planeObj.x += distance : planeObj.x = -70
	}

	// LEFT key
	if (keyActions.hasOwnProperty(LEFT)) {
		(planeObj.x > -70) ? planeObj.x -= distance : planeObj.x = canvas.width
	}

	// Did we hit the bird?
	if (planeObj.x <= (birdObj.x + 30) && planeObj.y <= (birdObj.y + 16)
		&& birdObj.x <= (planeObj.x + 40) && birdObj.y <= (planeObj.y + 40)) {
		score++
		calculateFirstPositions()
	}
}

/**
 * Paint all the elements in the canvas
 * @param {*} delta time (ms)
 */
function paintElements(delta) {

	let totalSeconds

	// We draw the backgroundImage all the time  to refresh and delete the last plane position
	// We start moving the background when the first key has been pressed
	if (!firstMove) {
		totalSeconds += delta

		const vx = 100 // the background scrolls with a speed of 100 pixels/sec
		const numImages = Math.ceil(canvas.width / backgroundImage.width) + 1
		const xpos = (totalSeconds * vx) % backgroundImage.width

		ctx.save()
		ctx.translate(-xpos, 0)

		for (let i = 0; i < numImages; i++) {
			ctx.drawImage(backgroundImage, i * backgroundImage.width, 0)
		}

		ctx.restore()
	} else {
		// Reset background image in canvas to position 0 0 (dx dy)
		ctx.drawImage(backgroundImage, 0, 0, backgroundImage.width, backgroundImage.height)
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
	if (!backgroundReady || !birdReady || !planeReady) return

	const now = Date.now()
	const elapsed = now - this.lastUpdate
	const elapsed_ms = elapsed / 1000

	// Udpate and paint elements
	updateElements(elapsed_ms)
	paintElements(elapsed_ms)
	// Update values
	updateScoreAndTime(String("0" + interval).slice(-2), score, bestScore)

	// Update time
	this.lastUpdate = now
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


//********************* MAIN PROGRAM *****************************/

// Calculate positions
calculateFirstPositions()

// Add key event listeners
addEventListeners()

// Execute main program every 1 ms
setInterval(main, 1)