export class Character extends Phaser.GameObjects.Sprite {

    constructor({ scene, x, y, image, name, path, speed, playable, map, index1, index2, simpleInstruction, type}){
        super(scene, x, y, image);

        this.path = path || false;
        this.isHit = -1;
        this.speed = speed;
        this.image = image;
        this.name = name || "anonymous";
        this.playable = playable || false;
        this.previousXPosition;
        this.previousXVelocity;
        this.map = map || undefined;
        this.index1 = index1 || undefined;
        this.index2 = index2 || undefined
        this.simpleInstruction = simpleInstruction || {action: '', option: ''};
        this.type = type || '';

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

        // Process the instructions array
        this.DoInstructions();
        
    }

    /**
     * Push a provided instruction object onto the stack
     */
    SetInstruction(instruction){
        if(!instruction.action) return;
        // Walking requires a direction
        if(instruction.action == 'move' && !instruction.option) return;

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
                    this.DoJump();
                    break;
                case 'patrol':
                    this.DoPatrol();
                    break
            }
        }
        if(this.simpleInstruction.action !== '') {
            switch(this.simpleInstruction.action){
                case 'move':
                    this.DoMove(this.simpleInstruction.option);
                    break;
                case 'jump':
                    this.DoJump();
                    break;
                case 'patrol':
                    this.DoPatrol();
                    break
            }
        }
    }

//// Do-Instruction Methods

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

    
    DoJump(){
        if (this.body.blocked.down) {
            this.body.setVelocityY(-this.speed*1.025);
        }
    }

    /**
     * Cancel local velocity and stop animation
     */
    DoHalt(){
        this.body.setVelocityX(0);
        //this.anims.stopAfterRepeat();
    }

    DoPatrol(){
        if(!this.body) return;
        if(this.isHit >= 0) return;
        if(
            (this.previousXPosition == this.body.position.x)
            || (this.previousXVelocity < 0 && this.checkForCliff('left'))				
            || (this.previousXVelocity > 0 && this.checkForCliff('right'))
           ) 
        {				
            //this.changeDirection(enemy);
            this.speed = -this.speed;	
        }

        this.previousXPosition = this.body.position.x;

        if(this.body.velocity.x == 0){ 
            this.body.setVelocityX(-this.speed);
        };
        this.previousXVelocity = this.body.velocity.x;
    }

///// Helper Methods

    checkForCliff = function(side) {
        var offsetX;
        var offsetX2;   
        if(side == 'left') {
            offsetX = -3;
            offsetX2 = -4;     
        } else if(side == 'right') {
            offsetX = this.body.width + 2;
            offsetX2 = this.body.width + 3;  
        }
        
        var tile1 = this.map.getTileAtWorldXY(this.body.position.x + offsetX, this.body.position.y + this.body.height, true, '', 'Interactive');
        var tile2 = this.map.getTileAtWorldXY(this.body.position.x + offsetX2, this.body.position.y + this.body.height, true, '', 'Interactive');

        // TODO: bug: characters turn aroudn randomly.
        // Answer: Checking for two positions one pixel apart.
        //if(this.body.blocked.down && tile && (tile.collides == false || tile.oneWay == false)) {
        if(this.body.blocked.down
            && tile1
            && (!tile1.properties['solid'] || tile1.properties['solid'] == false )
            && tile2 
            && (!tile2.properties['solid'] || tile2.properties['solid'] == false )
            ) {
            return true;    
        } 
        else {
            return false;
        }
    };
}

export class CharacterPlugin extends Phaser.Plugins.BasePlugin {

    constructor(pluginManager){
        super(pluginManager);

        //  Register our new Game Object type
        pluginManager.registerGameObject('character', this.createCharacter);
    }

    createCharacter(params){
        //return this.displayList.add(new RpgCharacter({scene: this.scene, ...params}));
        return new Character({scene: this.scene, ...params});
    }

}