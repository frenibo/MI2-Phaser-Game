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

        this.physics.add.collider(this.player, this.solid);
        this.physics.add.collider(this.player, this.semiPlatform);

        this.createCamera(this.player, this.map, 1);

        // ENEMY //

        window.enemy1 = this.enemy1 = this.add.character({
			x: 330 + this.rPos.x,
			y: 230 + this.rPos.y,
            image: 'enemy',
            name: 'enemy1',
            playable: false,
			speed: 200
		});

        //this.enemy1 = this.add.rectangle(330, 230, 24, 16, 0x013220);
        this.physics.add.existing(this.enemy1);
        this.enemy1.body.setCollideWorldBounds(true);
        this.physics.add.collider(this.enemy1, this.solid);
        this.physics.add.collider(this.enemy1, this.semiPlatform);
        this.physics.add.collider(this.enemy1, this.player);

    }

    update ()
    {
        //*
        // Horizontal movement
		if (this.cursors.left.isDown)
            this.player.SetInstruction({action: 'move', option: 'left'});
        else if (this.cursors.right.isDown)
            this.player.SetInstruction({action: 'move', option: 'right'});

        // Vertical movement
        if (this.cursors.up.isDown)
            this.player.SetInstruction({action: 'jump', option: 'up'});

        this.player.update();
        /*/

        // ENEMY // 
        /*
        this.enemy.body.setVelocityX(0);
        if(enemy.previousXPosition == enemy.body.position.x				
            || (enemy.currentDirection == 'left' && enemy.checkForCliff('left'))				
            || (enemy.currentDirection == 'right' && enemy.checkForCliff('right'))) 
        {				
            this.changeDirection(enemy);			
        }
        */
    }
    /*
    checkForCliff = function(side) {
        var offsetX;    
        if(side == 'left') {
            offsetX = -3;     
        } else if(side == 'right') {
            offsetX = this.body.width + 2;    
        }    
        var tile = this.map.getTileWorldXY(this.body.position.x + offsetX, this.body.position.y + this.body.height);
        if(this.isTouchingGround() && tile && emptySpaceTiles.indexOf(tile.index) > -1) {        
            console.log("You are at the cliff.");        
            return true;    
        } 
        else {        
            return false;    
        }
    };
    */

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
        
        // TODO: Layers need to be normed.
        // You can load a layer from the map using the layer name from Tiled, or by using the layer
        // index (0 in this case).
        this.background = this.map.createLayer('Background', this.tiles, this.rPos.x, this.rPos.y);
        this.solid = this.map.createLayer('Solid', this.tiles, this.rPos.x, this.rPos.y);
        this.semiPlatform = this.map.createLayer('SemiPlatform', this.tiles, this.rPos.x, this.rPos.y);

        this.solid.forEachTile(tile => {
            if(tile.properties['collides']) {
                tile.setCollision(true, true, true, true, false);
            }
        });

        this.semiPlatform.forEachTile(tile => {
            if(tile.properties['oneWay']) {
                tile.setCollision(false, false, true, false, false);
            }
        });

    }

}

export default Level_1;