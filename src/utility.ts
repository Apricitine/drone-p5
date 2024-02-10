/* This file contains utility functions and types that do not use p5.js */

type Enumerate<
  N extends number,
  Acc extends number[] = []
> = Acc["length"] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc["length"]]>

/**
 * Restricts anumber type to a range of numbers
 */
export type RangeConstraint<F extends number, T extends number> = Exclude<
  Enumerate<T>,
  Enumerate<F>
>

/**
 * Calculates the squared distance between two points in a 2D plane.
 *
 * @param x1 The x-coordinate of the first point.
 * @param y1 The y-coordinate of the first point.
 * @param x2 The x-coordinate of the second point.
 * @param y2 The y-coordinate of the second point.
 * @returns The squared distance between the two points.
 */
export function squaredDistance(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  return (x2 - x1) ** 2 + (y2 - y1) ** 2
}

/**
 * Calculates the modulus of two numbers.
 * @param value1 - The dividend.
 * @param value2 - The divisor.
 * @returns The modulus of the two numbers.
 */
export function modulus(value1: number, value2: number): number {
  return ((value1 % value2) + value2) % value2
}

/**
 * Performs smooth interpolation between two values.
 * @param start - The starting value.
 * @param stop - The ending value.
 * @param per - The interpolation amount
 * @returns The interpolated value.
 */
export function smoothStep(per: number, start?: number, stop?: number): number {
  start = start || 0
  stop = stop || 1
  per -= min(start, stop)
  per /= abs(stop - start)

  return start + (stop - start) * (per * per * (3 - 2 * per))
}

/**
 * Calculates the row and column of a hexagon based on the given coordinates.
 * @param x The x-coordinate of the point.
 * @param y The y-coordinate of the point.
 * @returns An array containing the row and column of the hexagon.
 */
export function getHexagon(x: number, y: number): [number, number] {
  const hexagonSize = 20

  let row = ~~(y / hexagonSize)
  let column = ~~(x / (hexagonSize << 1))

  const offsetX = x - column * (hexagonSize << 1)
  let offsetY = y - row * hexagonSize

  if (((row ^ column) & 1) === 0) offsetY = hexagonSize - offsetY

  const right = 0 < hexagonSize * (offsetX - hexagonSize) ? 1 : 0

  row += (column ^ row ^ right) & 1
  column += right

  return [row, column]
}

/**
 * Returns the minimum value between two numbers.
 * @param a - The first number.
 * @param b - The second number.
 * @returns The smaller of the two numbers.
 */
export function min(a: number, b: number): number {
  return a < b ? a : b
}

/**
 * Returns the maximum of two numbers.
 * @param a - The first number.
 * @param b - The second number.
 * @returns The maximum of the two numbers.
 */
export function max(a: number, b: number): number {
  return a > b ? a : b
}

/**
 * Returns the absolute value of a number.
 * @param a - The number to calculate the absolute value of.
 * @returns The absolute value of the input number.
 */
export function abs(a: number): number {
  return a < 0 ? -a : a
}
