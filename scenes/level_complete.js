import { SceneParent } from '../SceneParent.js';
import { sharedMethods } from "../sharedMethods.js";

export class Level_Complete extends Phaser.Scene
{
    constructor(){
		super({key:'level_complete'});
	}

    previousScene;
    rankingList;
    rankingListArray = [];
    timeScore = 0;
    highscore = false;
    username = 'ANONYM';
    privateCode = 'lQc4nWb0k06MGIgC_sOlLQQ1BuQTZlw0yYSLIOZvD7Pg';
    publicCode = '663e84b78f40bc5de4ae67f8';
    webURL = "http://dreamlo.com/lb/";


    init(data){

		if(data) {
			if(data.type === 'portal') {
                console.log(data);
                this.previousScene = data.thisScene.nameLevel;
			}
		}
    }

    preload ()
    {

    }

    async create ()
    {
        this.timeScore = window.player.clock;
        console.log(this.timeScore);

        this.add.text(200, 180, `${this.previousScene} Complete!`, { fontSize: '20px', fill: '#fff'}).setScrollFactor(0).setDepth(12);
        this.createTimer();
        this.createInfoOverlay();
        console.log('prefetch');
        this.rankingList = await this.fetchRankingList();
        console.log('postfetch');
        console.log(this.rankingList.dreamlo.leaderboard);

        if(this.rankingList.dreamlo.leaderboard) {
            if(this.rankingList.dreamlo.leaderboard.entry.length) {
                this.rankingList.dreamlo.leaderboard.entry.forEach(ranking => Number(ranking.score) < this.timeScore ? this.highscore = true : null);
            }
            else {
                this.highscore = true;
            }
        }
        else {
            this.highscore = true;
        }

        if(this.highscore == true) {

           await this.writeToFile();
           this.rankingList = await this.fetchRankingList();
           console.log(this.rankingList.dreamlo.leaderboard);
        }

        
        
        this.input.keyboard.on('keydown', () =>
            {
                this.input.stopPropagation();
                this.scene.start('titleScreen');
                //this.scene.switch('level_1');
            }
        );
    }

    update ()
    {

    }

    createTimer() {
        //this.timer = this.add.text(400, 230, 'Click to Start.', { fontSize: '15px', fill: '#000' }).setScrollFactor(0).setDepth(11);
        //console.log(performance.now())
        if(window.player.clock) {
            this.timerDisplay = this.add.text(200, 200, '00:00:00', { fontSize: '20px', fill: '#fff'}).setScrollFactor(0).setDepth(11);
            this.timeScore = performance.now()-window.player.clock;
            this.timerDisplay.setText(`${this.convertNumToTimeElapsed(this.timeScore)}`);
        }
        else {
            console.log(window.player);
        }
    }

    convertNumToTimeElapsed(ms) {
        let date = new Date(null);
        date.setMilliseconds(ms); // specify value for SECONDS here
        let result = date.toISOString().slice(14, 22);
        return result
    }

    createInfoOverlay() {
		console.log('updateInfoOverlay()');
		window.player.collectedItems.forEach((item, index) => {
			//let image = this.add.image((this.cameras.main.centerX - this.rPos.x)*2 +14 -index*14, 440, `${item.type}_collected`).setScrollFactor(0); // 592, 440
			let image = this.add.image(200-8-index*16, 200, `${item.type}_collected`).setScrollFactor(0).setDepth(11); // TODO: Werte dynamisch berechnen.
			if(item.overlayText) {
				this.add.text(200-8-index*16-3.5*item.overlayText.length, 200-7, item.overlayText, { fontSize: '11px', fill: '#000'}).setScrollFactor(0).setDepth(12);
			}
			if(item.color) {
				image.tint = sharedMethods.colorToHex(item.color);
			}
			//let image = this.add.image(this.canvasDimensions.width + this.rPos.x -20, this.canvasDimensions.height + this.rPos.y -20, `${item.type}_collected`).setScrollFactor(0);
			console.log((this.cameras.main.centerX)*2)
		})
	}

    compareRanking() {

    }

    async writeToFile() {
        let username = this.username;
        let count = 0;
        console.log(this.rankingList.dreamlo.leaderboard)
        if(this.rankingList.dreamlo.leaderboard) {
            console.log(this.rankingList.dreamlo.leaderboard.entry)
            if(this.rankingList.dreamlo.leaderboard.entry.length > 1) {
                this.rankingList.dreamlo.leaderboard.entry.forEach(entry => entry.name.split('_')[0] === this.username ? count = count +1 : null);
                if(count > 0) {
                    username = username + '_' + count.toString();
                }
            }
            else if (this.rankingList.dreamlo.leaderboard.entry.name) {
                if(this.rankingList.dreamlo.leaderboard.entry.name === username) {
                    username = username + '_1';
                }
            }
        }
        console.log(username);

        await fetch(`http://dreamlo.com/lb/lQc4nWb0k06MGIgC_sOlLQQ1BuQTZlw0yYSLIOZvD7Pg/add/${username}/${this.timeScore.toString()}`);

    }

    async fetchRankingList() {
       //Source: https://stackoverflow.com/a/59916857/16613784
        let response = await fetch(`http://dreamlo.com/lb/663e84b78f40bc5de4ae67f8/json-asc`);
        if(!response.ok) {// check if response worked (no 404 errors etc...)
            throw new Error(response.statusText);
        }
        return await response.json();
    }
}