export class Piker extends Phaser.GameObjects.Sprite {

    constructor({ scene, x = 0, y = 0, image = 'piker', name, path, speed, playable, indexArray, indexGroup, simpleInstruction,
        constantHitbox, constantHitboxOffset, bodyOffset, bodySize, bounce, direction}){

        super(scene, x, y, image);

////////// Non-Init attributes
        this.isHit = -1;
        this.inAnimationLoop = 0;
        this.instructionsLength = 0;
        this.previousXPosition;
        this.previousXVelocity;
        this.solidLayerCollider;
        this.oneWayLayerCollider;
        this.hitboxCollider;

        // Character movements are passed as instruction objects to
        // be evaluated on the next call to update
        this.instructions = [];

////////// General-Init attributes
        this.type = 'piker';
        this.name = name || `piker_${indexArray}_${indexGroup}_${scene.scene.key}`;
        this.image = image || 'piker';
        this.path = path || false;
        this.speed = speed || 30;
        this.bounce = bounce || 0;
        this.bodyOffset = bodyOffset || {x: 8, y: 0},
        this.bodySize = bodySize || {x: 16, y: 16},
        this.direction = direction || 'left';
        
////////// Player-Init attributes
        this.playable = playable || false;
        
        
////////// Enemy-Init attributes
        this.indexArray = indexArray;
        this.indexGroup = indexGroup;
        this.simpleInstruction = simpleInstruction || {action: 'patrol', option: ''};
        this.constantHitbox = constantHitbox || {offsetX: -6, offsetY: 8, width: 6, height: 10, color: 0xff0000, alpha: 0.5};
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

        scene.physics.add.collider(this, window.player, () => this.pikerBounce(window.player, this), null, this);

        
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
            this.hitboxCollider = scene.physics.add.overlap(window.player, this.constantHitbox, () => this.handlePlayerHit(window.player, this), null, this);
            this.constantHitbox.setDepth(10);
        }

