/* pixijs boilerplate */
var Container = PIXI.Container,
		autoDetectRenderer = PIXI.autoDetectRenderer,
		loader = PIXI.loader,
		resources = PIXI.loader.resources,
		Sprite = PIXI.Sprite,
		Text = PIXI.Text;
function getWindowWidth() { return $(window).width(); }
function getWindowHeight() { return $(window).height(); }

var lastWindowWidth = getWindowWidth();
var lastWindowHeight = getWindowHeight();

var renderer = autoDetectRenderer(256, 256, {antialias: false, transparent: true, resolution: 1});
renderer.view.style.position = "absolute";
renderer.view.style.display = "block";
renderer.autoResize = true;
renderer.resize(getWindowWidth(), getWindowHeight());
var stage = new Container();

/* Create game variables */
var player;
var keysPressed = [];

/* Game functions */
function setup() {
	document.body.appendChild(renderer.view);
	createPlayer();
	renderer.render(stage);
	gameLoop();
}

function createPlayer() {
	player = new Sprite(loader.resources["img/pigeon2.png"].texture);
	player.speed = 5;
	player.angularV = 0.1;
	player.anchor.x = 0.5;
	player.anchor.y = 0.5;
	let el = document.body.getElementsByTagName("h1")[0];
	player.x = el.getBoundingClientRect().right + 50;
	player.y = el.getBoundingClientRect().bottom;
	player.rotation = player.rotation + 0.1;
	player.interactive = true;

	player
		.on('mousedown', onDragStart)
		.on('touchstart', onDragStart)
		.on('mouseup', onDragEnd)
		.on('mouseupoutside', onDragEnd)
		.on('touchend', onDragEnd)
		.on('touchendoutside', onDragEnd)
		.on('mousemove', onDragMove)
		.on('touchmove', onDragMove);

	player.moveRight = function() { player.x += player.speed; }
	player.moveLeft = function() { player.x -= player.speed; }
	player.moveUp = function() { player.y -= player.speed; }
	player.moveDown = function() { player.y += player.speed; }

	player.rotateCW = function() {
		player.rotation += player.angularV;
		if (player.rotation > 6.28) { player.rotation -= 6.28; }
	}
	player.rotateCC = function() {
		player.rotation -= player.angularV;
		if (player.rotation < 0) { player.rotation += 6.28; }
	}

	player.resize = function() {
		let head = document.getElementsByTagName('header')[0]
		player.height = head.getBoundingClientRect().height
		player.width = player.height;
	}
	player.resize();
	stage.addChild(player);
}

function updatePlayer() {
	if (keysPressed["w".charCodeAt(0)] ||
		  keysPressed["W".charCodeAt(0)]) { player.moveUp(); }
	if (keysPressed["a".charCodeAt(0)] ||
			keysPressed["A".charCodeAt(0)]) { player.moveLeft(); }
	if (keysPressed["s".charCodeAt(0)] ||
	    keysPressed["S".charCodeAt(0)]) { player.moveDown(); }
	if (keysPressed["d".charCodeAt(0)] ||
	    	keysPressed["D".charCodeAt(0)]) { player.moveRight(); }
	if (keysPressed[39]) { player.rotateCW(); } // right arrow press
	if (keysPressed[37]) { player.rotateCC(); } // left arrow press
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
		player.rotateCC();
	}
}

function gameLoop() {
	requestAnimationFrame(gameLoop); // looped at 60 FPS
	updatePlayer();
	renderer.render(stage);
}

/* Init */
loader
	.add(["img/pigeon2.png"])
	.on("progress", loadProgressHandler)
	.load(setup);
function loadProgressHandler(loader, resource) {
	console.log("loading: " + resource.url);
	console.log("progress: " + loader.progress + "%");
}

// Populates keysPressed array
window.onkeyup = function(e) {
	keysPressed[e.keyCode] = false;
}
window.onkeydown = function(e) {
	keysPressed[e.keyCode] = true;
}
window.onresize = function(e) {
	// store scaled coordinates for mister pigeon
	var scaledX = player.position.x / lastWindowWidth;
	var scaledY = player.position.y / lastWindowHeight;

	lastWindowWidth = getWindowWidth();
	lastWindowHeight = getWindowHeight();

	renderer.resize(lastWindowWidth, lastWindowHeight);
	player.resize();

	var newX = scaledX * lastWindowWidth;
	var newY = scaledY * lastWindowHeight;

	player.position.x = newX;
	player.position.y = newY;
}
