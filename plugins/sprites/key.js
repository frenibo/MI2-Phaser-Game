import { sharedMethods } from '../../sharedMethods.js';

export class Key extends Phaser.GameObjects.Sprite {

    constructor({ scene, x = 0, y = 0, image = 'key', color = 'grey', name, bodyOffset, bodySize, indexArray = undefined, indexGroup = undefined, type}){

        super(scene, x, y, image);

////////// Non-Init attributes

        this.playerOverlap = false;

////////// General-Init attributes
        this.name = name || `key_${indexArray}_${indexGroup}_${scene.scene.key}`;
        this.image = image || 'key';
        this.color = color || 'grey';
        this.bodyOffset = bodyOffset || {x: 0, y: 0};
        this.bodySize = bodySize || {x: 16, y: 32};
        this.indexArray = indexArray;
        this.indexGroup = indexGroup;
        this.type = type || 'key';
        
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

        this.setDepth(10);

        this.tint = sharedMethods.colorToHex(this.color);

        scene.physics.add.overlap(window.player.body, this.body, () => this.handlePlayerKeyOverlap(window.player, this), null, this);
    }

    update(){

    }

//// Do-Instruction Methods


///// Helper Methods
    handlePlayerKeyOverlap(player, key) {
        player.collectItem(key);
        key.destroy();
        console.log(window.player.scene.spriteGroupArray);
    }
}

export class KeyPlugin extends Phaser.Plugins.BasePlugin {

    constructor(pluginManager){
        super(pluginManager);

        //  Register our new Game Object type
        pluginManager.registerGameObject('key', this.createKey);
    }

    createKey(params){
        //return this.displayList.add(new RpgCharacter({scene: this.scene, ...params}));
        return new Key({scene: this.scene, ...params});
    }

}