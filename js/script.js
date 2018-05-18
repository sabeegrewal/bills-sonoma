/* -------------- BEGIN sets up stage and game rendering -------------- */
// aliases
var Container = PIXI.Container,
	autoDetectRenderer = PIXI.autoDetectRenderer,
	loader = PIXI.loader,
	resources = PIXI.loader.resources,
	Sprite = PIXI.Sprite,
	Text = PIXI.Text;

// create the renderer
var renderer = autoDetectRenderer(800, 600, {backgroundColor : 0x1099bb});
renderer.view.style.position = "absolute";
renderer.view.style.display = "block";
renderer.autoResize = true;
renderer.resize(window.innerWidth, window.innerHeight);

// create the stage
var stage = new Container();
/* -------------- END sets up stage and game rendering -------------- */


/* -------------- BEGIN game variables -------------- */
// the player
var player;

// keep track of key presses
var keyPressed = [];
/* -------------- END game variables -------------- */


/* -------------- BEGIN game functions -------------- */
function setup() {
	document.body.appendChild(renderer.view);
	createPlayer();
	renderer.render(stage);
	gameLoop();
}

function createPlayer() {
	// creates player sprite
	player = new Sprite(
		loader.resources["img/pigeon.png"].texture
	);

	// preset movement values
	player.speed = 5;
	player.angularV = 0.1;

	// movement functions
	player.moveRight = function() {
		player.x += player.speed;
	}
	player.moveLeft = function() {
		player.x -= player.speed;
	}
	player.moveUp = function() {
		player.y -= player.speed;
	}
	player.moveDown = function() {
		player.y += player.speed;
	}
	player.rotateCW = function() {
		player.rotation += player.angularV;
		if (player.rotation > 6.28) {
			player.rotation -= 6.28;
		}
	}
	player.rotateCC = function() {
		player.rotation -= player.angularV;
		if (player.rotation < 0) {
			player.rotation += 6.28;
		}
	}

	// changes player size
	player.width = 300;
	player.height = 400;
	// makes player center in the middle of the picture
	player.anchor.x = 0.5;
	player.anchor.y = 0.5;
	// sets player's starting position
	player.x = renderer.width / 2;
	player.y = renderer.height / 2;

	// adds player to the stage
	stage.addChild(player);
}

function updatePlayer() {
	// w
	if (keyPressed[87]) {
		player.moveUp();
	}
	// a
	if (keyPressed[65]) {
		player.moveLeft();
	}
	// s
	if (keyPressed[83]) {
		player.moveDown();
	}
	// d
	if (keyPressed[68]) {
		player.moveRight();
	}
	// right arrow
	if (keyPressed[39]) {
		player.rotateCW();
	}
	// left arrow
	if (keyPressed[37]) {
		player.rotateCC();
	}
}

function gameLoop() {
	// loop this function at 60 frames per second
	requestAnimationFrame(gameLoop);

	// game logic
	updatePlayer();

	// render the stage to see the animation
	renderer.render(stage);
}
/* -------------- END game functions -------------- */


/* -------------- BEGIN initialization -------------- */
// load images and starts the game
loader
	.add(["img/pigeon.png"])
	.on("progress", loadProgressHandler)
	.load(setup);

// progress handler
function loadProgressHandler(loader, resource) {
	// display file url being loaded
	console.log("loading: " + resource.url);

	// display percentage of files loaded
	console.log("progress: " + loader.progress + "%");
}

// key up
window.onkeyup = function(e) {
	keyPressed[e.keyCode] = false;
}

// key down
window.onkeydown = function(e) {
	keyPressed[e.keyCode] = true;
}
/* -------------- END initialization -------------- */