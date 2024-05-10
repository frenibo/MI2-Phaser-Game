//import Phaser from 'phaser';

import { CharacterPlugin } from "./plugins/sprites/character.js";
import { PlayerPlugin } from "./plugins/sprites/player.js";
import { PikerPlugin } from "./plugins/sprites/piker.js";
import { PortalPlugin } from "./plugins/sprites/portal.js";
import { KeyPlugin } from "./plugins/sprites/key.js";
import { TimeBonusPlugin } from "./plugins/sprites/timeBonus.js";

import { sharedMethods } from "./sharedMethods.js";

import { TitleScreen } from "./scenes/titlescreen.js";
import { Level_1 } from "./scenes/level_1.js";
import { Level_2 } from "./scenes/level_2.js";
import { Level_Complete } from "./scenes/level_complete.js";

var titleScreen = new TitleScreen();
var level_1 = new Level_1();
var level_2 = new Level_2();
var level_complete = new Level_Complete();

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
            { key: 'CharacterPlugin', plugin: CharacterPlugin, start: true },
			{ key: 'PlayerPlugin', plugin: PlayerPlugin, start: true },
			{ key: 'PikerPlugin', plugin: PikerPlugin, start: true },
			{ key: 'PortalPlugin', plugin: PortalPlugin, start: true },
			{ key: 'KeyPlugin', plugin: KeyPlugin, start: true },
			{ key: 'TimeBonusPlugin', plugin: TimeBonusPlugin, start: true },
		]
    },
	//pixelArt: true,
	//scene: [ FirstScene ]
	scene: [ 
		//Phaser.Scene
		titleScreen,
		level_1,
		level_2,
		level_complete,
	]
};

const game = new Phaser.Game(config);

//game.scene.add('titleScreen', titleScreen);
//game.scene.add('exampleScene', exampleScene);
//game.scene.add('level_1', level_1);

//game.scene.start('titleScreen');