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

// add canvas to the html
document.body.appendChild(renderer.view);

/* -------------- END sets up stage and game rendering -------------- */


/* -------------- BEGIN game variables -------------- */
// player
var player;

// keep track of key presses
var keyPressed = [];
/* -------------- END game variables -------------- */


/* -------------- BEGIN main menu -------------- */
var mainMenu = {
	playing : true,
	message : "",
	setup : function() {
		console.log("Starting main menu");

		//mainMenu.addPlayer();
		mainMenu.addText();

		mainMenu.playing = true;
		mainMenu.gameLoop();
	},
	addText : function() {
		mainMenu.message = new Text(
			"Move left: W\nMove left: A\nMove right: D\nMove down: S\nRotate left: <-\nRotate right: ->\nPress space to play",
			{fontFamily: "Arial", fontSize: 32, fill: "white"}
		);

		mainMenu.message.anchor.x = 0.5;
		mainMenu.message.anchor.y = 0.5;

		mainMenu.message.x = renderer.width / 2;
		mainMenu.message.y = renderer.height / 2;

		stage.addChild(mainMenu.message);
	},
	addPlayer : function() {
		// creates player sprite
		player = new Sprite(
			loader.resources["img/eagle.png"].texture
		);

		// changes player size
		player.width = 200;
		player.height = 400;
		// makes player center in the middle of the picture
		player.anchor.x = 0.5;
		player.anchor.y = 0.5;
		// sets player's starting position
		player.x = renderer.width / 2;
		player.y = renderer.height / 2;

		// adds player to the stage
		stage.addChild(player);
	},
	play : function() {
		// next level
		if (keyPressed[32]) {
			mainMenu.nextLevel();
		}
	},

	nextLevel : function() {
		mainMenu.clear();
		level1.setup();
	},

	clear : function() {
		mainMenu.playing = false;
		stage.removeChild(mainMenu.message);
	},

	gameLoop : function() {
		if (mainMenu.playing) {
			// loop this function at 60 frames per second
			requestAnimationFrame(mainMenu.gameLoop);

			// game logic
			mainMenu.play();

			// render the stage to see the animation
			renderer.render(stage);
		}
	}
}
/* -------------- END main menu -------------- */


/* -------------- BEGIN level 1 -------------- */
var level1 = {
	playing : true,
	setup : function() {
		console.log("Starting level 1");

		// adds player to game
		level1.addPlayer();

		// render the stage
		renderer.render(stage);

		// kick off the game loop
		level1.playing = true;
		level1.gameLoop();
	},

	addPlayer : function() {
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
	},

	play : function() {
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
	},

	nextLevel : function() {
		level1.clear();
		//level2.setup();
	},

	clear : function() {
		level1.playing = false;
		stage.removeChild(player);
		//remove everything
	},

	gameLoop : function() {
		if (level1.playing) {
			// loop this function at 60 frames per second
			requestAnimationFrame(level1.gameLoop);

			// game logic
			level1.play();

			// render the stage to see the animation
			renderer.render(stage);
		}
	}

}
/* -------------- END level 1 -------------- */


// load images and starts the game
loader
	.add(["img/pigeon.png", "img/eagle.png"])
	.on("progress", loadProgressHandler)
	.load(mainMenu.setup);


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