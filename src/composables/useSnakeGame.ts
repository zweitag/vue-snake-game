import { ref, readonly, onBeforeUnmount, computed } from "vue";

import { useDirection } from './useDirection';
import { Board, Result } from '../Board';
import { Direction } from '../helpers/calculateNewBoard';

export const useSnakeGame = ({ width, height, fps }) => {
  let handle: NodeJS.Timeout = null;
  const updateInterval = 1000 / fps;

  const start = () => {
    handle = setInterval(updateBoard, updateInterval);
  };

  const pause = () => {
    clearInterval(handle);
  };

  const status = ref('MOVING');

  const board = new Board(width, height);

  const boardArray = ref(board.serialize());

  const { direction, changeDirection } = useDirection();

  const updateBoard = () => {
    const result = board.nextTick(direction.value);
    status.value = result;
    switch (result) {
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
    pause,
    changeDirection: (newDirection) => tryChangeDirection(newDirection),
    status: readonly(status),
    boardArray: readonly(boardArray),
  };
};
