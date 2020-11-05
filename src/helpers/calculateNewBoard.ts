enum Direction {
  RIGHT = "RIGHT",
  LEFT = "LEFT",
  UP = "UP",
  DOWN = "DOWN",
}

let snake = [5];
const candy = "🍬";

export const calculateNewBoard = (oldBoard, direction: Direction, width, height) => {
  let oldHeadIndex = snake[0]
  let newHeadIndex = calculateNewHeadPosition(direction, oldHeadIndex, width, height);

  const ateCandy = oldBoard[newHeadIndex] === candy;

  // Update board
  const oldTailPosition = snake[snake.length - 1];
  const newBoard = [...oldBoard];
  newBoard[newHeadIndex] = "🐍";
  if (!ateCandy) newBoard[oldTailPosition] = "";

  // Update snake
  if (!ateCandy) snake.pop();
  snake.unshift(newHeadIndex);

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
