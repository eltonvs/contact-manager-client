<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">
        {{ isEditing ? 'Edit Contact' : 'Contact Details' }}
      </p>
      <button
        class="button is-primary is-pulled-right"
        aria-label="Edit profile"
        v-bind:class="{ 'is-loading': isSaving }"
        @click="saveForm"
        v-if="isEditing && wasChanged"
      >
        Save
      </button>
      <button
        class="button is-pulled-right"
        aria-label="Cancel"
        @click="isEditing = !isEditing"
        v-if="isEditing && !wasChanged"
      >
        Back
      </button>
      <button
        class="button is-pulled-right"
        title="Edit Profile"
        aria-label="Edit profile"
        v-if="!isEditing"
        @click="isEditing = !isEditing"
      >
        <i class="fas fa-pencil-alt"></i>
      </button>
    </header>
    <section class="modal-card-body">
      <contact-info
        :contact="contact"
        v-if="!isEditing"
        @deleted="contactDeleted"
      />
      <contact-form :contact="contact" v-model="contactInfo" v-if="isEditing" />
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
    const splitDate = this.contact.date_of_birth.split('-');
    const dateOfBirth = new Date();
    dateOfBirth.setFullYear(splitDate[0], splitDate[1] - 1, splitDate[2]);
    return {
      contactInfo: {
        firstName: this.contact.first_name,
        lastName: this.contact.last_name,
        dateOfBirth,
      },
      wasChanged: false,
      isEditing: false,
      isSaving: false,
    };
  },
  methods: {
    showErrorMessage(message) {
      this.$toast.open({
        message,
        duration: 5000,
        position: 'is-bottom',
        type: 'is-danger',
      });
    },
    contactDeleted(event) {
      this.$emit('deleted', event);
      this.$parent.close();
    },
    saveForm() {
      this.isSaving = true;
      const contactObj = {
        first_name: this.contactInfo.firstName,
        last_name: this.contactInfo.lastName,
        date_of_birth: this.dateToString(this.contactInfo.dateOfBirth),
      };
      this.$http.put(`contacts/${this.contact.id}`, contactObj).then(
        response => {
          this.isSaving = false;
          this.contact.first_name = response.body.first_name;
          this.contact.last_name = response.body.last_name;
          this.contact.date_of_birth = response.body.date_of_birth;
          this.wasChanged = false;
          this.isEditing = false;
        },
        () => this.saveError(),
      );
    },
    dateToString: date =>
      new Date(date.getTime() - date.getTimezoneOffset() * 60000)
        .toISOString()
        .split('T')[0],
    saveError() {
      this.isSaving = false;
      this.showErrorMessage('This contact cannot be saved.');
    },
  },
  watch: {
    contactInfo: {
      handler(val) {
        this.wasChanged =
          val.firstName !== this.contact.first_name ||
          val.lastName !== this.contact.last_name ||
          this.dateToString(val.dateOfBirth) !== this.contact.date_of_birth;
      },
      deep: true,
    },
  },
};
</script>

<style lang="scss" scoped></style>
