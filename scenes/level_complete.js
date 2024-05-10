import { SceneParent } from '../SceneParent.js';
import { sharedMethods } from "../sharedMethods.js";

export class Level_Complete extends Phaser.Scene
{
    constructor(){
		super({key:'level_complete'});
	}

    previousScene;
    rankingList;
    timeScore = performance.now();
    highscore = false;
    username = 'noUsername';

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
        this.add.text(200, 180, `${this.previousScene} Complete!`, { fontSize: '20px', fill: '#fff'}).setScrollFactor(0).setDepth(12);
        this.createTimer();
        this.createInfoOverlay();
        this.input.keyboard.on('keydown', () =>
            {
                this.input.stopPropagation();
                this.scene.start('titleScreen');
                //this.scene.switch('level_1');
            }
        );

        await this.fetchRankingList();

        if(this.rankingList) {
            this.rankingList.forEach(ranking => Number(ranking.time) < this.timeScore ? this.highscore = true : null);
            if(this.highscore == true) {
                let newScore = {'username': this.username, 'time': this.timeScore.toString(), 'datum': new Date().toISOString()};
                this.rankingList.push(newScore);
                this.rankingList = this.rankingList.sort((a, b) => Number(a.time) < Number(b.time) ? -1 : 1)
                if(this.rankingList.length > 10) {
                    this.rankingList.pop();
                }
                console.log(this.rankingList);
                this.writeToFile(this.rankingList);
            }
        }

        

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

    writeToFile(data) {
        const fs = require('fs');
        const filepath = '../storage/ranking.json';
        //const data = JSON.parse(fs.readFileSync(filepath));
        //data[someKey] = "newValue";
        fs.writeFileSync(filepath, JSON.stringify(data, null, 4));
    }

    async fetchRankingList() {
        return await fetch('../storage/ranking.json')
            .then(response => response.json())
            .then(data => this.rankingList = data)
            .catch(error => console.log(error));

    }
}