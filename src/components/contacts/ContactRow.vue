<template>
  <div class="contact level is-mobile" @click="click" title="Contact details">
    <div class="contact__image level-right">
      <v-gravatar :email="contact.emails[0]" default-img="identicon"/>
    </div>
    <div class="contact__info level-item is-size-5 is-size-6-mobile has-text-weight-semibold">
      {{ contact.first_name + ' ' + contact.last_name }}
    </div>
    <div class="contact__actions level-right"><i class="fas fa-eye"></i></div>
  </div>
</template>

<script>
export default {
  name: 'ContactRow',
  props: {
    contact: {
      id: Number,
      first_name: String,
      last_name: String,
      emails: Array,
    },
  },
  data() {
    return {
      profile_image: 'https://coswafe.com/img/static/blank.png',
    };
  },
  methods: {
    click(event) {
      this.$emit('click', event);
    },
  },
};
</script>

<style lang="scss" scoped>
.contact {
  border-bottom: 1px solid #ccc;
  padding: 10px 15px;
  margin-bottom: 0;
  cursor: pointer;

  @include transition($duration: 0.2s);

  &:hover {
    background-color: #eee;
  }
}

.contact__image img {
  margin: 0 auto;
  border-radius: 50%;
  overflow: hidden;
  max-width: 40px;
  max-height: 40px;
}

.contact__info {
  margin: 0 20px;
  justify-content: start;
}
</style>
