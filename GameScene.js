//import Phaser from 'phaser';
//import { Anims } from './anims';

/**
 * Parent class for all playable scenes
 */
export class GameScene extends Phaser.Scene {
	constructor(sceneName) {
		super({
			key: sceneName
		});

		this.controls = null; // User controls
		this.cursors = null;
		this.player = null;

		this.spawnPoint = null;

		this.portals = {};

	}
	
	init(data){ }

	preload() {
		
	}

	create(settings) {
		
		
	}

	update(time, delta) {

		// Update the global player health
		this.game.global.playerHp = this.player.hp;

		// Close the dialog on spacebar press
		if( this.gzDialog.visible ){
			if( this.cursors.space.isDown ){
				this.gzDialog.display(false);
			}
			return false;
		}
		// Horizontal movement
		if (this.cursors.left.isDown)
			this.player.SetInstruction({action: 'walk', option: 'left'});
		else if (this.cursors.right.isDown)
			this.player.SetInstruction({action: 'walk', option: 'right'});

		// Vertical movement
		if (this.cursors.up.isDown)
			this.player.SetInstruction({action: 'walk', option: 'back'});
		else if (this.cursors.down.isDown)
			this.player.SetInstruction({action: 'walk', option: 'front'});

		this.player.update();

		// End game
		if(this.player.hp <= 0 && this.player.isHit <= 0){
			this.player.destroy();
			console.log('you dead');
			this.scene.start('EndScene');
		}else{
			if(this.hearts.list.length > this.player.hp){
				this.hearts.removeAt(this.hearts.list.length-1, true);
			}
		}

		return true;
	}

	
}