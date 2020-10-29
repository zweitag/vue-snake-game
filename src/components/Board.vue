<template>
  <div class="grid-container">
    <template class="grid-item" v-for="row in boardArray">
      <div v-for="column in row">
        {{ column }}
      </div>
    </template>
  </div>
  <button @click="onClick">Klick mich!</button>
</template>

<script lang="ts">
import { ref } from 'vue';

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
  },
  setup(props) {
    const boardArray = ref(new Array(props.width).fill(
      new Array(props.height).fill(false)
    ));

    const onClick = () => { boardArray.value = [true, ...boardArray.value] };

    return {
      boardArray,
      onClick,
    };
  },
};
</script>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: repeat(10, 50px);
}

.grid-item {

}
</style>
