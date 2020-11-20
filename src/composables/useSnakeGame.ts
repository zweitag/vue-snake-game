import { ref, readonly, onBeforeUnmount } from 'vue';

import { useDirection } from './useDirection';
import { Board } from '../Board';
import { Direction, Status } from '../types';

export const useSnakeGame = ({ width, height, fps }) => {
  let handle: NodeJS.Timeout = null;
  let board = new Board(width, height);
  const boardArray = ref(board.serialize());
  const updateInterval = 1000 / fps;
  const status = ref(Status.INITIALIZED);

  const { direction, changeDirection } = useDirection();

  const updateBoard = () => {
    status.value = board.nextTick(direction.value);
    switch (status.value) {
      case Status.COLLIDED:
        clearInterval(handle);
        return;
      case Status.ATE:
      case Status.MOVED:
        boardArray.value = board.serialize();
        break;
      default:
    }
  };

  const start = () => {
    handle = setInterval(updateBoard, updateInterval);
    status.value = Status.MOVED;
  };
  const restart = () => {
    board = new Board(width, height);
    direction.value = Direction.RIGHT;
    boardArray.value = board.serialize();
    start();
  };
  const pause = () => { clearInterval(handle); };

  onBeforeUnmount(() => clearInterval(handle));

  const tryChangeDirection = (newDirection: Direction): void => {
    const allowed = board.allowedMovementDirections();
    if (allowed.includes(newDirection)) changeDirection(newDirection);
  };

  return {
    start,
    restart,
    pause,
    changeDirection: (newDirection) => tryChangeDirection(newDirection),
    status: readonly(status),
    boardArray: readonly(boardArray),
  };
};
