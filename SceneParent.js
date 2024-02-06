//import Phaser from 'phaser';
//import { Anims } from './anims';

/**
 * Parent class for all playable scenes
 */
export class SceneParent extends Phaser.Scene {
	constructor(sceneName) {
		super({
			key: sceneName
		});

////////// Game attributes

		this.canvasDimensions = { width: 0, height: 0 };
		this.cursors = null;
		// this.controls = null; // User controls
		
////////// Map attributes

		this.map = null;
		this.portals = {};
		//relativePosition
		this.rPos = { x: 0, y: 0 };
		//mapDimensions
		this.mapDimensions = { x: 0, y: 0 };
		this.tileDimensions = { width: 16, height: 16 };

////////// Player attributes

		this.playable = false;
		this.playerBounce = 0;
		this.player = null;
		this.playerSpeed = 200;
		this.spawnPoint = { x: 0, y: 0, };

////////// Enemy attributes

		this.enemyGroupArray = [];

////////// Camera attributes

		this.zoom = 1;

	}
	
	init(data){ }

	preload() {
		this.load.image('player', './assets/player.png');
		
	}

	create(settings) {

////////// Create Controls

		// Cursors has up, down, left, right, space and shift
		this.cursors = this.input.keyboard.createCursorKeys();

		// Create keyboard key listener for any key.
		this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
		this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
		this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
		this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);

////////// Create Map & Layers

		// Gets canvas dimensions from camera.
		// This probably has to happen before camera is configued.
		// TODO: find more stable method to get canvas dimensions.
		this.canvasDimensions = {
            width: this.cameras.main.centerX*2, // is 800
            height: this.cameras.main.centerY*2 // is 600
        }

		// Load map json from Tiled
		this.map = this.make.tilemap({ // this.map or constant map??
            key: settings.mapKey, // is 'map'
            tileWidth: this.tileDimensions.width, // is 16
            tileHeight: this.tileDimensions.height // is 16
        });

		// The first parameter is the name of the tileset in Tiled and the second parameter is the key
        // of the tileset image used when loading the file in preload.
        this.tiles = this.map.addTilesetImage(
			settings.tilesetNameInTiled,
			settings.tilesetImageKey,
			this.tileDimensions.width,
			this.tileDimensions.height
		);

		// 
		this.mapDimensions = {
            x: this.map.widthInPixels,
            y: this.map.heightInPixels
        }

		// Creates coordinates to place the map in the middle of the canvas if the map is smaller than the canvas /
		// The coordinates are then also used to place all other objects relative to the map position.
        if(this.mapDimensions.x < this.canvasDimensions.width && this.mapDimensions.y < this.canvasDimensions.height) {
            // relativePosition
            this.rPos = {
                x: (this.canvasDimensions.width - this.mapDimensions.x) / 2,
                y: (this.canvasDimensions.height - this.mapDimensions.y) / 2
            }
        }
        else { this.rPos = { x: 0, y: 0 } }

		// You can load a layer from the map using the layer name from Tiled, or by using the layer
        // index (0 for Overhead).
		// TODO: Why do this.backgroundLayer etc. not have to be initialized ???
        this.backgroundLayer = this.map.createLayer('Background', this.tiles, this.rPos.x, this.rPos.y);
        this.interactiveLayer = this.map.createLayer('Interactive', this.tiles, this.rPos.x, this.rPos.y);
        this.overheadLayer = this.map.createLayer('Overhead', this.tiles, this.rPos.x, this.rPos.y);
        this.scriptLayer = this.map.createLayer('Script', this.tiles, this.rPos.x, this.rPos.y);

		// Itterates through all tiles in a given layer and sets collision based on Custom Properties set in Tiled.
		this.interactiveLayer.forEachTile(tile => {
            if(tile.properties['collides']) {
                tile.setCollision(true, true, true, true, false);
            }
            if(tile.properties['oneWay']) {
				// collides only from bottom
                tile.setCollision(false, false, true, false, false);
            }
        });

		// Place the overhead layer above everything else
		this.overheadLayer.setDepth(20);


////////// Create Player

		if(this.playableScene == true) {
			// Creates global Player object
			window.player = this.player = this.add.character({
				x: this.spawnPoint.x + this.rPos.x,
				y: this.spawnPoint.y + this.rPos.y,
				image: 'player',
				name: 'player',
				playable: true,
				speed: this.playerSpeed
			});

			//this.physics.add.existing(this.player); // Why is this not needed?

			this.player.body.setBounce(this.playerBounce);

			this.player.body.setCollideWorldBounds(true);

			this.physics.add.collider(this.player, this.interactiveLayer);

			this.createCamera(this.player, this.map, this.zoom, this.canvasDimensions.width, this.canvasDimensions.height);

			// Place the player above the tile layers
			this.player.setDepth(10);
		}

////////// Create Enemies

		this.enemyGroupArray.forEach((enemyGroup, index1) => enemyGroup.forEach((enemy, index2) => this.initEnemy(enemy, index1, index2)));
		
	}

	update() { // update(time, delta) {

////////// Player Update

		if(this.player) {
			// Horizontal movement
			if (this.cursors.left.isDown || this.keyA.isDown)
				this.player.SetInstruction({action: 'move', option: 'left'});
			else if (this.cursors.right.isDown || this.keyD.isDown)
				this.player.SetInstruction({action: 'move', option: 'right'});

			// Vertical movement
			if (this.cursors.up.isDown || this.keyW.isDown)
				this.player.SetInstruction({action: 'jump'});

			this.player.update();
		}

		this.enemyGroupArray.forEach((enemyGroup) => enemyGroup.forEach((enemy) => enemy.update()));

		return true;
	}

	createCamera = function(player, map, zoom = 1, canvasWidth, canvasHeight) {

        //this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.setBounds(0, 0, canvasWidth, canvasHeight);

        this.cameras.main.setViewport(0, 0, canvasWidth, canvasHeight);

        this.cameras.main.setZoom(zoom);

        this.cameras.main.startFollow(player);

    }

	initEnemy = function(enemy, index1, index2) {

        // console.log(enemy.name, index1, index2);

		this.enemyGroupArray[index1][index2] = this.add.character({
			x: enemy.x + this.rPos.x,
			y: enemy.y + this.rPos.y,
            image: enemy.image,
            name: enemy.name,
            playable: enemy.playable,
            //map: enemy.map,
			map: this.map,
			speed: enemy.speed,
			index1: index1,
			index2: index2,
			simpleInstruction: enemy.simpleInstruction,
            //speed: 100
		});

		this.physics.add.existing(this.enemyGroupArray[index1][index2]);
        this.enemyGroupArray[index1][index2].body.setCollideWorldBounds(true);
        this.physics.add.collider(this.enemyGroupArray[index1][index2], this.interactiveLayer);
        this.physics.add.collider(this.enemyGroupArray[index1][index2], this.player);
		this.enemyGroupArray[index1][index2].setDepth(10);

    }

	// This method should never be called !
	usefulCodeSnippets = function() {

		// Lists all keyboard key codes:
		console.log(Phaser.Input.Keyboard.KeyCodes);

		//init(){};

		//preload(){};

		//create(){};

		//update(){};

	}
}