        if(this.direction === 'right') {
            this.changeDirection();
        }

    }

    update(){

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

        // Always reset the local velocity to maintain a constant acceleration
        //this.body.setVelocityX(0);
        if(this.inAnimationLoop == 0) {
                
            this.body.setVelocityX(0);
            this.hitboxCollider.active = true;
        } else {
            this.inAnimationLoop = this.inAnimationLoop -1;
        }
        

        if(this.isHit > 0){
            // While a character is hit, count dowm on each update to allow for recovery time
			this.isHit--;
            this.tint = 0x000000;
            this.hitboxCollider.active = false;

		}else if(this.isHit === 0){
            // Character has recovered, reset their hit state
            this.tint = 0xffffff;
            this.isHit = -1;
            this.instructions = [];
            this.hitboxCollider.active = true;
        }else{
            // Process the instructions array
            this.DoInstructions();
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
        this.instructions.reverse();
        this.instructionsLength = this.instructions.length;
        if(this.instructionsLength == 0 && this.simpleInstruction.action !== '') {
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
        while(this.instructionsLength > 0){
            // Unload the first instruction from the stack
            let instruction = this.instructions.pop();
            this.instructionsLength = this.instructionsLength -1;
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
                case 'bounce':
                    this.DoBounce(instruction.option);
                    break
                case 'disabled':
                    this.DoDisabled(instruction.option);
                    break
                case 'blockI':
                    this.blockInstructions(instruction.option);
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

    DoBounce(direction){
        console.log('DoBounce');
        switch(direction){
            case 'left':
                this.hitboxCollider.active = false;
                this.body.setVelocityX(-150);
                this.body.setVelocityY(-this.scene.gravity/12);
                this.instructions = [];
                this.blockInstructions(150);
                break;
            case 'right':
                this.hitboxCollider.active = false;
                this.body.setVelocityX(150);
                this.body.setVelocityY(-this.scene.gravity/12);
                this.instructions = [];
                this.blockInstructions(150);
                break;
            case 'up':
                this.hitboxCollider.active = false;
                this.body.setVelocityY(-this.scene.gravity/12); // -50
                this.instructions = [];
                this.blockInstructions(150);
                //this.body.setVelocityX(0);
                //this.isHit = 150;
                break;
        }
    }

    blockInstructions(frames){
        console.log('piker: blockI');
        this.instructions = [];
        this.instructionsLength = 0;
        this.body.setVelocityX(this.body.velocity.x/1.1);
        if(frames > 1) {
            this.SetInstruction({action: 'blockI', option: (frames -1)});
            this.tint = 0x000000;
        } else {
            this.tint = 0xFFFFFF;
        }
        this.inAnimationLoop = frames -1;
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

    changeDirection() {
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
        this.speed = -this.speed;        
    }

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
	}
    /*
    pikerHit(player, piker) {
        player.collided = 1;
        piker.collided = 1;
        //jump on head
        if(player.y <= piker.y -15) {
            piker.isHit = 150;
            //piker.body.setVelocityX(50);
            piker.body.setVelocityY(-50);
            player.body.setVelocityY(-150);
        }
        //push from side
        else if(player.y >= piker.y -15) {
            player.isHit = 5;
            if(piker.isHit > -1) {
                piker.isHit = 150;
            }
            else {
                piker.isHit = 15;
            }
            if(player.x < piker.x) {
                piker.body.setVelocityX(300);
                player.body.setVelocityX(-100);
                player.body.setVelocityY(-30);
                if(piker.body.velocity.y == 0) {
                    piker.body.setVelocityY(-30);
                }
            }
            else if (player.x > piker.x) {
                piker.body.setVelocityX(-300);
                player.body.setVelocityX(100);
                player.body.setVelocityY(-30);
                if(piker.body.velocity.y == 0) {
                    piker.body.setVelocityY(-30);
                }
            }
        }
    }
    */

    pikerBounce(player, piker) {
        player.instructions = [];
        piker.instructions = [];
        //jump on head
        if(player.y <= piker.y -15 && player.isHit < 0) {
            player.SetInstruction({action: 'rebound', option: 'top'});
            piker.SetInstruction({action: 'bounce', option: 'up'});
            //piker.SetInstruction({action: 'disabled', option: 150});
            return;
        }
        else if(player.y > piker.y + 15 && player.isHit < 0) {
            //piker.SetInstruction({action: 'bounce', option: 'up'});
            if(player.x < piker.x) {                
                piker.SetInstruction({action: 'bounce', option: 'up'});
                //piker.SetInstruction({action: 'disabled', option: 30});
            }
            else if (player.x > piker.x) {
                piker.SetInstruction({action: 'bounce', option: 'up'});
                //piker.SetInstruction({action: 'disabled', option: 30});
            }
            return;
        }
        //push from side
        else if(player.y >= piker.y -15) {
            if(player.x < piker.x) {
                
                player.SetInstruction({action: 'rebound', option: 'left'});
                //player.SetInstruction({action: 'disabled', option: 15});
                
                piker.SetInstruction({action: 'bounce', option: 'right'});
                //piker.SetInstruction({action: 'disabled', option: 30});
            }
            else if (player.x > piker.x) {
                
                player.SetInstruction({action: 'rebound', option: 'right'});
                //player.SetInstruction({action: 'disabled', option: 15});

                piker.SetInstruction({action: 'bounce', option: 'left'});
                //piker.SetInstruction({action: 'disabled', option: 30});
            }
            return;
        }
    }

}

export class PikerPlugin extends Phaser.Plugins.BasePlugin {

    constructor(pluginManager){
        super(pluginManager);

        //  Register our new Game Object type
        pluginManager.registerGameObject('piker', this.createPiker);
    }

    createPiker(params){
        //return this.displayList.add(new RpgCharacter({scene: this.scene, ...params}));
        return new Piker({scene: this.scene, ...params});
    }

}