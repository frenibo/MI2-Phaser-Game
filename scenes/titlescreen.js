export class TitleScreen extends Phaser.Scene {

    constructor() {
        super({key:'titleScreen'});
    };

    preload () {

    }
    
    create () {

        this.input.keyboard.on('keydown', () =>
            {
                if(window.player) {
                    //awindow.player.destroy();
                    window.player = undefined;
                }
                this.input.stopPropagation();
                this.scene.start('level_1');
                //this.scene.switch('level_1');
            }
        );

        this.add.text(280, 150, 'Press any key to start.', { fontSize: '20px', fill: '#fff' })
    
    }
    
    update () {
    
    }
}

export default TitleScreen;