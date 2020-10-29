<template>
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
    const boardArray = ref(new Array(props.width * props.height).fill(false));
    const direction = ref("RIGHT");
    const directions = ["RIGHT", "LEFT", "UP", "DOWN"];
    const changeDirection = (d) => { direction.value = d };

    const updateBoard = () => {
      const newBoard = calculateNewBoard(boardArray.value, direction.value, props.width, props.height);
      boardArray.value = newBoard;
    };

    const handle = setInterval(updateBoard, 1000.0 / props.fps);
    onBeforeUnmount(() => clearInterval(handle));

    return {
      boardArray,
      direction,
      directions,
      changeDirection,
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
</style>
