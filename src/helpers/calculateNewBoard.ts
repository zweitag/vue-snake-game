export const calculateNewBoard = (oldBoard, direction, width, height) => {
  let headPosition = oldBoard.findIndex((item) => item === "🐍");
  if (headPosition < 0) headPosition = 0;

  const length = width * height;
  let newHeadPosition;
  switch (direction) {
    case "RIGHT":
      const onRightEnd = (headPosition + 1) % width === 0;
      newHeadPosition = onRightEnd ? headPosition - width + 1 : headPosition + 1;
      break;
    case "LEFT":
      const onLeftEnd = headPosition % width === 0;
      newHeadPosition = onLeftEnd ? headPosition + width - 1 : headPosition - 1;
      break;
    case "UP":
      const onTop = headPosition < width;
      newHeadPosition = onTop ? headPosition + width * (height - 1) : headPosition - width;
      break;
    case "DOWN":
      const onBottom = headPosition > (width * (height -1));
      newHeadPosition = (headPosition + width) % length;
      break;
  }

  const newArray = [...oldBoard];
  newArray[headPosition] = "";
  newArray[newHeadPosition] = "🐍";

  return newArray;
};
