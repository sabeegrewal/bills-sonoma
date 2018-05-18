// Set up stage and game rendering 

var Container = PIXI.Container,
	autoDetectRenderer = PIXI.autoDetectRenderer,
	loader = PIXI.loader,
	resources = PIXI.loader.resources,
	Sprite = PIXI.Sprite,
	Text = PIXI.Text;

var renderer = autoDetectRenderer(800, 600, {backgroundColor : 0x1099bb});
renderer.view.style.position = "absolute";
renderer.view.style.display = "block";
renderer.autoResize = true;
renderer.resize(window.innerWidth, window.innerHeight);

var stage = new Container();

// Create game variables

var player;

// keep track of key presses
var keyPressed = [];

// Game functions

function setup() {
	document.body.appendChild(renderer.view);
	createPlayer();
	renderer.render(stage);
	gameLoop();
}

function createPlayer() {
	player = new Sprite(
		loader.resources["img/pigeon.png"].texture
	);
	player.speed = 5;
	player.angularV = 0.1;
	player.width = 300;
	player.height = 400;
	
	// center pigeon boi 
	player.anchor.x = 0.5;
	player.anchor.y = 0.5;
	player.x = renderer.width / 2;
	player.y = renderer.height / 2;

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
	stage.addChild(player);
}

function updatePlayer() {
	if (keyPressed["w".charCodeAt(0)] || keyPressed["W".charCodeAt(0)]) {
		player.moveUp();
	}
	if (keyPressed["a".charCodeAt(0)] || keyPressed["A".charCodeAt(0)]) {
		player.moveLeft();
	}
	if (keyPressed["s".charCodeAt(0)] || keyPressed["S".charCodeAt(0)]) {
		player.moveDown();
	}
	if (keyPressed["d".charCodeAt(0)] || keyPressed["D".charCodeAt(0)]) {
		player.moveRight();
	}
	if (keyPressed[39]) {		// right arrow press
		player.rotateCW();
	}
	if (keyPressed[37]) {		// left arrow press
		player.rotateCC();
	}
}

function gameLoop() {
	requestAnimationFrame(gameLoop); // looped at 60 FPS
	updatePlayer();
	renderer.render(stage);
}

// Init

// load images and starts the game
loader
	.add(["img/pigeon.png"])
	.on("progress", loadProgressHandler)
	.load(setup);
function loadProgressHandler(loader, resource) {
	console.log("loading: " + resource.url);
	console.log("progress: " + loader.progress + "%");
}

// Populates keyPressed array
window.onkeyup = function(e) {
	keyPressed[e.keyCode] = false;
}
window.onkeydown = function(e) {
	keyPressed[e.keyCode] = true;
}
