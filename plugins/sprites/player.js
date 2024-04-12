export class Player extends Phaser.GameObjects.Sprite {

    constructor({ scene, x, y, image, name, path, speed, playable, 
        constantHitbox, constantHitboxOffset, bodyOffset, bodySize, bounce}){

        super(scene, x, y, image);

////////// Non-Init attributes
        this.isHit = -1;
        this.portalCooldown = 0;
        this.previousXPosition;
        this.previousXVelocity;
        this.solidLayerCollider;
        this.oneWayLayerCollider;

        // Character movements are passed as instruction objects to
        // be evaluated on the next call to update
        this.instructions = [];

////////// General-Init attributes
        this.type = type || '';
        this.name = name || "anonymous";
        this.image = image;
        this.path = path || false;
        this.speed = speed;
        this.bounce = bounce || 0;
        this.bodyOffset = bodyOffset || null; // {x: 0, y: 0},
        this.bodySize = bodySize || null; // {x: 16, y: 16},
        
////////// Player-Init attributes
        this.playable = playable || false;
        
        
////////// Enemy-Init attributes
        this.index1 = index1 || undefined;
        this.index2 = index2 || undefined;
        this.simpleInstruction = simpleInstruction || {action: '', option: ''};
        this.constantHitbox = constantHitbox || null;
        this.constantHitboxOffset = constantHitboxOffset || {x: 0, y: 0};
        
        
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

        this.body.setBounce(this.bounce);

        this.body.setCollideWorldBounds(true);

        this.solidLayerCollider = scene.physics.add.collider(this, scene.solidLayer);
        this.oneWayLayerCollider = scene.physics.add.collider(this, scene.oneWayLayer);

        this.setDepth(10);

        if(this.type === 'enemy') {

            scene.physics.add.collider(this, scene.player);

        }

        
////////// constantHitbox Physics Initialization
        // TODO: hitbox plugin/parent
        if(this.constantHitbox) {
            // Attach this sprite to the loaded physics engine
            scene.physics.world.enable(this.constantHitbox, 0);
            // Add this sprite to the scene
            scene.add.existing(this.constantHitbox);

            scene.physics.add.existing(this.constantHitbox);
            //this.constantHitbox.body.setCollideWorldBounds = true;
            this.constantHitbox.body.setAllowGravity(false);
            // '() =>' necessary for some reason ?
            scene.physics.add.overlap(scene.player, this.constantHitbox, () => this.handlePlayerHit(scene.player, this), null, this);
            this.constantHitbox.setDepth(10);
        }

    }

    update(){
        if(this.isHit > 0){
            // While a character is hit, count dowm on each update to allow for recovery time
			this.isHit--;
            this.tint = 0x000000;
            this.oneWayLayerCollider.active = false;
		}else if(this.isHit === 0){
            // Character has recovered, reset their hit state
            this.tint = 0xffffff;
            this.isHit = -1;
            this.instructions = [];
            this.body.setBounce(this.bounce);
            this.oneWayLayerCollider.active = true;
        }else{
            // Always reset the local velocity to maintain a constant acceleration
            this.body.setVelocityX(0);

            // Process the instructions array
            this.DoInstructions();
        }
        

        if(this.constantHitbox) {
            //this.constantHitbox.x = this.body.position.x + this.constantHitboxOffset.x;
            //this.constantHitbox.y = this.body.position.y + this.constantHitboxOffset.y;
            ///*
            if(this.flipX == false) {
                this.constantHitbox.x = this.body.position.x + this.constantHitboxOffset.x;
                this.constantHitbox.y = this.body.position.y + this.constantHitboxOffset.y;
            }
            else if(this.flipX == true) {
                this.constantHitbox.x = this.body.position.x - this.constantHitboxOffset.x + this.bodySize.x;
                this.constantHitbox.y = this.body.position.y + this.constantHitboxOffset.y;
            }
            //*/
        }

        if(this.portalCooldown > 0) {
            this.portalCooldown = this.portalCooldown -1;
            //console.log(this.portalCooldown);
        }
       
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
            (this.previousXPosition == this.body.position.x && this.body.position.x == this.prepreXPosition)
            || (this.previousXVelocity < 0 && this.checkForCliff('left'))				
            || (this.previousXVelocity > 0 && this.checkForCliff('right'))
           ) 
        {
            this.changeDirection();
            this.speed = -this.speed;	
        }

        // This attempts to prevent characters turning around randomly during frame "hickups"
        if(this.previousXPosition == this.body.position.x) {
            this.prepreXPosition = this.previousXPosition;
            // console.log(this.name);
        } else {this.prepreXPosition = -1}

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
        
        var tile1 = this.scene.map.getTileAtWorldXY(this.body.position.x + offsetX, this.body.position.y + this.body.height, true, '', 'Solid');
        var tile2 = this.scene.map.getTileAtWorldXY(this.body.position.x + offsetX2, this.body.position.y + this.body.height, true, '', 'Solid');

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

    handlePlayerHit(player, enemy) {
        if(player.isHit < 0) {
            player.isHit = 100;
            player.body.setVelocity(0);
            player.body.setBounce(0.4);
            if(player.x <= enemy.x) {
                player.body.setVelocityX(-80);
                player.body.setVelocityY(-150);

            } else {
                player.body.setVelocityX(80);
                player.body.setVelocityY(-150);
            }
            
            
            
        };
        // get hit direction

	}

    changeDirection(character) {
        if(this.flipX == false) {
            this.flipX = true;
            if(this.bodyOffset) {
                this.body.setOffset((-this.bodySize.x + this.bodyOffset.x + this.bodyOffset.x), this.bodyOffset.y);
            }
        } 
        else if(this.flipX == true) {
            this.flipX = false
            if(this.bodyOffset) {
                this.body.setOffset(this.bodyOffset.x, this.bodyOffset.y);
            }
        }
        
    }

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