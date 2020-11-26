<template>
  <div class="container">
    <div
      v-if="showOverlay"
      class="overlay"
    >
      <button
        v-if="status === 'INITIALIZED'"
        class="call-to-action"
        @click="onStart"
      >
        Start Game
      </button>
      <div v-if="status === 'COLLIDED'">
        Game Over!
        <button
          class="call-to-action"
          @click="restart"
        >
          Play again
        </button>
      </div>
    </div>
    <div
      ref="containerRef"
      class="game-board"
      :tabindex="-1"
      @keydown.up.left.down.right.prevent="handleKeypress"
    >
      <div
        v-for="(item, index) in boardArray"
        :key="index"
        class="grid-item"
        :class="item"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, ref } from 'vue';
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
      default: 10,
    },
    fps: {
      type: Number,
      default: 3,
    },
  },
  setup(props) {
    const {
      boardArray, changeDirection, start, restart, status,
    } = useSnakeGame({ ...props });

    const handleKeypress = ({ key }) => {
      const mapping = {
        ArrowUp: Direction.UP,
        ArrowDown: Direction.DOWN,
        ArrowLeft: Direction.LEFT,
        ArrowRight: Direction.RIGHT,
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

    const containerRef = ref(null);
    const onStart = () => {
      containerRef.value.focus();
      start();
    };

    return {
      boardArray,
      changeDirection,
      handleKeypress,
      showOverlay,
      status,
      containerRef,
      onStart,
      restart,
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

.container {
  position: relative;
  width: 400px;
  height: 400px;
}

.overlay {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
}

.game-board {
  display: grid;
  grid-template-columns: repeat(var(--width), minmax(0, 1fr));
  grid-template-rows: repeat(var(--height), minmax(0, 1fr));
  border: 1px solid black;
  width: 100%;
  height: 100%;
  margin: 0 auto;
}

.grid-item {
  width: 100%;
  height: 100%;
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
  background-size: cover;
}

.tail.to-left {
  background-image: url('/snake/HeadTail.svg');
  transform: rotate(180deg);
}

.tail.to-up {
  background-image: url('/snake/HeadTail.svg');
  transform: rotate(270deg);
}

.tail.to-right {
  background-image: url('/snake/HeadTail.svg');
  transform: rotate(0deg);
}

.tail.to-down {
  background-image: url('/snake/HeadTail.svg');
  transform: rotate(90deg);
}

.head.from-left {
  background-image: url('/snake/HeadTail.svg');
  transform: rotate(180deg);
}

.head.from-up {
  background-image: url('/snake/HeadTail.svg');
  transform: rotate(270deg);
}

.head.from-right {
  background-image: url('/snake/HeadTail.svg');
}

.head.from-down {
  background-image: url('/snake/HeadTail.svg');
  transform: rotate(90deg);
}

.from-left.to-right,
.from-right.to-left {
  background-image: url('/snake/Middle.svg');
  transform: rotate(90deg);
}

.from-down.to-up,
.from-up.to-down {
  background-image: url('/snake/Middle.svg');
}

.from-left.to-down,
.from-down.to-left {
  background-image: url('/snake/Curve.svg');
}

.from-left.to-up,
.from-up.to-left {
  background-image: url('/snake/Curve.svg');
  transform: rotate(90deg);
}

.from-right.to-up,
.from-up.to-right {
  background-image: url('/snake/Curve.svg');
  transform: rotate(180deg);
}

.from-right.to-down,
.from-down.to-right {
  background-image: url('/snake/Curve.svg');
  transform: rotate(270deg);
}
</style>
