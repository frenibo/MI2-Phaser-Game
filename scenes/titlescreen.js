export class TitleScreen extends Phaser.Scene {

    constructor() {
        super({key:'titleScreen'});
    };

    preload () {

    }
    
    create () {

        this.input.on('pointerdown', () =>
        {
            this.input.stopPropagation();
            this.scene.start('level_1');
            //this.scene.switch('level_1');
        });

        this.add.text(280, 150, 'Click to Start.', { fontSize: '15px', fill: '#fff' })
    
    }
    
    update () {
    
    }
}

export default TitleScreen;