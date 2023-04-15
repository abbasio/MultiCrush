import * as Phaser from 'phaser';
import { buildScene } from './build';

export class crushScene extends Phaser.Scene {
  constructor() {
    super({ key: 'crushScene' });
  }

  create() {
    const Constraint = this.matter.constraint;
    const Bodies = this.matter.bodies;

    // Set up bodies
    const ground = Bodies.rectangle(395, 600, 815, 50, {
      isStatic: true,
      render: {},
    });

    const createRock = (
      x: number,
      y: number,
      sides: number,
      radius: number,
      options: Record<any, any>
    ) => {
      return Bodies.polygon(x, y, sides, radius, options);
    };

    const createBlock = (
      x: number,
      y: number,
      width: number,
      height: number,
      blockOptions: Record<any, any>
    ) => {
      return Bodies.rectangle(x, y, width, height, blockOptions);
    };

    // Add bodies to scene
    this.matter.add.mouseSpring();
    this.matter.world.add(ground);
    const rockOptions = { density: 0.004 };
    let rock = createRock(170, 450, 8, 20, rockOptions);
    this.matter.world.add(rock);
    const blockOptions = {
      ignorePointer: true,
    };
    this.matter.add.pyramid(500, 300, 9, 10, 0, 0, function (x, y) {
      return createBlock(x, y, 25, 40, blockOptions);
    });

    // Set up slingshot
    const anchor = { x: 170, y: 450 };
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
        (rock.position.x > 190 || rock.position.y < 430)
      ) {
        rock = createRock(170, 450, 8, 20, rockOptions);
        this.matter.world.add(rock);
        elastic.bodyB = rock;
      }
    });
  }
}
