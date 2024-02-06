export class Character extends Phaser.GameObjects.Sprite {

    constructor({ scene, x, y, image, name, path, speed, playable, map}){
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
    DoJump(){
        if (this.body.blocked.down) {
            this.body.setVelocityY(-this.speed*1.025);
        }
    }
    DoPatrol(){
        if(!this.body) return;
        if(this.isHit >= 0) return;
        //console.log(this.previousXVelocity);
        if(
            (this.previousXPosition == this.body.position.x)
            || (this.previousXVelocity < 0 && this.checkForCliff('left'))				
            || (this.previousXVelocity > 0 && this.checkForCliff('right'))
           // || (enemy.currentDirection == 'left' && enemy.checkForCliff('left'))				
           // || (enemy.currentDirection == 'right' && enemy.checkForCliff('right'))
           ) 
        {				
            //this.changeDirection(enemy);
            
            this.speed = -this.speed;	
        }

        this.previousXPosition = this.body.position.x;

        if(this.body.velocity.x == 0) this.body.setVelocityX(-this.speed);
        this.previousXVelocity = this.body.velocity.x;
    }

    checkForCliff = function(side) {
        var offsetX;    
        if(side == 'left') {
            offsetX = -3;     
        } else if(side == 'right') {
            offsetX = this.body.width + 2;    
        }
        
        var tile = this.map.getTileAtWorldXY(this.body.position.x + offsetX, this.body.position.y + this.body.height, true, '', 'Interactive');
        
        // TODO: bug: characters turn aroudn randomly.
        //if(this.body.blocked.down && tile && tile.index < 0) {     
        //if(this.body.blocked.down && tile && (tile.collides == false || tile.oneWay == false)) { 
        if(this.body.blocked.down && tile && (tile.collides == false || tile.oneWay == false)) { 
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