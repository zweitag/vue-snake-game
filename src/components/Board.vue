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
      default: 30,
    },
  },
  setup(props) {
    const boardArray = ref(new Array(props.width * props.height).fill(false));
    const direction = ref("RIGHT");
    const directions = ["RIGHT", "LEFT", "UP", "DOWN"];
    const changeDirection = (d) => { direction.value = d };

    const updateBoard = () => {
      let index = boardArray.value.findIndex((item) => item);
      if (index < 0) index = 0;

      const newArray = [...boardArray.value];
      newArray[index] = false;
      newArray[(index + 1) % (props.width * props.height)] = true;
      boardArray.value = newArray;
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
  grid-template-columns: repeat(10, 50px);
}
</style>
