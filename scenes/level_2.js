import { SceneParent } from '../SceneParent.js';

export class Level_2 extends SceneParent
{
    constructor(){
		super('level_2');
        // super({key:'level_1'});

		//this.portals.lab = 'Lab1';
	}

    cursors;
    player;
    tileset;
    map;

    init(data){

////////// World data

        this.tileDimensions = {
			width: 16,
			height: 16
		};
        
        this.zoom = 2; // Changes zoom of the camera. Default zoom = 1.
       
////////// Player data


        this.playerData = {
            x: 200, // + this.rPos.x,
            y: 240, // + this.rPos.y,
            image: 'player',
            name: 'player',
            playable: true,
            //map: this.map,
            speed: 200,
            simpleInstruction: {action: '', option: ''},
            bodySize: {x: 16, y: 32},
            type: 'player',
            bounce: 0.2,
            bodyOffset: {x: 0, y: 0},
            bodySize:  {x: 16, y: 32},

            //speed: 100


        }

        this.playableScene = true;
        this.playerSpeed = 200;
        this.playerBounce = 0.5;

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

////////// Enemy data

        let enemyGroup = [
            {
                x: 330, // + this.rPos.x,
                y: 230, // + this.rPos.y,
                image: 'piker',
                name: 'piker1',
                playable: false,
                //map: this.map,
                speed: 30,
                simpleInstruction: {action: 'patrol', option: ''},
                constantHitbox: {offsetX: -6, offsetY: 8, width: 6, height: 10, color: 0xff0000, alpha: 0.5},
                bodyOffset: {x: 8, y: 0},
                bodySize: {x: 16, y: 16},
                type: 'enemy',
                //speed: 100
            },
            {
                x: 130, // + this.rPos.x,
                y: 150, // + this.rPos.y,
                image: 'piker',
                name: 'piker2',
                playable: false,
                //map: this.map,
                speed: 30,
                simpleInstruction: {action: 'patrol', option: ''},
                constantHitbox: {offsetX: -6, offsetY: 8, width: 6, height: 10, color: 0xff0000, alpha: 0.5},
                bodyOffset: {x: 8, y: 0},
                bodySize: {x: 16, y: 16},
                type: 'enemy',
                //speed: 100
            },
            {
                x: 330, // + this.rPos.x,
                y: 150, // + this.rPos.y,
                image: 'piker',
                name: 'piker3',
                playable: false,
                //map: this.map,
                speed: 30,
                simpleInstruction: {action: 'patrol', option: ''},
                constantHitbox: {offsetX: -6, offsetY: 8, width: 6, height: 10, color: 0xff0000, alpha: 0.5},
                bodyOffset: {x: 8, y: 0},
                bodySize: {x: 16, y: 16},
                type: 'enemy',
                //speed: 100
            },

        ];

        this.enemyGroupArray.push(enemyGroup);


	}

    preload ()
    {
        this.load.tilemapTiledJSON('map', './assets/tilemaps/level1.json');
        this.load.image('tiles', './assets/tilemaps/level1.png');
        this.load.image('piker', './assets/piker.png');

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
            // Defines camera zoom on player. Default zoom = 1.
            zoom: 1,

		});
        
    }

    update ()
    {
        if(super.update()){

		}else{

		}
        
        //console.log('mouse X: ', this.input.mousePointer.x);
        //console.log('mouse Y: ', this.input.mousePointer.y);  

    }
}