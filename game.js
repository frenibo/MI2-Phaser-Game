//import Phaser from 'phaser';

import { CharacterPlugin } from "./plugins/sprites/character.js";

import TitleScreen from "./scenes/titlescreen.js";
import Example from "./scenes/example.js";
import Level_1 from "./scenes/level_1.js";

var titleScreen = new TitleScreen();
var exampleScene = new Example();
var level_1 = new Level_1();

const config = {
	type: Phaser.AUTO,
	//canvas dimensions
	//width: 576,
	//height: 320,
	width: 800,
	height: 600,
	backgroundColor: "000000",
	physics: {
		default: 'arcade',
		arcade: {
			gravity: {y: 600},
			tileBias: 16,
			enableBody: true,
			debug: false,
		}
	},
	plugins: {
        global: [
            { key: 'CharacterPlugin', plugin: CharacterPlugin, start: true }
		]
    },
	//pixelArt: true,
	//scene: [ FirstScene ]
	scene: [ 
		Phaser.Scene 
	]
};

const game = new Phaser.Game(config);

game.scene.add('titleScreen', titleScreen);
game.scene.add('exampleScene', exampleScene);
game.scene.add('level_1', level_1);

game.scene.start('titleScreen');