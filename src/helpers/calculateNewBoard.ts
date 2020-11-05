let snake = [5];

export const calculateNewBoard = (oldBoard, direction, width, height) => {
  let oldHeadPosition = snake[0]

  const length = width * height;
  let newHeadPosition;
  switch (direction) {
    case "RIGHT":
      const onRightEnd = (oldHeadPosition + 1) % width === 0;
      newHeadPosition = onRightEnd ? oldHeadPosition - width + 1 : oldHeadPosition + 1;
      break;
    case "LEFT":
      const onLeftEnd = oldHeadPosition % width === 0;
      newHeadPosition = onLeftEnd ? oldHeadPosition + width - 1 : oldHeadPosition - 1;
      break;
    case "UP":
      const onTop = oldHeadPosition < width;
      newHeadPosition = onTop ? oldHeadPosition + width * (height - 1) : oldHeadPosition - width;
      break;
    case "DOWN":
      const onBottom = oldHeadPosition > (width * (height -1));
      newHeadPosition = (oldHeadPosition + width) % length;
      break;
  }

  const ateCandy = oldBoard[newHeadPosition] === "🍬";
  const newBoard = [...oldBoard];

  const oldTailPosition = snake[snake.length - 1];


  // Board aktualisieren
  newBoard[newHeadPosition] = "🐍";
  if (!ateCandy) newBoard[oldTailPosition] = "";

  if (ateCandy) {
    snake.unshift(newHeadPosition)
  } else {
    snake.pop();
    snake.unshift(newHeadPosition);
  }

  return newBoard;
};
