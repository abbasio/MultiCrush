import * as Matter from 'matter';

export const createPolygon = (
  x: number,
  y: number,
  sides: number,
  radius: number,
  options: Record<any, any>
): Matter.BodyType => {
  return Matter.Bodies.polygon(x, y, sides, radius, options);
};
