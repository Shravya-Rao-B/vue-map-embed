<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import Embedcomp from './views/Embed.vue'
export default {
  components : {
    Embedcomp 
  }
}
</script>

<style>
#app {
  font-family: "Lato", sans-serif;
  font-style: normal;
  background-color: #f5f5f5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-y: hidden;

  /* text-align: center; */
}
</style>
