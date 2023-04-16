export const createBlock = (
  scene: Phaser.Scene,
  x: number,
  y: number,
  key: string,
  block: string,
  Shapes: any
) => {
  scene.matter.add.image(x, y, key, block, {
    shape: Shapes[block],
    ignorePointer: true,
  } as Phaser.Types.Physics.Matter.MatterBodyConfig);
};
