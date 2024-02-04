import FirstScene from "./scenes/scene1.js";
import Example from "./scenes/example.js";

var firstScene = new FirstScene();
var exampleScene = new Example();

const config = {
	type: Phaser.AUTO,
	//width: 640,
	//height: 360,
	width: 800,
	height: 600,
	backgroundColor: "b9eaff",
	physics: {
		default: 'arcade',
		arcade: {
			gravity: {y: 200},
			enableBody: true,
			debug: false,
		}
	},
	//scene: [ FirstScene ]
	scene: [ Phaser.Scene ]
};

var game = new Phaser.Game(config);

game.scene.add('firstScene', firstScene);
game.scene.add('exampleScene', exampleScene);

game.scene.start('exampleScene');

this.input.on('pointerdown', () =>
{
	this.input.stopPropagation();
	this.scene.switch('firstScene');
});