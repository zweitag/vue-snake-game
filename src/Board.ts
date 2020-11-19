import { Direction } from './helpers/calculateNewBoard';

const candy = "candy";

class Snake {
  private readonly arr: number[] = [];

  constructor(initalIndices: number[]) {
    initalIndices.forEach((index) => this.arr.push(index));
  }

  get currentHeadIndex() {
    return this.arr[0];
  }

  get currentTailIndex() {
    return this.arr[this.arr.length - 1];
  }

  get length() {
    return this.arr.length;
  }

  nextHeadIndex(direction: Direction, width: number, height: number): number {
    switch (direction) {
      case Direction.RIGHT:
        const onRightEnd = (this.currentHeadIndex + 1) % width === 0;
        return onRightEnd ? this.currentHeadIndex - width + 1 : this.currentHeadIndex + 1;
      case Direction.LEFT:
        const onLeftEnd = this.currentHeadIndex % width === 0;
        return onLeftEnd ? this.currentHeadIndex + width - 1 : this.currentHeadIndex - 1;
      case Direction.UP:
        const onTop = this.currentHeadIndex < width;
        return onTop ? this.currentHeadIndex + width * (height - 1) : this.currentHeadIndex - width;
      case Direction.DOWN:
        return (this.currentHeadIndex + width) % (width * height);
    }
  }

  move(ateCandy: boolean, newHeadIndex: number): void {
    if (!ateCandy) this.arr.pop();
    this.arr.unshift(newHeadIndex);
  }

  occupiesBoardIndex(index: number): boolean {
    return this.arr.slice(0, this.arr.length -1).includes(index);
  }

  movementDirection(width: number, height: number): Direction {
    const first = this.arr[0];
    const second = this.arr[1];
    const { row: firstRow, column: firstColumn } = this.convertToRowColumn({ index: first, width });
    const { row: secondRow, column: secondColumn } = this.convertToRowColumn({ index: second, width });

    const lastRow = height - 1;
    const lastColumn = width - 1;

    if (firstColumn === lastColumn && secondColumn === 0) return Direction.LEFT;
    if (firstColumn === 0 && secondColumn === lastColumn) return Direction.RIGHT;
    if (firstRow === 0 && secondRow === lastRow) return Direction.DOWN;
    if (firstRow === lastRow && secondRow === 0) return Direction.UP;

    if (firstRow > secondRow) return Direction.DOWN;
    if (firstRow < secondRow) return Direction.UP;
    if (firstColumn > secondColumn) return Direction.RIGHT;
    if (firstColumn < secondColumn) return Direction.LEFT;

    throw new Error('This should not happen!')
  }

  invertedMovementDirection(width: number, height: number): Direction {
    const direction = this.movementDirection(width, height);
    console.log(direction);
    switch (direction) {
      case Direction.LEFT: return Direction.RIGHT;
      case Direction.RIGHT: return Direction.LEFT;
      case Direction.UP: return Direction.DOWN;
      case Direction.DOWN: return Direction.UP;
    }
  }

  convertToRowColumn({ index, width }: { index: number, width: number }): { row: number, column: number } {
    const row = Math.floor(index / width);
    const column = index % width;
    return { row, column };
  }
}

export enum Result {
  MOVED = 'MOVED',
  ATE = 'ATE',
  COLLIDED = 'COLLIDED',
}

export class Board {
  private readonly snake = new Snake([5, 4, 3, 2, 1, 0]);
  private readonly arr: string[];

  constructor(public readonly width: number, public readonly height: number) {
    this.arr = new Array(width * height).fill('');
    this.arr[10] = candy;
  }

  nextTick(direction: Direction): Result {
    const oldTailIndex = this.snake.currentTailIndex;
    const oldHeadindex = this.snake.currentHeadIndex;
    const newHeadIndex = this.snake.nextHeadIndex(direction, this.width, this.height);

    if (this.snake.occupiesBoardIndex(newHeadIndex)) return Result.COLLIDED;

    const ateCandy = this.arr[newHeadIndex] === candy;

    this.snake.move(ateCandy, newHeadIndex);

    this.arr[newHeadIndex] = `snake from-${this.snake.invertedMovementDirection(this.width, this.height).toLowerCase()} head`;
    const oldHeadClasses = this.arr[oldHeadindex].split(' ');
    this.arr[oldHeadindex] = oldHeadClasses.slice(0, oldHeadClasses.length - 1).join(' ') + ` to-${direction.toLowerCase()}`;
    if (!ateCandy && oldTailIndex !== newHeadIndex) this.arr[oldTailIndex] = "";

    if (ateCandy) {
      const freeIndices = this.arr.map((item, index) => {
        if (item) return null;
        return index;
      }).filter((item) => item);
      const number = Math.floor(Math.random() * freeIndices.length);
      const candyIndex = freeIndices[number];
      this.arr[candyIndex] = candy;
    } else {
      // snake from-left to-right
      // snake to-right
      // Remove from-xxx class from tail
      const newTailIndex = this.snake.currentTailIndex;
      const old = this.arr[newTailIndex].split(' ');
      this.arr[newTailIndex] = `snake tail ${old[old.length - 1]}`;
    }

    if (ateCandy) return Result.ATE;
    return Result.MOVED;
  };

  serialize() : string[] {
    return [...this.arr];
  }

  allowedMovementDirections() : Direction[] {
    const allDirections = Object.values(Direction);
    if (this.snake.length < 2) return allDirections;

    const invertedMovementDirection = this.snake.invertedMovementDirection(this.width, this.height);
    return allDirections.filter((d) => d !== invertedMovementDirection);
  }
}
