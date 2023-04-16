import * as Matter from 'matter';

export const createPolygon = (
  Bodies: MatterJS.BodiesFactory,
  x: number,
  y: number,
  sides: number,
  radius: number,
  options: Record<any, any>
): Matter.BodyType => {
  return Bodies.polygon(x, y, sides, radius, options);
};
