import * as Phaser from 'phaser';
import { buildScene } from './scenes/build';
import { crushScene } from './scenes/crush';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  backgroundColor: '#008080',
  physics: {
    default: 'matter',
    matter: {
      debug: true,
    },
  },
  scene: [buildScene, crushScene],
};

let game = new Phaser.Game(config);
