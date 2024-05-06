export class Player extends Phaser.GameObjects.Sprite {

    constructor({ scene, x, y, image = 'player', name, path, speed, playable, simpleInstruction, type, 
        constantHitbox, constantHitboxOffset, bodyOffset, bodySize, bounce, progressData, collectedItems}){

        super(scene, x, y, image);

////////// Non-Init attributes
        this.isHit = -1;
        this.inAnimationLoop = 0;
        this.instructionsLength = 0;
        this.portalCooldown = 0;
        this.previousXPosition;
        this.previousXVelocity;
        this.solidLayerCollider;
        this.oneWayLayerCollider;

        // Character movements are passed as instruction objects to
        // be evaluated on the next call to update
        this.instructions = [];

////////// General-Init attributes
        this.type = type || 'player';
        this.name = name || 'player';
        this.image = image || 'player';
        this.path = path || false;
        this.speed = speed || 200;
        this.bounce = bounce || 0.2;
        this.bodyOffset = bodyOffset || {x: 0, y: 0},
        this.bodySize = bodySize || {x: 16, y: 32},
        this.progressData = progressData || [];
        this.collectedItems = collectedItems || [];        
////////// Player-Init attributes
        this.playable = playable || true;
        
        
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

        //this.collectedItems.forEach( item => console.log(item));
        //console.log(this.collectedItems.length);

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
            if(this.inAnimationLoop == 0) {
                
                this.body.setVelocityX(0);
            } else {
                this.inAnimationLoop = this.inAnimationLoop -1;
            }

            //console.log(this.inAnimationLoop);

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
        this.instructions.reverse();
        this.instructionsLength = this.instructions.length;
        if(this.instructionsLength == 0 && this.simpleInstruction.action !== '') {
            console.log('player: simpleInstruction');
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
            //console.log(instruction.action)
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
                case 'rebound':
                    this.DoRebound(instruction.option);
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

    DoRebound(direction){
        console.log(`player: DoRebound() ${direction}`);
        switch(direction){
            case 'left':
                player.body.setVelocityX(-100);
                player.body.setVelocityY(-30);
                this.instructions = [];
                this.blockInstructions(10);
                break;
            case 'right':
                player.body.setVelocityX(100);
                player.body.setVelocityY(-30);
                this.instructions = [];
                this.blockInstructions(10);
                break;
            case 'top':
                if(this.scene.cursors.up.isDown || this.scene.keyW.isDown) {
                    this.body.setVelocityY(-this.scene.gravity/3*1.05);
                } else {
                    this.body.setVelocityY(-this.scene.gravity/5);
                }
                break;
        }
    }

    blockInstructions(frames){
        console.log('player: blockI');
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
            this.body.setVelocityY(-this.scene.gravity/3*1.025); // -205
        }
    }

    /**
     * Cancel local velocity and stop animation
     */
    DoHalt(){
        this.body.setVelocityX(0);
        //this.anims.stopAfterRepeat();
    }

    collectItem(item) {
        if(this.collectedItems.findIndex(find => find.name === item.name) === -1) {
            this.collectedItems.push(item);
            console.log(item);
            console.log(this.collectedItems.length);
            this.addProgress(item, '.destroy();');
            this.scene.updateInfoOverlay();
        }
    }

    addProgress(object, executionString) {
        this.progressData.push([object, executionString]);
        console.log(this.progressData);
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