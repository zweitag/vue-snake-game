<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <Board :height="3" :width="7"/>
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
