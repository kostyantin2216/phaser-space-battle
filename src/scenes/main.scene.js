import Phaser from 'phaser';

import SoundButtons from '../ui/sound-buttons';
import MediaManager from '../utils/media-manager';
import Assets from '../assets';

import app from '../app';
import { radiansToDegrees } from '../utils/math-utils';
import { scaleToGameWidth } from '../utils/align-utils';

export const SCENE_NAME = 'MainScene';

export default class MainScene extends Phaser.Scene {
    
    static get SCENE_NAME() { return SCENE_NAME; }
    
    constructor() {
        super(SCENE_NAME);
    }
    
    preload() {
      
    }
    
    create() {
        this.background = this.add.image(0, 0, Assets.BACKGROUND);
        this.background.setOrigin(0, 0);
        this.background.setInteractive();
        this.background.on('pointerdown', this.onBackgroundClicked, this);

        const mediaManager = new MediaManager({
            scene: this, app
        });
        const sb = new SoundButtons({
            scene: this, app
        });

        this.centerX = app.game.config.width / 2;
        this.centerY = app.game.config.height / 2;

        this.ship = this.physics.add.sprite(this.centerX, this.centerY, Assets.SHIP);
        scaleToGameWidth(app, this.ship, .125);

        this.background.scaleX = this.ship.scaleX;
        this.background.scaleY = this.ship.scaleY;

        this.cameras.main.setBounds(0, 0, this.background.displayWidth, this.background.displayHeight);
        this.cameras.main.startFollow(this.ship, true);
    }

    update() {
        const distX = Math.abs(this.ship.x - this.tx);
        const distY = Math.abs(this.ship.y - this.ty);

        if (distX < 5 && distY < 5) {
            this.ship.body.setVelocity(0, 0);
        } 
    }

    onBackgroundClicked() {
        this.tx = this.background.input.localX * this.background.scaleX;
        this.ty = this.background.input.localY * this.background.scaleY;

        const angleRadians = this.physics.moveTo(this.ship, this.tx, this.ty, 60);
        const angleDegress = radiansToDegrees(angleRadians);

        this.ship.angle = angleDegress;
    }
    
}

