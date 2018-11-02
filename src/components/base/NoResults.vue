<template>
  <div class="section has-text-grey">
    <p class="icon-sad"><i class="far fa-frown"></i></p>
    <p>{{ message }}</p>
  </div>
</template>

<script>
export default {
  name: 'NoResults',
  props: {
    message: {
      type: String,
      default: 'No results',
    },
  },
};
</script>

<style lang="scss" scoped>
.icon-sad {
  font-size: 2.5em;
}
</style>
