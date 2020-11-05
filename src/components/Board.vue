<template>
  <div class="grid-container" :tabindex="-1" @keydown="handleKeypress">
    <div class="grid-item" v-for="(item, index) in boardArray" :key="index">
      {{ item || "" }}
    </div>
  </div>
  <button @click="changeDirection(d)" v-for="d in directions" :key="d">
    Move {{ d.toLowerCase() }}
  </button>
  <div>Movement direction: {{ direction }}</div>
</template>

<script lang="ts">
import { onBeforeUnmount, ref } from 'vue';
import { useDirection } from '../composables/useDirection';
import { Board } from '../Board';

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
      board.nextTick(direction.value);
      boardArray.value = board.serialize();
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
      const mapped = mapping[key];
      if (!mapped) return;
      changeDirection(mapped);
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
