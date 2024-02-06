class Level_1 extends Phaser.Scene
{
    scoreText;
    score = 0;
    cursors;
    platforms;
    stars;
    player;
    tileset;
    map;
    semiPlatform;
    solid;
    background;
    enemy;
    spawnPoint = {
        x:200,
        y:240,
    }
    //relativePosition
    rPos = {
        x: 0,
        y: 0
    }
    //mapDimensions
    mapDimensions = {
        x: 0,
        y: 0
    }
    canvasDimensions = {
        width: 0,
        height: 0
    }
    tileDimensions = {
        width: 16,
        height: 16
    }
    playerSpeed = 200;

    constructor() {
        super({key:'level_1'});
    };

    preload ()
    {
        this.load.tilemapTiledJSON('map', './assets/tilemaps/level1.json');
        this.load.image('tiles', './assets/tilemaps/level1.png');
        this.load.image('ground', './assets/platform2.png');
        this.load.image('star', './assets/star.png');
        this.load.image('bomb', './assets/bomb.png');
        this.load.spritesheet('dude', './assets/dude.png', { frameWidth: 32, frameHeight: 48 });
        this.load.image('player', './assets/player.png');
        this.load.image('enemy', './assets/enemy.png');
    }

    create ()
    {
        // sceneCreateDefault() completes all the nonspecific initial steps in create() of a scene.
        // The first parameter is the name of the tileset in Tiled and the second parameter is the key
        // of the tileset image used when loading the file in preload.
        this.sceneCreateDefault('level1', 'tiles');
        //console.log(window.canvasDimensions.x);

        this.cursors = this.input.keyboard.createCursorKeys();

        window.player = this.player = this.add.character({
			x: this.spawnPoint.x + this.rPos.x,
			y: this.spawnPoint.y + this.rPos.y,
            image: 'player',
            name: 'player',
            playable: true,
			speed: this.playerSpeed
		});

        this.physics.add.existing(this.player);

        //this.player.body.setBounce(0.2);
        this.player.body.setCollideWorldBounds(true);

        this.physics.add.collider(this.player, this.interactiveLayer);

        this.createCamera(this.player, this.map, 2);

        // ENEMY //

        window.enemy1 = this.enemy1 = this.add.character({
			x: 330 + this.rPos.x,
			y: 230 + this.rPos.y,
            image: 'enemy',
            name: 'enemy1',
            playable: false,
            map: this.map,
			speed: 30
            //speed: 100
		});

        //this.enemy1 = this.add.rectangle(330, 230, 24, 16, 0x013220);
        this.physics.add.existing(this.enemy1);
        this.enemy1.body.setCollideWorldBounds(true);
        this.physics.add.collider(this.enemy1, this.interactiveLayer);
        this.physics.add.collider(this.enemy1, this.player);

        window.enemy2 = this.enemy2 = this.add.character({
			x: 330 + this.rPos.x,
			y: 150 + this.rPos.y,
            image: 'enemy',
            name: 'enemy2',
            playable: false,
            map: this.map,
			speed: 30
            //speed: 100
		});

        //this.enemy1 = this.add.rectangle(330, 230, 24, 16, 0x013220);
        this.physics.add.existing(this.enemy2);
        this.enemy2.body.setCollideWorldBounds(true);
        this.physics.add.collider(this.enemy2, this.interactiveLayer);
        this.physics.add.collider(this.enemy2, this.player);

    }

    update ()
    {
        this.enemy1.SetInstruction({action: 'patrol'});

        this.enemy1.update();

        this.enemy2.SetInstruction({action: 'patrol'});

        this.enemy2.update();


        //*
        // Horizontal movement
		if (this.cursors.left.isDown)
            this.player.SetInstruction({action: 'move', option: 'left'});
        else if (this.cursors.right.isDown)
            this.player.SetInstruction({action: 'move', option: 'right'});

        // Vertical movement
        if (this.cursors.up.isDown)
            this.player.SetInstruction({action: 'jump'});

        this.player.update();

        //console.log('mouse X: ', this.input.mousePointer.x);
        //console.log('mouse Y: ', this.input.mousePointer.y);  

    }

    createCamera = function(player, map, zoom = 1, canvasWidth = this.canvasDimensions.width, canvasHeight = this.canvasDimensions.height) {

        //this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.setBounds(0, 0, canvasWidth, canvasHeight);

        this.cameras.main.setViewport(0,0,canvasWidth,canvasHeight);

        this.cameras.main.setZoom(zoom);

        this.cameras.main.startFollow(player);

    }

    // sceneCreateDefault() completes all the nonspecific initial steps in create() of a scene.
    // The first parameter is the name of the tileset in Tiled and the second parameter is the key
    // of the tileset image used when loading the file in preload.
    sceneCreateDefault = function(tilesetNameInTiled, tilesetImageKey) {

        this.canvasDimensions = {
            width: this.cameras.main.centerX*2, // is 800
            height: this.cameras.main.centerY*2 // is 600
        }

        this.map = this.make.tilemap({ 
            key: 'map', 
            tileWidth: this.tileDimensions.width, // is 16
            tileHeight: this.tileDimensions.height // is 16
        });

        // The first parameter is the name of the tileset in Tiled and the second parameter is the key
        // of the tileset image used when loading the file in preload.
        this.tiles = this.map.addTilesetImage(tilesetNameInTiled, tilesetImageKey, this.tileDimensions.width, this.tileDimensions.height);

        this.mapDimensions = {
            x: this.map.widthInPixels,
            y: this.map.heightInPixels
        }

        // Places the map in he middle of the canvas if the map is smaller than the canvas
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
        this.backgroundLayer = this.map.createLayer('Background', this.tiles, this.rPos.x, this.rPos.y);
        this.interactiveLayer = this.map.createLayer('Interactive', this.tiles, this.rPos.x, this.rPos.y);
        this.overheadLayer = this.map.createLayer('Overhead', this.tiles, this.rPos.x, this.rPos.y);
        this.scriptLayer = this.map.createLayer('Script', this.tiles, this.rPos.x, this.rPos.y);

        this.interactiveLayer.forEachTile(tile => {
            if(tile.properties['collides']) {
                tile.setCollision(true, true, true, true, false);
            }
            if(tile.properties['oneWay']) {
                tile.setCollision(false, false, true, false, false);
            }
        });
    }

}

export default Level_1;