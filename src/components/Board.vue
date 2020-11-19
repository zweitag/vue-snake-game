<template>
  <div class="grid-container" :tabindex="-1" @keydown.up.left.down.right.prevent="handleKeypress">
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

    const gridSize = 50;

    return {
      boardArray,
      direction,
      directions,
      changeDirection,
      handleKeypress,
      borderRadius: `${Math.round(gridSize / 1.5)}px`,
      padding: `${Math.round(gridSize / 5)}px`,
      gridSize: `${gridSize}px`,
    };
  },
};
</script>

<style scoped vars="{ width, height, borderRadius, padding, gridSize }">
* {
  box-sizing: border-box;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(var(--width), var(--gridSize));
  grid-template-rows: repeat(var(--height), var(--gridSize));
  border: 1px solid black;
  width: max-content;
  margin: 0 auto;
}

.grid-item {
  width: var(--gridSize);
  height: var(--gridSize);
  display: flex;
  justify-content: center;
  align-items: center;
}

.candy:before {
  content: '🍬';
}

.snake {
  background: #008990 content-box;
}


.tail.to-left {
  border-radius: 0 var(--borderRadius) var(--borderRadius) 0;
  padding: var(--padding) 0;
}

.tail.to-up {
  border-radius: 0 0 var(--borderRadius) var(--borderRadius);
  padding: 0px var(--padding);
}

.tail.to-right {
  border-radius: var(--borderRadius) 0 0 var(--borderRadius);
  padding: var(--padding) 0px;
}

.tail.to-down {
  border-radius: var(--borderRadius) var(--borderRadius) 0 0;
  padding: 0 var(--padding);
}

.head.from-left {
  border-radius: 0 var(--borderRadius) var(--borderRadius) 0;
  padding: var(--padding) 0;
}

.head.from-up {
  border-radius: 0 0 var(--borderRadius) var(--borderRadius);
  padding: 0px var(--padding);
}

.head.from-right {
  border-radius: var(--borderRadius) 0 0 var(--borderRadius);
  padding: var(--padding) 0px;
}

.head.from-down {
  border-radius: var(--borderRadius) var(--borderRadius) 0 0;
  padding: 0 var(--padding);
}

.from-left.to-right,
.from-right.to-left {
  padding: var(--padding) 0;
}

.from-down.to-up,
.from-up.to-down {
  padding: 0 var(--padding);
}

.from-left.to-down,
.from-down.to-left {
  border-top-right-radius: var(--borderRadius);
  padding: var(--padding) var(--padding) 0 0;
}

.from-left.to-up,
.from-up.to-left {
  border-bottom-right-radius: var(--borderRadius);
  padding:0 var(--padding) var(--padding) 0;
}

.from-right.to-up,
.from-up.to-right {
  border-bottom-left-radius: var(--borderRadius);
  padding: 0 0 var(--padding) var(--padding);
}

.from-right.to-down,
.from-down.to-right {
  border-top-left-radius: var(--borderRadius);
  padding: var(--padding) 0 0 var(--padding);
}
</style>
