import { sharedMethods } from "../../sharedMethods.js";

export class Portal extends Phaser.GameObjects.Sprite {

    constructor({ scene, x = 0, y = 0, image = 'portal', name, bodyOffset, bodySize, active, indexArray, indexGroup, originScene, destinationScene, type, spawnPoint, keyColor}){

        super(scene, x, y, image);

////////// Non-Init attributes

////////// General-Init attributes
        this.name = name || `portal_${indexArray}_${indexGroup}_${scene.scene.key}`;
        this.image = image || 'portal';
        this.bodyOffset = bodyOffset || {x: 4, y: 16};
        this.bodySize = bodySize || {x: 8, y: 16};
        this.active = active || false;
        this.indexArray = indexArray;
        this.indexGroup = indexGroup;
        this.originScene = originScene || this.scene.scene.key;
        this.destinationScene = destinationScene || 'level_1';
        this.spawnPoint = spawnPoint || {x: 0, y: 0};
        this.type = type || 'portal';
        this.keyColor = keyColor || "";
        
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

        if(this.active == false) {
            if(this.keyColor) {
                this.tint = sharedMethods.colorToHex(this.keyColor);
            }
            else {
                this.tint = sharedMethods.colorToHex('green');
            }

        }

        this.body.setAllowGravity(false);

        this.setDepth(9);

        scene.physics.add.overlap(window.player.body, this.body, () => this.handlePlayerPortalOverlap(window.player, this), null, this);
    }

    update(){
        
    }

//// Do-Instruction Methods


///// Helper Methods
    handlePlayerPortalOverlap(player, portal) {
        if(portal.active == true) {
            //portal.playerOverlap = true;
            if( window.player.portalCooldown == 0) {
                if(this.scene.cursors.down.isDown || this.scene.keyS.isDown) {
                    this.scene.input.stopPropagation();
                    this.enterPortal(this);
                }
            }
        }
        if(portal.active == false) {
            //portal.playerOverlap = false;
            if(player.body.blocked.down && player.isHit === -1 && (player.collectedItems.findIndex(item => (item.type === 'key' && item.color === this.keyColor)) !== -1)) {
                this.unlockPortal(player);
            }

        }
    }

    enterPortal(portal) {
        console.log(portal.name);
        if(portal.destinationScene){
            // When destination is in same scene
            if(portal.destinationScene == this.scene.scene.key) {
                window.player.body.setVelocityX(0); 
                window.player.body.setVelocityY(0);
                window.player.body.x = portal.spawnPoint.x + this.scene.scene.scene.rPos.x -8;
                window.player.body.y = portal.spawnPoint.y + this.scene.scene.scene.rPos.y -16;
            }
            // When destination is in another scene
            else if(portal.destinationScene != this.scene.scene.key) {
                this.scene.switchScene(portal.destinationScene, portal);
            }
            window.player.portalCooldown = 30;
        }
    }

    unlockPortal(player) {
        player.DoHalt();
        player.blockInstructions(30);
        this.active = true;
        this.tint = sharedMethods.colorToHex('white');
        this.setTexture('portal');
        player.addProgress(this, '.active = true;');
        //player.addProgress(this, '.image = "potal";');
        player.addProgress(this, '.setTexture("portal");');
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