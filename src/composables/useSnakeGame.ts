import { Ref, ref, readonly, onBeforeUnmount, computed } from "vue";

import { useDirection } from './useDirection';
import { Board, Result } from '../Board';
import { Direction } from '../helpers/calculateNewBoard';

export const useSnakeGame = ({ width, height, fps }) => {
  let handle: NodeJS.Timeout = null;
  let board = new Board(width, height);
  const boardArray = ref(board.serialize());
  const updateInterval = 1000 / fps;

  const start = () => {
    handle = setInterval(updateBoard, updateInterval);
    status.value = Result.MOVED;
  };
  const restart = () => {
    board = new Board(width, height);
    direction.value = Direction.RIGHT;
    boardArray.value = board.serialize();
    start();
  };
  const pause = () => { clearInterval(handle); };

  const status = ref(Result.INITIALIZED);

  const { direction, changeDirection } = useDirection();

  const updateBoard = () => {
    status.value = board.nextTick(direction.value);
    switch (status.value) {
      case Result.COLLIDED:
        clearInterval(handle);
        break;
      case Result.ATE:
      case Result.MOVED:
        boardArray.value = board.serialize();
        break;
    }
  };

  onBeforeUnmount(() => clearInterval(handle));

  const tryChangeDirection = (newDirection: Direction): void => {
    const allowed = board.allowedMovementDirections();
    if (allowed.includes(newDirection)) changeDirection(newDirection);
  }

  return {
    start,
    restart,
    pause,
    changeDirection: (newDirection) => tryChangeDirection(newDirection),
    status: readonly(status),
    boardArray: readonly(boardArray),
  };
};
