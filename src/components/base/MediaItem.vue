<template>
  <section class="media" v-bind:class="{'no-borders' : noBorder}">
    <div class="media-left" v-if="icon">
      <i v-bind:class="icon"></i>
    </div>
    <div class="media-content">
      <div class="content">
        <h3 class="title is-5" v-if="title">{{ title }}</h3>
        <slot/>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'MediaItem',
  props: {
    icon: String,
    title: String,
    noBorder: {
      type: Boolean,
      default() {
        return false;
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.no-borders {
  border: none;
}
</style>
