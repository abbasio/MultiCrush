import * as Matter from 'matter';

export const createPolygon = (
  scene: Phaser.Scene,
  Bodies: MatterJS.BodiesFactory,
  x: number,
  y: number,
  sides: number,
  radius: number,
  options: Record<any, any>
): Matter.BodyType => {
  const polygon = Bodies.polygon(x, y, sides, radius, options);
  scene.matter.world.add(polygon);
  return polygon;
};

export const createObject = (
  scene: Phaser.Scene,
  x: number,
  y: number,
  key: string,
  frame: string,
  Shapes: any
) => {
  return scene.matter.add.image(x, y, key, frame, {
    label: frame,
    shape: Shapes[frame],
    ignorePointer: true,
  } as Phaser.Types.Physics.Matter.MatterBodyConfig);
};
