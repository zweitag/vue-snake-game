import { Direction } from './helpers/calculateNewBoard';

const candy = "🍬";

class Snake {
  private readonly arr: number[] = [];

  constructor(initialHeadIndex: number) {
    this.arr.push(initialHeadIndex);
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
}

export class Board {
  private readonly snake = new Snake(0);
  private readonly arr: string[];

  constructor(public readonly width: number, public readonly height: number) {
    this.arr = new Array(width * height).fill('');
    this.arr[10] = candy;
  }

  nextTick(direction: Direction): void {
    const oldTailIndex = this.snake.currentTailIndex;
    const newHeadIndex = this.snake.nextHeadIndex(direction, this.width, this.height);

    const ateCandy = this.arr[newHeadIndex] === candy;

    this.snake.move(ateCandy, newHeadIndex);

    this.arr[newHeadIndex] = "🐍";
    if (!ateCandy) this.arr[oldTailIndex] = "";

    if (ateCandy) {
      const freeIndices = this.arr.map((item, index) => {
        if (item) return null;
        return index;
      }).filter((item) => item);
      const number = Math.floor(Math.random() * freeIndices.length);
      const candyIndex = freeIndices[number];
      this.arr[candyIndex] = candy;
    }
  };

  serialize() : string[] {
    return [...this.arr];
  }
}
