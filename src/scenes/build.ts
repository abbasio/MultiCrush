import * as Phaser from 'phaser';

export class buildScene extends Phaser.Scene {
  constructor() {
    super({ key: 'buildScene' });
  }
  preload() {
    // Load sprite sheet generated with TexturePacker
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

    // Set up bodies
    const ground = Bodies.rectangle(395, 600, 815, 50, {
      isStatic: true,
      render: {},
    });

    const blockShape = {
      shape: Shapes.block,
    };

    // Add bodies to scene
    this.matter.world.add(ground);
    // Add block to scene on click
    this.input.on('pointerdown', (pointer) => {
      this.matter.add.sprite(
        pointer.x,
        pointer.y,
        'sheet',
        'block',
        blockShape as Phaser.Types.Physics.Matter.MatterBodyConfig
      );
    });
  }
}
