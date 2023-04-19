import * as Phaser from 'phaser';
import { Object } from '../types/types';
import { createTextButton } from '../utils/createButtons';
import { createPolygon, createObject } from '../utils/createMatterObjects';

export class crushScene extends Phaser.Scene {
  objects: Record<number, Object>;
  constructor() {
    super({ key: 'crushScene' });
  }
  init(data) {
    this.objects = data.objects;
  }
  preload() {
    // Load sprites and sprite sheets
    this.load.atlas(
      'blockSheet',
      'assets/block-sprites.png',
      'assets/block-sprites.json'
    );

    this.load.image('slime', 'assets/slime.png');

    // Load body shapes from JSON file generated using PhysicsEditor
    this.load.json('blockShapes', 'assets/block-shapes.json');
    this.load.json('slimeShape', 'assets/slime-shape.json');
  }

  create() {
    const Constraint = this.matter.constraint;
    const Bodies = this.matter.bodies;
    const blockShapes = this.cache.json.get('blockShapes');
    const slimeShape = this.cache.json.get('slimeShape');

    // Set up bodies
    const ground = Bodies.rectangle(860, 700, 640, 50, {
      isStatic: true,
      render: {},
    });

    // Add bodies to scene
    this.matter.add.mouseSpring();
    this.matter.world.add(ground);
    const rockOptions = { density: 0.004 };
    let rock: MatterJS.BodyType = createPolygon(
      this,
      Bodies,
      200,
      500,
      8,
      20,
      rockOptions
    );

    for (let key in this.objects) {
      const obj: Object = this.objects[key];
      const currentShape = obj.key === 'slime' ? slimeShape : blockShapes;
      createObject(this, obj.x, obj.y, obj.key, obj.frame, currentShape);
    }

    // Add buttons to scene
    const resetButtonOnClick = () => {
      this.scene.start('buildScene');
    };
    const resetButton = createTextButton(
      this,
      900,
      100,
      'Reset',
      resetButtonOnClick
    );

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
        rock = createPolygon(this, Bodies, 200, 500, 8, 20, rockOptions);
        elastic.bodyB = rock;
      }
    });
  }
}

//To do:
/* 
  - Add a lil guy
  - Calculate the forces on him on a collision (block, rock, etc)
  - Count how many throws it takes to kill said lil guy
  - Give a limited number of pieces - and lil guys - to place in scene
  - Update the buttons to only allow set number to be put - button should display
    how many of the given resource you have left
  - Can't go to next scene until you've at least put 1 lil guy
  -
*/
