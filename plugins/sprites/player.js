export class Player extends Phaser.GameObjects.Sprite {

    constructor({ scene, x, y, image, name, path, speed, playable, simpleInstruction, type, 
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

}

export class PlayerPlugin extends Phaser.Plugins.BasePlugin {

    constructor(pluginManager){
        super(pluginManager);

        //  Register our new Game Object type
        pluginManager.registerGameObject('player', this.createPlayer);
    }

    createPlayer(params){
        //return this.displayList.add(new RpgCharacter({scene: this.scene, ...params}));
        return new Player({scene: this.scene, ...params});
    }

}