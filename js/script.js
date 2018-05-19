/* Set up stage and game rendering */
var Container = PIXI.Container,
	autoDetectRenderer = PIXI.autoDetectRenderer,
	loader = PIXI.loader,
	resources = PIXI.loader.resources,
	Sprite = PIXI.Sprite,
	Text = PIXI.Text;

function getWindowWidth() {
	return $(document).width()
}

function getWindowHeight() {
	return $(document).height();
}

var renderer = autoDetectRenderer(256, 256, {antialias: false, transparent: true, resolution: 1});
renderer.view.style.position = "absolute";
renderer.view.style.display = "block";
renderer.autoResize = true;
renderer.resize(getWindowWidth(), getWindowHeight());
var stage = new Container();

/* Create game variables */
var player;
var keyPressed = []; // keep track of key presses

/* Game functions */
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
	// center pigeon boi 
	player.anchor.x = 0.5;
	player.anchor.y = 0.5;
	player.x = getWindowWidth() / 2;
	player.y = getWindowHeight() / 2;

	player.interactive = true;

	player
		// events for drag start
		.on('mousedown', onDragStart)
		.on('touchstart', onDragStart)
		// events for drag end
		.on('mouseup', onDragEnd)
		.on('mouseupoutside', onDragEnd)
		.on('touchend', onDragEnd)
		.on('touchendoutside', onDragEnd)
		// events for drag move
		.on('mousemove', onDragMove)
		.on('touchmove', onDragMove);

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
	
	player.resize = function() {
		player.height = getWindowHeight() * 0.5;
		player.width = player.height * 0.75;
	}
	player.resize();
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

function onDragStart(event) {
	this.data = event.data;
	this.alpha = 0.5;
	this.dragging = true;

	// store the initial delta form the user touch and the center of mister pigeon
	var touchPosition = this.data.getLocalPosition(this.parent);
	this.grabDeltaX = this.position.x - touchPosition.x;
	this.grabDeltaY = this.position.y - touchPosition.y;
}

function onDragEnd() {
	this.alpha = 1;
	this.dragging = false;
	this.data = null;
}

function onDragMove() {
	if (this.dragging) {
		var newPosition = this.data.getLocalPosition(this.parent);
		this.position.x = newPosition.x + this.grabDeltaX;
		this.position.y = newPosition.y + this.grabDeltaY;
	}
}

function gameLoop() {
	requestAnimationFrame(gameLoop); // looped at 60 FPS
	updatePlayer();
	renderer.render(stage);
}

/* Init */
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
window.onresize = function(e) {
	renderer.resize(getWindowWidth(), getWindowHeight());
	player.resize();
}
