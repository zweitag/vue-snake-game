<template>
  <div class="grid-container">
    <div class="grid-item" v-for="(item, index) in boardArray" :key="index">
      {{ item || "x" }}
    </div>
  </div>
  <button @click="changeDirection(d)" v-for="d in directions" :key="d">
    Move {{ d.toLowerCase() }}
  </button>
  <div>Movement direction: {{ direction }}</div>
</template>

<script lang="ts">
import { onBeforeUnmount, ref } from 'vue';
import { calculateNewBoard } from '../helpers/calculateNewBoard';
import { useDirection } from '../composables/useDirection';

export default {
  name: 'Board',
  props: {
    width: {
      type: Number,
      default: 10,
    },
    height: {
      type: Number,
      default: 10,
    },
    fps: {
      type: Number,
      default: 3,
    },
  },
  setup(props) {
    const snake = "🐍";
    const boardArray = ref(new Array(props.width * props.height).fill(''));
    const { direction, directions, changeDirection } = useDirection();

    const updateBoard = () => {
      const newBoard = calculateNewBoard(boardArray.value, direction.value, props.width, props.height);
      boardArray.value = newBoard;
    };

    const handle = setInterval(updateBoard, 1000.0 / props.fps);
    onBeforeUnmount(() => clearInterval(handle));

    const handleKeypress = ({ key }) => {
      let mapping = {
        "ArrowUp": "UP",
        "ArrowDown": "DOWN",
        "ArrowLeft": "LEFT",
        "ArrowRight": "RIGHT",
      };
      changeDirection(mapping[key]);
    };
    window.addEventListener("keydown", handleKeypress);

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
