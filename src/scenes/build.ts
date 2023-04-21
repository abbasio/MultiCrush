import * as Phaser from 'phaser';
import { Object } from '../types/types';
import { createObject } from '../utils/createMatterObjects';
import { createTextButton } from '../utils/createButtons';

export class buildScene extends Phaser.Scene {
  constructor() {
    super({ key: 'buildScene' });
  }
  preload() {
    // Load sprite sheets
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
    const Bodies = this.matter.bodies;
    const blockShapes = this.cache.json.get('blockShapes');
    const slimeShape = this.cache.json.get('slimeShape');
    let savedObjects: Record<number, Object> = {};
    let current = {
      sprite: '',
      frame: '',
      mode: '',
    };
    const objectCount = {
      slime: 1,
      block: 4,
      castle: 2,
    };
    const grid = this.add
      .grid(900, 485, 640, 384, 64, 64, 0xff0000)
      .setInteractive();

    // Set up bodies
    const ground = Bodies.rectangle(640, 700, 1280, 50, {
      isStatic: true,
      render: {},
    });
    this.matter.world.add(ground);

    // Set up buttons
    const blockButtonOnClick = () => {
      current.sprite = 'blockSheet';
      current.frame = 'block';
      current.mode = 'create';
    };
    const castleButtonOnClick = () => {
      current.sprite = 'blockSheet';
      current.frame = 'castle';
      current.mode = 'create';
    };
    const slimeButtonOnClick = () => {
      current.sprite = 'slime';
      current.frame = 'slime';
      current.mode = 'create';
    };
    const deleteButtonOnClick = () => {
      current.sprite = '';
      current.frame = '';
      current.mode = 'delete';
    };
    const nextSceneButtonOnClick = () => {
      this.scene.start('crushScene', { objects: savedObjects });
    };

    const saveSceneButtonOnClick = () => {
      savedObjects = {};
      const allObjects = this.children.list.filter(
        (child) => child instanceof Phaser.Physics.Matter.Image
      );
      allObjects.forEach((obj: any, index: number) => {
        const key = obj.body.label === 'slime' ? 'slime' : 'blockSheet';
        const savedObject: Object = {
          x: obj.body.position.x,
          y: obj.body.position.y,
          key,
          frame: obj.body.label,
        };
        savedObjects[index] = savedObject;
      });
    };
    const blockButton = createTextButton(
      this,
      100,
      100,
      `Block: ${objectCount.block}`,
      blockButtonOnClick
    );

    const slimeButton = createTextButton(
      this,
      100,
      150,
      `Slime: ${objectCount.slime}`,
      slimeButtonOnClick
    );

    const castleButton = createTextButton(
      this,
      300,
      100,
      `Castle: ${objectCount.castle}`,
      castleButtonOnClick
    );

    const deleteButton = createTextButton(
      this,
      500,
      100,
      'Delete Block',
      deleteButtonOnClick
    );

    const saveSceneButton = createTextButton(
      this,
      900,
      100,
      'Save Scene',
      saveSceneButtonOnClick
    );

    const nextSceneButton = createTextButton(
      this,
      1100,
      100,
      'Next Scene',
      nextSceneButtonOnClick
    );

    // Add block to scene when the grid is clicked
    grid.on('pointerdown', (pointer) => {
      // Calculate center of grid cell clicked on via pointer coordinates
      const gridCellCenter = {
        x:
          Math.floor(grid.getLocalPoint(pointer.x, pointer.y).x / 64) * 64 +
          612,
        y:
          Math.floor(grid.getLocalPoint(pointer.x, pointer.y).y / 64) * 64 +
          325,
      };
      if (current.mode === 'create') {
        let currentShape =
          current.sprite === 'slime' ? slimeShape : blockShapes;
        if (objectCount[current.frame] === 0) {
          console.log(`No more ${current.frame}s left!`);
        }
        if (objectCount[current.frame] > 0) {
          const createdObject: Phaser.Physics.Matter.Image = createObject(
            this,
            gridCellCenter.x,
            gridCellCenter.y,
            current.sprite,
            current.frame,
            currentShape
          )
            .setInteractive() // Set the created object as interactive and give it a pointerdown listener
            .on('pointerdown', () => {
              if (current.mode === 'delete') {
                if ('label' in createdObject.body)
                  objectCount[createdObject.body.label]++;
                blockButton.text = `Block: ${objectCount.block}`;
                castleButton.text = `Castle: ${objectCount.castle}`;
                slimeButton.text = `Slime: ${objectCount.slime}`;
                createdObject.destroy();
              }
            });
          objectCount[current.frame]--;
          blockButton.text = `Block: ${objectCount.block}`;
          castleButton.text = `Castle: ${objectCount.castle}`;
          slimeButton.text = `Slime: ${objectCount.slime}`;
        }
      }
    });
  }
}
