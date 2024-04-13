import { SceneParent } from '../SceneParent.js';

export class Level_2 extends SceneParent
{
    constructor(){
		super('level_2');
        //super({key:'level_1'});

		//this.portals.lab = 'Lab1';
	}

    levelName = 'level_2';
    tilesetNameInTiled = 'level1';
    tilesetImageKey = 'tiles';

    cursors;
    player;
    tileset;
    map;

    spawnPoint = {x: 200, y: 240};

    init(data){

        console.log(data);
		if(data) {
			if(data.type === 'portal') {
				this.spawnPoint.x = data.spawnPoint.x;
				this.spawnPoint.y = data.spawnPoint.y;
			}
		}

////////// World data

        this.tileDimensions = {
			width: 16,
			height: 16
		};
        
        this.zoom = 2; // Changes zoom of the camera. Default zoom = 1.
       
////////// Player data


        this.playerData = {
            x: this.spawnPoint.x, // + this.rPos.x,
            y: this.spawnPoint.y, // + this.rPos.y,
            image: 'player',
            name: 'player',
            playable: true,
            //map: this.map,
            speed: 200,
            simpleInstruction: {action: '', option: ''},
            type: 'player',
            bounce: 0.2,
            bodyOffset: {x: 0, y: 0},
            bodySize:  {x: 16, y: 32},

            //speed: 100


        }

        this.playableScene = true;
        this.playerSpeed = 200;
        this.playerBounce = 0.5;

        
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
        
        if(!this.enemyGroupArray.length) {
            let pikerGroup = [
                {
                    x: 330, // + this.rPos.x,
                    y: 430, // + this.rPos.y,
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
                    x: 500, // + this.rPos.x,
                    y: 420, // + this.rPos.y,
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
                /*
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
                */
            ];
    
            this.enemyGroupArray.push(pikerGroup);
            //this.enemyGroupArray[0] = enemyGroup;

        }
        

        

        this.portals = [
            {
                x: 120,
                y: 544, 
                image: 'portal', 
                name: 'portal1', 
                bodyOffset: {x: 4, y: 16},
                bodySize: {x: 8, y: 16},
                active: true,
                originScene: 'level_2',
                destinationScene: 'level_1',
                spawnPoint: {x: 232, y: 256},
            },
            {
                x: 232,
                y: 544, 
                image: 'portal', 
                name: 'portal2', 
                bodyOffset: {x: 4, y: 16},
                bodySize: {x: 8, y: 16},
                active: true,
                originScene: 'level_2',
                destinationScene: 'level_1',
                spawnPoint: {x: 72, y: 256},
            },

        ];


	}

    preload ()
    {
        this.load.tilemapTiledJSON('level_2', './assets/tilemaps/level_2.json');
        this.load.image('tileset_level_2', './assets/tilemaps/small_tileset_1.png');
        this.load.image('piker', './assets/piker.png');
        this.load.image('portal', './assets/portal.png');

        super.preload();
    }

    create ()
    {
        // super.create() completes all the nonspecific initial steps in create() of a scene.
        super.create({
            // This populates the 'settings' object used in GameScene create(settings){}.
            // TODO: Difference between settings and init(data){} ???
            // Answer: This happens after preload() has loaded all assets ?!?!
            mapKey: 'level_2',
            // 'tilesetNameInTiled' is the name of the tileset in Tiled.
            tilesetNameInTiled: 'small_tileset_1', 
            // 'tilesetImageKey' is the key of the tileset image used when loading the file in preload.
            tilesetImageKey: 'tileset_level_2',
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