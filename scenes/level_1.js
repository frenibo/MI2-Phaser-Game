import { GameScene } from '../GameScene.js';

export class Level_1 extends GameScene
{
    constructor(){
		super('Level_1');
        // super({key:'level_1'});

		//this.portals.lab = 'Lab1';
	}

    cursors;
    // keyboard keys are now globally defined in GameScene: window.key
    //keyA;
    //keyS;
    //keyD;
    //keyW;
    player;
    tileset;
    map;
    enemy;

    init(data){

////////// World data

        this.tileDimensions = {
			width: 16,
			height: 16
		};
        
        this.zoom = 1; // Changes zoom of the camera. Default zoom = 1.
       
////////// Player data

        this.playerSpeed = 200;
        this.playerBounce = 0;

         // The coordinates the player spawns at
		this.spawnPoint = {
			x:200,
			y:240
		}
        /*
		if(data.hasOwnProperty('origin')){
			if(data.origin === 'Lab1') {
                this.spawnPoint = {
                    x:220,
                    y:240
                }
            }
		}
        */
	}

    preload ()
    {
        this.load.tilemapTiledJSON('map', './assets/tilemaps/level1.json');
        this.load.image('tiles', './assets/tilemaps/level1.png');
        //this.load.image('player', './assets/player.png');
        this.load.image('enemy', './assets/enemy.png');

        super.preload();
    }

    create ()
    {
        // super.create() completes all the nonspecific initial steps in create() of a scene.
        super.create({
            // This populates the 'settings' object used in GameScene create(settings){}.
            // TODO: Difference between settings and init(data){} ???
            // Answer: This happens after preload() has loaded all assets ?!?!
            mapKey: 'map',
            // 'tilesetNameInTiled' is the name of the tileset in Tiled.
            tilesetNameInTiled: 'level1', 
            // 'tilesetImageKey' is the key of the tileset image used when loading the file in preload.
            tilesetImageKey: 'tiles',

            zoom: 1,

		});

////////// ENEMIES //

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

        super.update();

        //console.log('mouse X: ', this.input.mousePointer.x);
        //console.log('mouse Y: ', this.input.mousePointer.y);  

    }
}