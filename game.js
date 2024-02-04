import FirstScene from "./scenes/scene1.js";

var firstScene = new FirstScene();

const config = {
  type: Phaser.AUTO,
  width: 640,
	height: 360,
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

game.scene.start('firstScene');
