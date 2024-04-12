export class Portal extends Phaser.GameObjects.Sprite {

    constructor({ scene, x, y, image, name, bodyOffset, bodySize, active, index, nextScene, spawnPoint}){

        super(scene, x, y, image);

////////// Non-Init attributes

        this.playerOverlap = false;

////////// General-Init attributes
        this.name = name || "anonymous";
        this.image = image;
        this.bodyOffset = bodyOffset || null;
        this.bodySize = bodySize || null; // {x: 16, y: 32},
        this.active = active || false;
        this.index = index || undefined;
        this.nextScene = nextScene || undefined;
        this.spawnPoint = spawnPoint || {x: 0, y: 0};
        this.type = 'portal';
        
////////// Player-Init attributes
        
        
////////// Enemy-Init attributes
        
        
////////// Physics Initialization

        // Attach this sprite to the loaded physics engine
        scene.physics.world.enable(this, 0);
        // Add this sprite to the scene
        scene.add.existing(this);
        scene.physics.add.existing(this);

        if(this.bodySize) {
            if(this.bodyOffset) {
				this.body.setOffset(this.bodyOffset.x, this.bodyOffset.y);
			}
			this.body.setSize(this.bodySize.x, this.bodySize.y, false);
		}

        this.body.setAllowGravity(false);

        this.setDepth(9);

        scene.physics.add.overlap(scene.player.body, this.body, () => this.handlePlayerPortalOverlap(scene.player, this), null, this);
    }

    update(){
        this.tint = 0xffffff;

        if(this.playerOverlap == true && this.scene.player.portalCooldown == 0) {
            this.tint = 0xff0000; //TODO: replace tint with animation
            if(this.scene.cursors.down.isDown || this.scene.keyS.isDown) {
                this.enterPortal(this);
            }
        }

        this.playerOverlap = false;        
    }

//// Do-Instruction Methods


///// Helper Methods
    handlePlayerPortalOverlap(player, portal) {
        if(portal.active == true) {
            portal.playerOverlap = true;
        }
    }

    enterPortal(portal) {
        console.log(portal.name);
        if(portal.nextScene){
            if(portal.nextScene == this.scene.scene.key) {
                this.scene.input.stopPropagation();
                this.scene.player.body.setVelocityX(0); 
                this.scene.player.body.setVelocityY(0);
                this.scene.player.body.x = portal.spawnPoint.x + this.scene.scene.scene.rPos.x -8;
                this.scene.player.body.y = portal.spawnPoint.y + this.scene.scene.scene.rPos.y -16;
            }
            else if(portal.nextScene != this.scene.scene.key) {
                this.scene.input.stopPropagation();
                
                this.scene.scene.start(portal.nextScene, portal);
            }
            this.scene.player.portalCooldown = 30;
        }
    }

}

export class PortalPlugin extends Phaser.Plugins.BasePlugin {

    constructor(pluginManager){
        super(pluginManager);

        //  Register our new Game Object type
        pluginManager.registerGameObject('portal', this.createPortal);
    }

    createPortal(params){
        //return this.displayList.add(new RpgCharacter({scene: this.scene, ...params}));
        return new Portal({scene: this.scene, ...params});
    }

}