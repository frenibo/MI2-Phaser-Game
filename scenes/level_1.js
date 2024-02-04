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
    helptext;

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
    }

    create ()
    {
        this.input.on('pointerdown', () =>
        {
            this.input.stopPropagation();
            this.scene.switch('titleScreen');
        });

        this.map = this.make.tilemap({ key: 'map', tileWidth: 16, tileHeight: 16 });

        // The first parameter is the name of the tileset in Tiled and the second parameter is the key
        // of the tileset image used when loading the file in preload.
        this.tiles = this.map.addTilesetImage('level1', 'tiles', 16, 16);

        // You can load a layer from the map using the layer name from Tiled, or by using the layer
        // index (0 in this case).
        
        this.background = this.map.createLayer('Background', this.tiles, 0, 0);
        this.solid = this.map.createLayer('Solid', this.tiles, 0, 0);
        this.semiPlatform = this.map.createLayer('SemiPlatform', this.tiles, 0, 0);

        this.solid.setCollisionByProperty({ collides: true});
        //this.semiPlatform.setCollisionByProperty({ oneWay: true});

        this.semiPlatform.forEachTile(tile => {
              tile.setCollision(false, false, true, false, false);
        });


        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

        this.player = this.add.rectangle(200, 240, 16, 32, 0xffff00);

        this.physics.add.existing(this.player);

        this.player.body.setBounce(0.2);
        this.player.body.setCollideWorldBounds(true);

        this.physics.add.collider(this.player, this.solid);
        this.physics.add.collider(this.player, this.semiPlatform);

        this.cursors = this.input.keyboard.createCursorKeys();


        this.cursors.up.on('down', () =>
        {
            if (this.player.body.blocked.down)
            {
                this.player.body.setVelocityY(-205);
            }
        }, this);

        //const camera = this.camera.game;
        //camera.startFollow(this.player);

    }

    update ()
    {
        this.player.body.setVelocityX(0);
        this.physics.world.collide(this.player, this.solid);

        if (this.cursors.left.isDown)
        {
            this.player.body.setVelocityX(-200);
        }
        else if (this.cursors.right.isDown)
        {
            this.player.body.setVelocityX(200);
        }
    }

}

export default Level_1;