<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <Board :height="8" />
</template>

<script>
import Board from './components/Board.vue'

export default {
  name: 'App',
  components: {
    Board
  }
}
</script>
