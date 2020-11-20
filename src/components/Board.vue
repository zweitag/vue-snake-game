<template>
  <div class="container">
    <div v-if="showOverlay" class="overlay">
      <button class="call-to-action" v-if="status === 'INITIALIZED'" @click="start">
        Start Game
      </button>
      <div v-if="status === 'COLLIDED'">
        Game Over!
        <button class="call-to-action" @click="restart">
          Play again
        </button>
      </div>
    </div>
    <div class="game-board" :tabindex="-1" @keydown.up.left.down.right.prevent="handleKeypress">
      <div class="grid-item" :class="item" v-for="(item, index) in boardArray" :key="index">
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed } from 'vue';
import { useSnakeGame } from '../composables/useSnakeGame';
import { Direction, Status } from '../types';

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
    const { boardArray, changeDirection, start, restart, pause, status } = useSnakeGame({ ...props });

    const handleKeypress = ({ key }) => {
      let mapping = {
        "ArrowUp": Direction.UP,
        "ArrowDown": Direction.DOWN,
        "ArrowLeft": Direction.LEFT,
        "ArrowRight": Direction.RIGHT,
      };
      const mapped = mapping[key];
      changeDirection(mapped);
    };

    const gridSize = 50;

    const showOverlay = computed(() => {
      if (status.value === Status.INITIALIZED) return true;
      if (status.value === Status.COLLIDED) return true;
      return false;
    });

    return {
      boardArray,
      changeDirection,
      handleKeypress,
      showOverlay,
      status,
      start,
      restart,
      // borderRadius: `${Math.round(gridSize / 1.5)}px`,
      borderRadius: '0px',
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

.container {
  position: relative;
}

.overlay {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
}

.game-board {
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

.call-to-action {
  display: inline-block;
  vertical-align: middle;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  max-width: 100%;
  padding: 0.6em 1.2em;
  border: 2px solid hsl(352, 100%, 66%);
  border-radius: 4px;
  background-color: hsl(352, 100%, 66%);;
  color: hsl(192, 1%, 99%);
  font-weight: 600;
  text-align: center;
  color: white;
  cursor: pointer;
  user-select: none;
  appearance: none;
  transition: all .2s ease-in-out;
}

.call-to-action::after {
  position: relative;
  display: inline-block;
  content: '›';
  width: 14px;
  margin-left: 8px;
  transition: transform .2s ease-in-out;
}

.call-to-action:hover,
.call-to-action:active,
.call-to-action:focus {
  border-color: hsl(352, 65%, 51%);
  background-color: hsl(352, 100%, 66%);
  text-decoration: none;
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
