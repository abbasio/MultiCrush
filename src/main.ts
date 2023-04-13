import * as Phaser from 'phaser';
import { MainScene } from './scenes/mainScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'matter',
    matter: {
      debug: true,
    },
  },
  scene: MainScene,
};

let game = new Phaser.Game(config);
