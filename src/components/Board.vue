<template>
  <input @keyup="handleKeypress">dummy</input>
  <div class="grid-container">
    <div class="grid-item" v-for="item in boardArray">
      {{ item }}
    </div>
  </div>
  <button @click="changeDirection(d)" v-for="d in directions">
    Move {{ d.toLowerCase() }}
  </button>
  <div>Movement direction: {{ direction }}</div>
</template>

<script lang="ts">
import { onBeforeUnmount, ref } from 'vue';
import { calculateNewBoard } from '../helpers/calculateNewBoard';

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
    const direction = ref("RIGHT");
    const directions = ["RIGHT", "LEFT", "UP", "DOWN"];
    const changeDirection = (d) => { direction.value = d };

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

<style scoped>
.grid-container {
  display: grid;
  /* TODO: Use props.width instead of 10 */
  grid-template-columns: repeat(7, 50px);
}

.grid-item {
  height: 50px;
  background-color: lightgray;
}
</style>
