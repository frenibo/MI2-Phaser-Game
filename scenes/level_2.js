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

    spawnPoint = {x: 232, y: 544};

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
            //x: this.spawnPoint.x, // + this.rPos.x,
            //y: this.spawnPoint.y, // + this.rPos.y,
            type: 'player',
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
        
        if(!this.spriteGroupArray.length) {
            let pikerGroup = [
                {
                    x: 330, // + this.rPos.x,
                    y: 302, // + this.rPos.y,
                    name: 'piker4',
                    constantHitbox: {offsetX: -6, offsetY: 8, width: 6, height: 10, color: 0xff0000, alpha: 0.5},
                    type: 'piker',
                },
                
                {
                    x: 412, // + this.rPos.x,
                    y: 292, // + this.rPos.y,
                    name: 'piker5',
                    constantHitbox: {offsetX: -6, offsetY: 8, width: 6, height: 10, color: 0xff0000, alpha: 0.5},
                    type: 'piker',
                },
            ];
    
            this.spriteGroupArray.push(pikerGroup);

            let portalGroup = [
                {
                    x: 120,
                    y: 416, 
                    name: 'portal3',
                    originScene: 'level_2',
                    destinationScene: 'level_1',
                    spawnPoint: {x: 72, y: 256},
                    type: 'portal',
                    active: true,
                },
                {
                    x: 232,
                    y: 416,
                    name: 'portal4',
                    originScene: 'level_2',
                    destinationScene: 'level_1',
                    spawnPoint: {x: 232, y: 256},
                    type: 'portal',
                    active: true,
                },
                {
                    x: 408,
                    y: 304,
                    name: 'portal5',
                    originScene: 'level_2',
                    destinationScene: 'level_1',
                    spawnPoint: {x: 200, y: 240},
                    type: 'portal',
                    active: false,
                    keyColor: 'red',
                    image: 'portalClosed',
                },

            ];

            this.spriteGroupArray.push(portalGroup);

            let keyGroup = [
                {
                    x: 330,
                    y: 402,
                    image: 'key',
                    color: 'red',
                    type: 'key',
                },
                    
            ];

            this.spriteGroupArray.push(keyGroup);

            let timeBonusGroup = [
                {
                    x: 420,
                    y: 360,
                    image: 'timeBonus',
                    type: 'timeBonus',
                    bonus: 15,
                },
                    
            ];

            this.spriteGroupArray.push(timeBonusGroup);
        }

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