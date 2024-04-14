//import Phaser from 'phaser';
//import { Animationss } from './Animations';

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
		
		//this.canvasDimensions = { width: 800, height: 600 };
		this.cursors = null;
		// this.controls = null; // User controls
		
////////// Map attributes

		this.map = null;
		this.portals = [];
		this.gravity = null;
		//relativePosition
		this.rPos = { x: 0, y: 0 };
		//mapDimensions
		this.mapDimensions = { x: 0, y: 0 };
		this.tileDimensions = { width: 16, height: 16 };
		this.tiles_solid_collides = [];
		this.tiles_solid_oneWay = [];

////////// Player attributes

		this.playerData = null;
		this.playable = false;
		//this.playerBounce = 0;
		this.player = null;
		//this.playerSpeed = 200;
		this.spawnPoint = { x: undefined, y: undefined, };

////////// Enemy attributes

		//this.enemyGroupArray = [];

		this.spriteGroupArray = [];

////////// Camera attributes

		this.zoom = 1;

	}
	
	init(data){
		
	}

	preload() {
		this.load.image('player', './assets/player.png');
		
	}

	create(settings) {

////////// Set Gravity

		if(this.gravity) {
			this.game.config.physics.arcade.gravity.y = this.gravity;
			console.log(this.game.config.physics.arcade.gravity.y);
		}
		this.gravity = this.game.config.physics.arcade.gravity.y;

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
		if(this.mapDimensions.x < this.canvasDimensions.width) {
			//if(true) {
			// relativePosition
			this.rPos.x = (this.canvasDimensions.width - this.mapDimensions.x) / 2;
		}
		else { this.rPos.x = 0; }

		if(this.mapDimensions.y < this.canvasDimensions.height) {
			//if(true) {
			// relativePosition
			this.rPos.y = (this.canvasDimensions.height - this.mapDimensions.y) / 2;
		}
		else { this.rPos.y = 0; }

		// Player will collide with world bounds
		this.physics.world.setBounds(this.rPos.x, this.rPos.y, this.mapDimensions.x + this.rPos.x, this.mapDimensions.y + this.rPos.y, true, true, true, true);
		

		// You can load a layer from the map using the layer name from Tiled, or by using the layer
        // index (0 for Overhead).
		// TODO: Why do this.backgroundLayer etc. not have to be initialized ???
		this.scriptLayer = this.map.createLayer('Script', this.tiles, this.rPos.x, this.rPos.y);
        this.backgroundLayer = this.map.createLayer('Background', this.tiles, this.rPos.x, this.rPos.y);
		//this.portalLayer = this.map.createLayer('Portal', this.tiles, this.rPos.x, this.rPos.y);
		this.solidLayer = this.map.createLayer('Solid', this.tiles, this.rPos.x, this.rPos.y);
		this.oneWayLayer = this.map.createLayer('OneWay', this.tiles, this.rPos.x, this.rPos.y);
        this.overheadLayer = this.map.createLayer('Overhead', this.tiles, this.rPos.x, this.rPos.y);
        
		

		// Itterates through all tiles in a given layer and sets collision based on Custom Properties set in Tiled.
		this.solidLayer.forEachTile(tile => {
            if(tile.properties['collides']) {
                tile.setCollision(true, true, true, true, false);
            }
        });

		this.oneWayLayer.forEachTile(tile => {
            if(tile.properties['oneWay']) {
				// collides only from bottom
                tile.setCollision(false, false, true, false, false);
            }
        });

		// Place the overhead layer above everything else
		this.overheadLayer.setDepth(20);


////////// Create Player

		if(!window.player && this.playerData) {
			// Creates global Player object
			window.player = this.add.player({
				x: this.spawnPoint.x + this.rPos.x,
				y: this.spawnPoint.y + this.rPos.y,
				image: this.playerData.image,
				name: this.playerData.name,
				playable: this.playerData.playable,
				speed: this.playerData.speed,
				type: this.playerData.type,
				bodyOffset: this.playerData.bodyOffset,
				bodySize: this.playerData.bodySize,
				bounce: this.playerData.bounce,
				progressData: this.playerData.progressData,
			});

			this.createCamera(window.player, this.map, this.zoom, this.canvasDimensions, this.mapDimensions, this.rPos);
		}
		else if(window.player) {
			
			window.player = this.add.player({
				x: this.spawnPoint.x + this.rPos.x,
				y: this.spawnPoint.y + this.rPos.y,
				image: window.player.image,
				name: window.player.name,
				playable: window.player.playable,
				speed: window.player.speed,
				type: window.player.type,
				bodyOffset: window.player.bodyOffset,
				bodySize: window.player.bodySize,
				bounce: window.player.bounce,
				progressData: window.player.progressData,
			});
			
			this.createCamera(window.player, this.map, this.zoom, this.canvasDimensions, this.mapDimensions, this.rPos);
		}

////////// Create Sprites

		this.spriteGroupArray.forEach((spriteGroup, indexArray) => spriteGroup.forEach((sprite, indexGroup) => this.initSprite(sprite, indexArray, indexGroup)));
		
	}

	update() { // update(time, delta) {

////////// Player Update

		if(window.player) {
			// Horizontal movement
			if (this.cursors.left.isDown || this.keyA.isDown)
				window.player.SetInstruction({action: 'move', option: 'left'});
			else if (this.cursors.right.isDown || this.keyD.isDown)
				window.player.SetInstruction({action: 'move', option: 'right'});

			// Vertical movement
			if (this.cursors.up.isDown || this.keyW.isDown) {
				window.player.SetInstruction({action: 'jump'});
			}

			window.player.update();
		}

////////// Sprite Update

		this.spriteGroupArray.forEach((spriteGroup) => spriteGroup.forEach((sprite) => sprite.update()));

		return true;
	}

	createCamera = function(player, map, zoom = 1, canvasDimensions, mapDimensions, relativePosition) {
		/*
		if(relativePosition.x == 0 && relativePosition.y == 0) {
			this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
		}
		else {
			this.cameras.main.setBounds(0, 0, canvasDimensions.width, canvasDimensions.height);
		}
		*/
		//this.cameras.main.setBounds(0, 0, map.widthInPixels + relativePosition.x, map.heightInPixels + relativePosition.y);
		//this.cameras.main.setBounds(0, 0, map.widthInPixels + relativePosition.x, map.heightInPixels + relativePosition.y);

		//this.physics.world.setBounds(this.rPos.x, this.rPos.y, this.mapDimensions.x + this.rPos.x, this.mapDimensions.y + this.rPos.y, true, true, true, true);

		// original configuration
		//this.cameras.main.setBounds(0, 0, canvasDimensions.width, canvasDimensions.height);

		// this way the camera bounds will likely never be noticable.
		//this.cameras.main.setBounds(this.rPos.x - canvasDimensions.width/2, this.rPos.y - canvasDimensions.height/2, this.mapDimensions.x + this.rPos.x + canvasDimensions.width/2, this.mapDimensions.y + this.rPos.y + canvasDimensions.height/2);
		

        this.cameras.main.setViewport(0, 0, canvasDimensions.width, canvasDimensions.height);

        this.cameras.main.setZoom(zoom);

        this.cameras.main.startFollow(player);

    }

	initSprite = function(sprite, indexArray, indexGroup) {

        //console.log(sprite.name);
		if(sprite.type === 'piker') {
			this.spriteGroupArray[indexArray][indexGroup] = this.add.piker({
				x: sprite.x + this.rPos.x,
				y: sprite.y + this.rPos.y,
				image: sprite.image,
				name: sprite.name,
				playable: sprite.playable,
				speed: sprite.speed,
				indexArray: indexArray,
				indexGroup: indexGroup,
				simpleInstruction: sprite.simpleInstruction,
				// TODO: hitbox plugin/parent
				constantHitbox: this.add.rectangle(
					sprite.x + this.rPos.x + sprite.constantHitbox.offsetX, 
					sprite.y + this.rPos.y + sprite.constantHitbox.offsetY, 
					sprite.constantHitbox.width, 
					sprite.constantHitbox.height, 
					sprite.constantHitbox.color, 
					sprite.constantHitbox.alpha
					),
				constantHitboxOffset: {x: sprite.constantHitbox.offsetX, y: sprite.constantHitbox.offsetY},
				bodyOffset: sprite.bodyOffset,
				bodySize: sprite.bodySize,
			});
		}

		if(sprite.type === 'portal') {
			this.spriteGroupArray[indexArray][indexGroup] = this.add.portal({
				x: sprite.x + this.rPos.x,
				y: sprite.y + this.rPos.y,
				image: sprite.image,
				name: sprite.name,
				indexArray: indexArray,
				indexGroup: indexGroup,
				bodyOffset: sprite.bodyOffset,
				bodySize: sprite.bodySize,
				active: sprite.active,
				originScene: sprite.originScene,
				destinationScene: sprite.destinationScene,
				spawnPoint: sprite.spawnPoint,
			});
		}
    }

	// Really just destroys all non-player sprites
	destroyAllGameObjects = function() {
		this.spriteGroupArray = [];
	}

	switchScene = function(destinationScene, data) {
		this.scene.start(destinationScene, data);
		this.destroyAllGameObjects();

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