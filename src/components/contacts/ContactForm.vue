<template>
  <div>
    <form action="">
      <b-field horizontal label="Name">
        <b-input name="first-name" placeholder="First Name" v-model="contact.first_name" expanded></b-input>
        <b-input name="last-name" placeholder="Last Name" v-model="contact.last_name" expanded></b-input>
      </b-field>

      <b-field horizontal label="Date of Birth">
        <b-datepicker
            placeholder="Click to select..."
            icon="calendar"
            v-model="date"
            v-bind:max-date="maxDate"
            grouped>
        </b-datepicker>
      </b-field>
      <hr>
      <!-- Email Addresses Section -->
      <multiple-email-field :contactId="contact.id" :emailList="contact.emails"/>
      <hr>
      <!-- Phone Numbers Section -->
      <multiple-phone-field :contactId="contact.id" :phoneList="contact.phone_numbers"/>
      <hr>
      <!-- Addresses Section -->
      <multiple-address-field :contactId="contact.id" :addressList="contact.addresses"/>
    </form>
    <b-loading :is-full-page="false" :active.sync="isLoading" :can-cancel="true"></b-loading>
  </div>
</template>

<script>
import MultipleEmailField from '@/components/base/MultipleEmailField.vue';
import MultiplePhoneField from '@/components/base/MultiplePhoneField.vue';
import MultipleAddressField from '@/components/base/MultipleAddressField.vue';

export default {
  name: 'ContactForm',
  components: { MultipleAddressField, MultiplePhoneField, MultipleEmailField },
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
    const today = new Date();
    return {
      isLoading: false,
      date: new Date(this.contact.date_of_birth),
      maxDate: today,
      addresses: this.contact.addresses.map(address => ({
        address: address.address,
        city: address.city,
        state: address.state,
        country: address.country,
        zipCode: address.zip_code,
        isNew: false,
        wasChanged: false,
        isSaving: false,
        isDeleting: false,
      })),
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
  },
};
</script>
