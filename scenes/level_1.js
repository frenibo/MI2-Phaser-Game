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
        this.map = this.make.tilemap({ key: 'map', tileWidth: 16, tileHeight: 16 });

        // The first parameter is the name of the tileset in Tiled and the second parameter is the key
        // of the tileset image used when loading the file in preload.
        this.tiles = this.map.addTilesetImage('level1', 'tiles', 16, 16);

        // You can load a layer from the map using the layer name from Tiled, or by using the layer
        // index (0 in this case).
        
        this.background = this.map.createLayer('Background', this.tiles, 0, 0);
        this.solid = this.map.createLayer('Solid', this.tiles, 0, 0);
        this.semiPlatform = this.map.createLayer('SemiPlatform', this.tiles, 0, 0);

        //this.solid.setCollisionByProperty({ collides: true});

        this.solid.forEachTile(tile => {
            tile.setCollision(true, true, true, true, false);
        });

        this.semiPlatform.forEachTile(tile => {
              tile.setCollision(false, false, true, false, false);
        });

        this.cursors = this.input.keyboard.createCursorKeys();

        window.player = this.player = this.add.character({
			x: this.spawnPoint.x,
			y: this.spawnPoint.y,
            image: 'player',
            name: 'player',
            playable: true,
			speed: 200
		});

        this.physics.add.existing(this.player);

        //this.player.body.setBounce(0.2);
        this.player.body.setCollideWorldBounds(true);

        this.physics.add.collider(this.player, this.solid);
        this.physics.add.collider(this.player, this.semiPlatform);

        this.createCamera(this.player, this.map);

        // ENEMY //

        window.enemy1 = this.enemy1 = this.add.character({
			x: 330,
			y: 230,
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

    createCamera = function(player, map, zoom = 1, gameWidth = this.cameras.main.centerX*2, gameHeight = this.cameras.main.centerY*2) {

        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        this.cameras.main.setViewport(0,0,gameWidth,gameHeight);

        this.cameras.main.setZoom(zoom);

        this.cameras.main.startFollow(player);

    }

}

export default Level_1;