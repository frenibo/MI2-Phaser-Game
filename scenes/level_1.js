import { SceneParent } from '../SceneParent.js';

export class Level_1 extends SceneParent
{
    constructor(){
		super('level_1');
        //super({key:'level_1'});

		//this.portals.lab = 'Lab1';
	}

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

        this.gravity = 600;
       
////////// Player data

        this.playerData = {
            //x: this.spawnPoint.x, // + this.rPos.x,
            //y: this.spawnPoint.y, // + this.rPos.y,
            type: 'player',
        }

        this.playableScene = true;
        //this.playerSpeed = 200;
        //this.playerBounce = 0.5;

        
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
                    type: 'piker',
                    name: 'piker1',
                    x: 330, // + this.rPos.x,
                    y: 230, // + this.rPos.y,
                    constantHitbox: {offsetX: -6, offsetY: 8, width: 6, height: 10, color: 0xff0000, alpha: 0.5},
                },
                {
                    type: 'piker',
                    name: 'piker2',
                    x: 130, // + this.rPos.x,
                    y: 150, // + this.rPos.y,
                    constantHitbox: {offsetX: -6, offsetY: 8, width: 6, height: 10, color: 0xff0000, alpha: 0.5},
                },
                {
                    type: 'piker',
                    name: 'piker3',
                    x: 330, // + this.rPos.x,
                    y: 150, // + this.rPos.y,
                    constantHitbox: {offsetX: -6, offsetY: 8, width: 6, height: 10, color: 0xff0000, alpha: 0.5},
                },
    
            ];
    
            this.spriteGroupArray.push(pikerGroup);

            let portalGroup = [
                {
                    x: 72,
                    y: 256,
                    //name: 'portal1',
                    originScene: 'level_1',
                    destinationScene: 'level_2',
                    spawnPoint: {x: 232, y: 544},
                    type: 'portal',
                    active: false,
                    keyColor: 'aqua',
                    image: 'portalClosed',
                },
                {
                    x: 232,
                    y: 256, 
                    //name: 'portal2',
                    originScene: 'level_1',
                    destinationScene: 'level_2',
                    spawnPoint: {x: 120, y: 544},
                    type: 'portal',
                    active: true,
                },
    
            ];

            this.spriteGroupArray.push(portalGroup);

            let keyGroup = [
                {
                    x: 320,
                    y: 200,
                    image: 'key',
                    color: 'aqua',
                    type: 'key',
                },

    
            ];

            this.spriteGroupArray.push(keyGroup);
            //this.load.image('key', './assets/key.png');

        }

        

        


	}

    preload ()
    {
        this.load.tilemapTiledJSON('level_1', './assets/tilemaps/level_1.json');
        this.load.image('tileset_level_1', './assets/tilemaps/small_tileset_1.png');
        //this.animsManager.preload();
        //this.load.image('piker', './assets/piker.png');
        //this.load.image('portal', './assets/portal.png');
        //this.load.image('key', './assets/key.png');

        super.preload();
    }

    create ()
    {
        // super.create() completes all the nonspecific initial steps in create() of a scene.
        super.create({
            // This populates the 'settings' object used in GameScene create(settings){}.
            // TODO: Difference between settings and init(data){} ???
            // Answer: This happens after preload() has loaded all assets ?!?!
            mapKey: 'level_1',
            // 'tilesetNameInTiled' is the name of the tileset in Tiled.
            tilesetNameInTiled: 'small_tileset_1', 
            // 'tilesetImageKey' is the key of the tileset image used when loading the file in preload.
            tilesetImageKey: 'tileset_level_1',
            // Defines camera zoom on player. Default zoom = 1.
            //zoom: 1,

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