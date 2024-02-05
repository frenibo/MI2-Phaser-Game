export class PlayableCharacter extends Phaser.GameObjects.Sprite {

    constructor({ scene, x, y, image, path, speed }){
        super(scene, x, y, image);

        this.path = path || false;
        this.isHit = -1;
        this.speed = speed;
        this.image = image;

        // Character movements are passed as instruction objects to
        // be evaluated on the next call to update
        this.instructions = [];

        // Attach this sprite to the loaded physics engine
        scene.physics.world.enable(this, 0);
        // Add this sprite to the scene
        scene.add.existing(this);
    }

    update(){

        
        // Always reset the local velocity to maintain a constant acceleration
        this.body.setVelocityX(0);
        // this.body.setVelocityX(0);

        // Process the instructions array
        this.DoInstructions();
        
    }
/**

    /**
     * Push a provided instruction object onto the stack
     */
    SetInstruction(instruction){
        if(!instruction.action) return;
        // Walking requires a direction
        if(instruction.action == 'move' && !instruction.option) return;
        if(instruction.action == 'jump' && !instruction.option) return;

        this.instructions.push(instruction);
    }

    /**
     * Process the current instruction stack
     */
    DoInstructions(){
        while(this.instructions.length > 0){
            // Unload the first instruction from the stack
            let instruction = this.instructions.pop();
            switch(instruction.action){
                case 'move':
                    this.DoMove(instruction.option);
                    break;
                case 'jump':
                    this.DoJump(instruction.option);
                    break;
            }
        }
    }

    /**
     * Process a walk instruction
     */
    DoMove(direction){
        switch(direction){
            case 'left':
                this.body.setVelocityX(-this.speed);
                break;
            case 'right':
                this.body.setVelocityX(this.speed);
                break;
        }
    }

    /**
     * Process a jump instruction
     */
    DoJump(direction){
        switch(direction){
            case 'up':
                if (this.body.blocked.down) {
                    this.body.setVelocityY(-this.speed*1.025);
                }
                break;
        }
    }
}

export class PlayableCharacterPlugin extends Phaser.Plugins.BasePlugin {

    constructor(pluginManager){
        super(pluginManager);

        //  Register our new Game Object type
        pluginManager.registerGameObject('playableCharacter', this.createPlayableCharacter);
    }

    createPlayableCharacter(params){
        //return this.displayList.add(new RpgCharacter({scene: this.scene, ...params}));
        return new PlayableCharacter({scene: this.scene, ...params});
    }

}