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
  width: 100%;
  height: 100%;
  outline: 0;
  margin: 0 auto;
  border: 1px solid black;
}

.grid-item {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.call-to-action {
  appearance: none;
  display: inline-block;
  overflow: hidden;
  vertical-align: middle;
  max-width: 100%;
  border: 2px solid hsl(352, 100%, 66%);
  border-radius: 4px;
  padding: 0.6em 1.2em;
  font-weight: 600;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: white;
  background-color: hsl(352, 100%, 66%);;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  user-select: none;
}

.call-to-action::after {
  content: '›';
  display: inline-block;
  position: relative;
  width: 14px;
  margin-left: 8px;
  transition: transform 0.2s ease-in-out;
}

.call-to-action:hover,
.call-to-action:active,
.call-to-action:focus {
  border-color: hsl(352, 65%, 51%);
  text-decoration: none;
  background-color: hsl(352, 100%, 66%);
}

  content: '🍬';
.candy::before {
}

.snake {
  background-size: cover;
}

.tail.to-left {
  transform: rotate(180deg);
  background-image: url('/snake/HeadTail.svg');
}

.tail.to-up {
  transform: rotate(270deg);
  background-image: url('/snake/HeadTail.svg');
}

.tail.to-right {
  transform: rotate(0deg);
  background-image: url('/snake/HeadTail.svg');
}

.tail.to-down {
  transform: rotate(90deg);
  background-image: url('/snake/HeadTail.svg');
}

.head.from-left {
  transform: rotate(180deg);
  background-image: url('/snake/HeadTail.svg');
}

.head.from-up {
  transform: rotate(270deg);
  background-image: url('/snake/HeadTail.svg');
}

.head.from-right {
  background-image: url('/snake/HeadTail.svg');
}

.head.from-down {
  transform: rotate(90deg);
  background-image: url('/snake/HeadTail.svg');
}

.from-left.to-right,
.from-right.to-left {
  transform: rotate(90deg);
  background-image: url('/snake/Middle.svg');
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
  transform: rotate(90deg);
  background-image: url('/snake/Curve.svg');
}

.from-right.to-up,
.from-up.to-right {
  transform: rotate(180deg);
  background-image: url('/snake/Curve.svg');
}

.from-right.to-down,
.from-down.to-right {
  transform: rotate(270deg);
  background-image: url('/snake/Curve.svg');
}
</style>
