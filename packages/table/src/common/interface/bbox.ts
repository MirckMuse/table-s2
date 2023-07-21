export interface SimpleBBox {
  x: number;

  y: number;

  width: number;

  height: number;
}

export interface BBox extends SimpleBBox {
  minX: number;

  minY: number;

  maxX: number;

  maxY: number;
}