<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import vueCompositionApi from '@vue/composition-api';
import Vue from 'vue';

Vue.use(vueCompositionApi);

export default {
  name: 'App',
  setup () {
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100vw;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;

}

body {
  margin: 0;
  padding: 0;
}
</style>
