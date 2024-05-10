import { sharedMethods } from "../../sharedMethods.js";

export class TimeBonus extends Phaser.GameObjects.Sprite {

    constructor({ scene, x = 0, y = 0, image = 'timeBonus', name, bodyOffset, bodySize, indexArray, indexGroup, type, bonus}){

        super(scene, x, y, image);

////////// Non-Init attributes

        this.timeBonusText;
        this.overlayText;

////////// General-Init attributes
        this.name = name || `timeBonus_${indexArray}_${indexGroup}_${scene.scene.key}`;
        this.image = image || 'timeBonus';
        this.bodyOffset = bodyOffset || {x: 0, y: 0};
        this.bodySize = bodySize || {x: 8, y: 8};
        this.indexArray = indexArray;
        this.indexGroup = indexGroup;
        this.type = type || 'timeBonus';
        this.bonus = bonus || 10;
        
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
        this.overlayText = bonus.toString();
        this.timeBonusText = this.scene.add.text(x-3.5*this.overlayText.length, y-7, this.overlayText, { fontSize: '11px', fill: '#000'});
        this.scene.add.existing(this.timeBonusText).setDepth(10);
        //this.Sprite.addChild(this.timeBonusText); //.setDepth(10);

        this.setDepth(9);

        scene.physics.add.overlap(window.player.body, this.body, () => this.handlePlayerTimeBonusOverlap(window.player, this), null, this);
    }

    update(){
        
    }

//// Do-Instruction Methods


///// Helper Methods
    handlePlayerTimeBonusOverlap(player, timeBonus) {
        player.collectItem(timeBonus);
        player.clock = player.clock + this.bonus*1000;
        timeBonus.destroyItem();
        console.log(window.player.scene.spriteGroupArray);
    }

    destroyItem() {
        this.destroy();
        this.timeBonusText.destroy();
    }
}

export class TimeBonusPlugin extends Phaser.Plugins.BasePlugin {

    constructor(pluginManager){
        super(pluginManager);

        //  Register our new Game Object type
        pluginManager.registerGameObject('timeBonus', this.createTimeBonus);
    }

    createTimeBonus(params){
        //return this.displayList.add(new RpgCharacter({scene: this.scene, ...params}));
        return new TimeBonus({scene: this.scene, ...params});
    }

}