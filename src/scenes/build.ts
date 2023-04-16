import * as Phaser from 'phaser';
import { createBlock } from '../utils/createBlock';
import { createTextButton } from '../utils/createButtons';

export class buildScene extends Phaser.Scene {
  constructor() {
    super({ key: 'buildScene' });
  }
  preload() {
    // Load sprite sheet
    this.load.atlas(
      'sheet',
      'assets/block-sprites.png',
      'assets/block-sprites.json'
    );

    // Load body shapes from JSON file generated using PhysicsEditor
    this.load.json('shapes', 'assets/block-shapes.json');
  }

  create() {
    const Bodies = this.matter.bodies;
    const Shapes = this.cache.json.get('shapes');
    const savedBlocks: Record<any, any> = {};
    let index = 0;
    let currentBlock = '';
    let currentMode = 'build';

    // Set up bodies
    const ground = Bodies.rectangle(900, 600, 815, 50, {
      isStatic: true,
      render: {},
    });
    this.matter.world.add(ground);

    // Set up buttons
    const blockButton = createTextButton(this, 100, 100, 'Block').on(
      'pointerdown',
      () => {
        currentBlock = 'block';
        currentMode = 'build';
      }
    );

    const castleButton = createTextButton(this, 300, 100, 'Castle').on(
      'pointerdown',
      () => {
        currentBlock = 'castle';
        currentMode = 'build';
      }
    );

    const deleteButton = createTextButton(this, 500, 100, 'Delete Block').on(
      'pointerdown',
      () => {
        currentBlock = '';
        currentMode = 'delete';
      }
    );

    const nextSceneButton = createTextButton(this, 900, 100, 'Next Scene').on(
      'pointerdown',
      () => {
        this.scene.start('crushScene', { blocks: savedBlocks });
      }
    );

    // Add block to scene on click
    this.input.on('pointerdown', (pointer) => {
      if (currentBlock.length && pointer.x > 500 && pointer.y > 200) {
        const createdBlock = createBlock(
          this,
          pointer.x,
          pointer.y,
          'sheet',
          currentBlock,
          Shapes
        )
          .setInteractive()
          .setData('index', index)
          .on('pointerdown', () => {
            console.log(createdBlock.getData('index'));
            delete savedBlocks[createdBlock.getData('index')];
            createdBlock.destroy();
          });
        savedBlocks[index] = {
          x: pointer.x,
          y: pointer.y,
          key: 'sheet',
          block: currentBlock,
        };
        index++;
      }
    });
  }
}
