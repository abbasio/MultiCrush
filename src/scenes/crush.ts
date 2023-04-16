import * as Phaser from 'phaser';
import { createBlock } from '../utils/createBlock';
import { createPolygon } from '../utils/createMatterObjects';

export class crushScene extends Phaser.Scene {
  blocks: Record<any, any>;
  constructor() {
    super({ key: 'crushScene' });
  }
  init(data) {
    this.blocks = data.blocks;
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
    const Constraint = this.matter.constraint;
    const Bodies = this.matter.bodies;
    const Shapes = this.cache.json.get('shapes');

    // Set up bodies
    const ground = Bodies.rectangle(900, 600, 815, 50, {
      isStatic: true,
      render: {},
    });

    // Add bodies to scene
    this.matter.add.mouseSpring();
    this.matter.world.add(ground);
    const rockOptions = { density: 0.004 };
    let rock = createPolygon(Bodies, 200, 500, 8, 20, rockOptions);
    this.matter.world.add(rock);

    this.blocks.forEach((block) => {
      createBlock(this, block.x, block.y, block.key, block.block, Shapes);
    });

    // Set up slingshot
    const anchor = { x: 200, y: 500 };
    let elastic = Constraint.create({
      pointA: anchor,
      bodyB: rock,
      length: 0.01,
      damping: 0.01,
      stiffness: 0.05,
    });
    this.matter.world.add(elastic);

    // Add slingshot functionality
    this.matter.world.on('afterupdate', () => {
      if (
        this.input.activePointer.leftButtonReleased() &&
        rock.position.x > 220
      ) {
        rock = createPolygon(Bodies, 200, 500, 8, 20, rockOptions);
        this.matter.world.add(rock);
        elastic.bodyB = rock;
      }
    });
  }
}
