<template>
  <div class="grid-container" :tabindex="-1" @keydown.prevent="handleKeypress">
    <div class="grid-item" :class="item" v-for="(item, index) in boardArray" :key="index">
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
* {
  box-sizing: border-box;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(var(--width), 50px);
  border: 1px solid black;
  width: max-content;
  margin: 0 auto;
}

.grid-item {
  width: 50px;
  height: 50px;
}

.candy:before {
  content: '🍬';
}

.snake {
  background: lightblue content-box;
}

.head.from-left {
  border-radius: 0 30px 30px 0;
  padding: 5px 0;
}

.head.from-up {
  border-radius: 0 0 30px 30px;
  padding: 0px 5px;
}

.head.from-right {
  border-radius: 30px 0 0 30px;
  padding: 5px 0px;
}

.head.from-down {
  border-radius: 30px 30px 0 0;
  padding: 0 5px;
}

.from-left.to-right,
.from-right.to-left {
  padding: 5px 0;
}

.from-down.to-up,
.from-up.to-down {
  padding: 0 5px;
}

.from-left.to-down,
.from-down.to-left {
  border-top-right-radius: 30px;
  padding: 5px 5px 0 0;
}

.from-left.to-up,
.from-up.to-left {
  border-bottom-right-radius: 30px;
  padding:0 5px 5px 0;
}

.from-right.to-up,
.from-up.to-right {
  border-bottom-left-radius: 30px;
  padding: 0 0 5px 5px;
}

.from-right.to-down,
.from-down.to-right {
  border-top-left-radius: 30px;
  padding: 5px 0 0 5px;
}
</style>
