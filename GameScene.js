//import Phaser from 'phaser';
//import { Anims } from './anims';

/**
 * Parent class for all playable scenes
 */
export class GameScene extends Phaser.Scene {
	constructor(sceneName) {
		super({
			key: sceneName
		});

		// this.controls = null; // User controls
		this.cursors = null;
		this.player = null;
		this.map = null;

		this.spawnPoint = null;

		this.portals = {};

		this.spawnPoint = {
			x:200,
			y:240,
		}
		//relativePosition
		this.rPos = {
			x: 0,
			y: 0
		}
		//mapDimensions
		this.mapDimensions = {
			x: 0,
			y: 0
		}
		this.canvasDimensions = {
			width: 0,
			height: 0
		}
		this.tileDimensions = null;

		this.playerSpeed = 200;

		this.zoom = 1;

	}
	
	init(data){ }

	preload() {
		this.load.image('player', './assets/player.png');
		
	}

	create(settings) {

		// Cursors has up, down, left, right, space and shift
		this.cursors = this.input.keyboard.createCursorKeys();

		// Lists all keyboard key codes:
		// console.log(Phaser.Input.Keyboard.KeyCodes);

		// Create keyboard key listener for any key.
		// window.key defines the key globally. this.key defines them in the module scope /
		// module-scope requires initialisation of each key variable in each scene.
		// TODO: Defining keys in module scope might be preferred ???
		window.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
		window.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
		window.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
		window.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);

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
		// The coordinates are then also used to place all other objects relative to th map position.
        if(this.mapDimensions.x < this.canvasDimensions.width && this.mapDimensions.y < this.canvasDimensions.height) {
            // relativePosition
            this.rPos = {
                x: (this.canvasDimensions.width - this.mapDimensions.x) / 2,
                y: (this.canvasDimensions.height - this.mapDimensions.y) / 2
            }
        }
        else {
            this.rPos = {
                x: 0,
                y: 0
            }
        }

		// You can load a layer from the map using the layer name from Tiled, or by using the layer
        // index (0 in this case).
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

		window.player = this.player = this.add.character({
			x: this.spawnPoint.x + this.rPos.x,
			y: this.spawnPoint.y + this.rPos.y,
            image: 'player',
            name: 'player',
            playable: true,
			speed: this.playerSpeed
		});

		// this.physics.add.existing(this.player); // Why is this not needed?

		this.player.body.setCollideWorldBounds(true);

		this.physics.add.collider(this.player, this.interactiveLayer);

		this.createCamera(this.player, this.map, this.zoom, this.canvasDimensions.width, this.canvasDimensions.height);
		
	}

	update() { // update(time, delta) {

		// Horizontal movement
		if (this.cursors.left.isDown)
            this.player.SetInstruction({action: 'move', option: 'left'});
        else if (this.cursors.right.isDown)
            this.player.SetInstruction({action: 'move', option: 'right'});

        // Vertical movement
        if (this.cursors.up.isDown)
            this.player.SetInstruction({action: 'jump'});

        this.player.update();

		if(keyA.isDown) {
			console.log('A key pressed')
		} else if(keyS.isDown) {
			console.log('S key pressed')
		} else if(keyD.isDown) {
			console.log('D key pressed')
		} else if(keyW.isDown) {
			console.log('W key pressed')
		}

		return true;
	}

	createCamera = function(player, map, zoom = 1, canvasWidth, canvasHeight) {

        //this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.setBounds(0, 0, canvasWidth, canvasHeight);

        this.cameras.main.setViewport(0, 0, canvasWidth, canvasHeight);

        this.cameras.main.setZoom(zoom);

        this.cameras.main.startFollow(player);

    }

	usefulCodeSnippets = function() {

		//init(){};

		//preload(){};

		//create(){};

		//update(){};



	}

	
}