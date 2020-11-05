type Board = string[];

enum Direction {
  RIGHT = "RIGHT",
  LEFT = "LEFT",
  UP = "UP",
  DOWN = "DOWN",
}

let snake = [5];
const candy = "🍬";

export const calculateNewBoard = (oldBoard: Board, direction: Direction, width: number, height: number) => {
  const oldHeadIndex = snake[0]
  const oldTailIndex = snake[snake.length - 1];
  const newHeadIndex = calculateNewHeadPosition(direction, oldHeadIndex, width, height);

  const ateCandy = oldBoard[newHeadIndex] === candy;

  // Update snake
  updateSnake(ateCandy, newHeadIndex);

  // Update board
  const newBoard = updateBoard(oldBoard, newHeadIndex, oldTailIndex, ateCandy);

  return newBoard;
};

const calculateNewHeadPosition = (direction: Direction, oldIndex: number, width: number, height: number) => {
  switch (direction) {
    case Direction.RIGHT:
      const onRightEnd = (oldIndex + 1) % width === 0;
      return onRightEnd ? oldIndex - width + 1 : oldIndex + 1;
    case Direction.LEFT:
      const onLeftEnd = oldIndex % width === 0;
      return onLeftEnd ? oldIndex + width - 1 : oldIndex - 1;
    case Direction.UP:
      const onTop = oldIndex < width;
      return onTop ? oldIndex + width * (height - 1) : oldIndex - width;
    case Direction.DOWN:
      return (oldIndex + width) % (width * height);
  }
}

const updateSnake = (ateCandy: boolean, newHeadIndex: number): void => {
  if (!ateCandy) snake.pop();
  snake.unshift(newHeadIndex);
}

const updateBoard = (oldBoard: Board, newHeadIndex: number, oldTailIndex: number, ateCandy: boolean): Board => {
  const newBoard = [...oldBoard];
  newBoard[newHeadIndex] = "🐍";
  if (!ateCandy) newBoard[oldTailIndex] = "";

  if (ateCandy) {
    const freeIndices = newBoard.map((item, index) => {
      if (item) return null;
      return index;
    }).filter((item) => item);
    const number = Math.floor(Math.random() * freeIndices.length);
    const candyIndex = freeIndices[number];
    newBoard[candyIndex] = candy;
  }
  return newBoard;
}
