<template>
  <div class="grid-container" :tabindex="-1" @keydown="handleKeypress">
    <div class="grid-item" v-for="(item, index) in boardArray" :key="index">
      {{ item || "" }}
    </div>
  </div>
  <button @click="tryChangeDirection(d)" v-for="d in directions" :key="d">
    Move {{ d.toLowerCase() }}
  </button>
  <div>Movement direction: {{ direction }}</div>
</template>

<script lang="ts">
import { onBeforeUnmount, ref } from 'vue';
import { useDirection } from '../composables/useDirection';
import { Board, Result } from '../Board';
import { Direction } from '../helpers/calculateNewBoard';

export default {
  name: 'Board',
  props: {
    width: {
      type: Number,
      default: 10,
    },
    height: {
      type: Number,
      default: 8,
    },
    fps: {
      type: Number,
      default: 3,
    },
  },
  setup(props) {
    const board = new Board(props.width, props.height);

    const candy = "🍬";
    const boardArray = ref(board.serialize());

    const { direction, directions, changeDirection } = useDirection();

    const updateBoard = () => {
      const result = board.nextTick(direction.value);

      switch (result) {
        case Result.COLLIDED:
          clearInterval(handle);
          alert("Game Over!");
          break;
        case Result.ATE:
        case Result.MOVED:
          boardArray.value = board.serialize();
          break;
      }
    };

    const handle = setInterval(updateBoard, 1000.0 / props.fps);
    onBeforeUnmount(() => clearInterval(handle));

    const tryChangeDirection = (newDirection: Direction): void => {
      const allowed = board.allowedMovementDirections();
      if (allowed.includes(newDirection)) changeDirection(newDirection);
    }

    const handleKeypress = ({ key }) => {
      let mapping = {
        "ArrowUp": Direction.UP,
        "ArrowDown": Direction.DOWN,
        "ArrowLeft": Direction.LEFT,
        "ArrowRight": Direction.RIGHT,
      };
      const mapped = mapping[key];
      if (!mapped) return;
      tryChangeDirection(mapped);
    };
    // window.addEventListener("keydown", handleKeypress);

    return {
      boardArray,
      direction,
      directions,
      changeDirection,
      handleKeypress,
    };
  },
};
</script>

<style scoped vars="{ width }">
.grid-container {
  display: grid;
  grid-template-columns: repeat(var(--width), 50px);
}

.grid-item {
  width: 50px;
  height: 50px;
  background-color: lightgray;
}
</style>
