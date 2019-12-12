<template>
  <div id="app">
    <Header />
    <router-view />
  </div>
</template>

<script>
import Header from '@/components/layout/Header.vue';

export default {
  name: 'app',
  components: {
    Header,
  },
};
</script>

<style lang="scss">
#app {
  font-family: $font_family;
  text-align: center;
  color: $black;
}

img {
  max-width: 100%;
}
</style>
