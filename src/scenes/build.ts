import * as Phaser from 'phaser';

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
    let currentBlock = '';

    // Set up bodies
    const ground = Bodies.rectangle(900, 600, 815, 50, {
      isStatic: true,
      render: {},
    });
    this.matter.world.add(ground);

    // Set up buttons
    const blockButton = this.add.text(100, 100, 'Block', {});
    blockButton
      .setInteractive()
      .on('pointerdown', () => {
        currentBlock = 'block';
      })
      .on('pointerover', () => {
        blockButton.setStyle({
          color: '#0f0',
        });
      })
      .on('pointerout', () => {
        blockButton.setStyle({
          color: '#fff',
        });
      });

    const castleButton = this.add.text(300, 100, 'Castle', {});
    castleButton
      .setInteractive()
      .on('pointerdown', () => {
        currentBlock = 'castle';
      })
      .on('pointerover', () => {
        castleButton.setStyle({
          color: '#0f0',
        });
      })
      .on('pointerout', () => {
        castleButton.setStyle({
          color: '#fff',
        });
      });

    const createObjectOnClick = (pointer: any, key: string, block: string) => {
      this.matter.add.image(pointer.x, pointer.y, key, block, {
        shape: Shapes[block],
      } as Phaser.Types.Physics.Matter.MatterBodyConfig);
    };

    // Add block to scene on click
    this.input.on('pointerdown', (pointer) => {
      console.log(pointer.x);
      if (currentBlock.length && pointer.x > 500) {
        createObjectOnClick(pointer, 'sheet', currentBlock);
      }
    });

    //Things to try:
    // Add buttons to generate different fort parts
    // Add a save button
    // On click, saves the x pos, y pos, and name, and config of each object into a json
    // On loading the next scene, parse that info from the json and load the objects into the new scene
  }
}
