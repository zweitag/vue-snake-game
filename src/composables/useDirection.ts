import { readonly, ref } from 'vue';

const allowedNewDirectionsByOldDirection = {
  "LEFT": ["UP", "DOWN"],
  "RIGHT": ["UP", "DOWN"],
  "UP": ["LEFT", "RIGHT"],
  "DOWN": ["LEFT", "RIGHT"],
}

export const useDirection = (startDirection = "RIGHT") => {
  const direction = ref(startDirection);
  const directions = ["RIGHT", "LEFT", "UP", "DOWN"];
  const changeDirection = (newDirection) => {
    const allowedDirections = allowedNewDirectionsByOldDirection[direction.value];
    if (!allowedDirections.includes(newDirection)) return;

    direction.value = newDirection;
  };

  return {
    direction: readonly(direction),
    directions,
    changeDirection,
  }
}
