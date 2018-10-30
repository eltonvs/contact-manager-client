<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">{{ isEditing ? 'Edit Contact' : 'Contact Details' }}</p>
      <button
          class="button is-primary is-pulled-right"
          aria-label="Edit profile"
          v-bind:class="{'is-loading' : isSaving}"
          @click="saveForm"
          v-if="isEditing">
        Save
      </button>
      <button
          class="button is-pulled-right"
          title="Edit Profile"
          aria-label="Edit profile"
          v-if="!isEditing"
          @click="isEditing = !isEditing">
        <i class="fas fa-pencil-alt"></i>
      </button>
    </header>
    <section class="modal-card-body">
      <contact-info v-bind:contact="contact" v-if="!isEditing"/>
      <contact-form v-bind:contact="contact" v-if="isEditing"/>
    </section>
  </div>
</template>

<script>
import ContactInfo from '@/components/contacts/ContactInfo.vue';
import ContactForm from '@/components/contacts/ContactForm.vue';

export default {
  name: 'ContactModal',
  components: { ContactForm, ContactInfo },
  props: {
    contact: {
      id: Number,
      first_name: String,
      last_name: String,
      date_of_birth: String,
      phone_numbers: Array,
      emails: Array,
      addresses: Array,
    },
  },
  data() {
    return {
      isEditing: true,
      isSaving: false,
    };
  },
  methods: {
    saveForm() {
      this.isSaving = true;
      this.isEditing = !this.isEditing;
      this.isSaving = false;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
