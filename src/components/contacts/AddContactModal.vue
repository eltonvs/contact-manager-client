<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">Add new Contact</p>
      <button
          class="button is-pulled-right"
          aria-label="Cancel"
          v-if="!isFilled"
          @click="cancel">
        Cancel
      </button>
      <button
          class="button is-primary is-pulled-right"
          aria-label="Edit profile"
          v-bind:class="{'is-loading' : isSaving}"
          v-if="isFilled"
          :disabled="!isValid"
          @click="saveForm">
        Save
      </button>
    </header>
    <section class="modal-card-body">
      <form @keydown.enter.prevent="">
        <b-field horizontal label="Name">
          <b-input name="first-name" placeholder="First Name" v-model="contact.firstName" expanded></b-input>
          <b-input name="last-name" placeholder="Last Name" v-model="contact.lastName" expanded></b-input>
        </b-field>

        <b-field horizontal label="Date of Birth">
          <b-datepicker
              grouped
              placeholder="Click to select..."
              icon="calendar"
              v-model="contact.dateOfBirth"
              :max-date="maxDate">
          </b-datepicker>
        </b-field>
        <hr>
        <!-- Email Addresses Section -->
        <multiple-email-field v-model="contact.emails" :isUpdating="false"/>
        <hr>
        <!-- Phone Numbers Section -->
        <multiple-phone-field v-model="contact.phone_numbers" :isUpdating="false"/>
        <hr>
        <!-- Addresses Section -->
        <multiple-address-field v-model="contact.addresses" :isUpdating="false"/>
      </form>
      <b-loading :is-full-page="false" :active.sync="isSaving" :can-cancel="true"></b-loading>
    </section>
  </div>
</template>

<script>
import MultipleEmailField from '@/components/base/MultipleEmailField.vue';
import MultiplePhoneField from '@/components/base/MultiplePhoneField.vue';
import MultipleAddressField from '@/components/base/MultipleAddressField.vue';

export default {
  name: 'AddContactModal',
  components: { MultipleEmailField, MultiplePhoneField, MultipleAddressField },
  data() {
    const today = new Date();
    return {
      contact: {
        firstName: '',
        lastName: '',
        dateOfBirth: null,
        phone_numbers: [''],
        emails: [''],
        addresses: [],
      },
      maxDate: today,
      isFilled: false,
      isSaving: false,
      isValid: false,
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
    cancel() {
      this.$parent.close();
    },
    saveForm() {
      this.isSaving = true;
      const contactObj = {
        first_name: this.contact.firstName,
        last_name: this.contact.lastName,
        date_of_birth: this.dateToString(this.contact.dateOfBirth),
        phone_numbers: this.contact.phone_numbers,
        emails: this.contact.emails,
        addresses: this.contact.addresses,
      };
      console.log(contactObj);
      this.$http
        .post(`contacts/`, JSON.stringify(contactObj), {
          headers: { 'Content-Type': 'application/json' },
        })
        .then(
          () => {
            this.isSaving = false;
            this.$emit('success');
            this.$parent.close();
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
    validateEmail: email => {
      const re = /\S+@\S+\.\S+/;
      return email !== '' && re.test(email);
    },
    validateName: name => name.length > 1,
    validateBirthDate(birthDate) {
      return birthDate !== null && birthDate < this.maxDate;
    },
    validateAddress: address =>
      address.address !== '' &&
      address.city !== '' &&
      address.state !== '' &&
      address.country !== '' &&
      address.zip_code !== '',
  },
  watch: {
    contact: {
      handler(val) {
        this.isFilled =
          val.firstName !== '' ||
          val.lastName !== '' ||
          val.dateOfBirth !== null ||
          val.phone_numbers.length > 0 ||
          val.emails.length > 0 ||
          val.addresses.length > 0;
        this.isValid =
          this.isFilled &&
          this.validateName(val.firstName) &&
          this.validateName(val.lastName) &&
          this.validateBirthDate(val.dateOfBirth) &&
          val.phone_numbers.length > 0 &&
          val.phone_numbers.every(p => p.length > 4) &&
          val.emails.length > 0 &&
          val.emails.every(this.validateEmail) &&
          val.addresses.every(this.validateAddress);
      },
      deep: true,
    },
  },
};
</script>
