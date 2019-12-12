<template>
  <nav
    class="navbar is-dark is-fixed-top"
    role="navigation"
    aria-label="dropdown navigation"
  >
    <div class="container">
      <div class="navbar-brand">
        <router-link class="navbar-item not-affect" to="/">
          Contact Manager
        </router-link>
        <div
          class="navbar-burger burger"
          v-on:click="showNav = !showNav"
          :class="{ 'is-active': showNav }"
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <div class="navbar-menu" :class="{ 'is-active': showNav }">
        <div class="navbar-end">
          <router-link class="navbar-item" to="/about">About</router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Header',
  data() {
    return {
      showNav: false,
    };
  },
};
</script>

<style lang="scss" scoped>
.navbar {
  background-color: $primary-color;
}
</style>
