<template>
  <div>
    <form @keydown.enter.prevent="">
      <b-field horizontal label="Name">
        <b-input
          name="first-name"
          placeholder="First Name"
          v-model="contactInfo.firstName"
          expanded
        ></b-input>
        <b-input
          name="last-name"
          placeholder="Last Name"
          v-model="contactInfo.lastName"
          expanded
        ></b-input>
      </b-field>

      <b-field horizontal label="Date of Birth">
        <b-datepicker
          grouped
          editable
          placeholder="Click to select..."
          icon="calendar"
          v-model="contactInfo.dateOfBirth"
          :max-date="maxDate"
        >
        </b-datepicker>
      </b-field>
      <hr />
      <!-- Email Addresses Section -->
      <multiple-email-field
        :contactId="contact.id"
        :emailList="contact.emails"
        @error="onError"
      />
      <hr />
      <!-- Phone Numbers Section -->
      <multiple-phone-field
        :contactId="contact.id"
        :phoneList="contact.phone_numbers"
        @error="onError"
      />
      <hr />
      <!-- Addresses Section -->
      <multiple-address-field
        :contactId="contact.id"
        :addressList="contact.addresses"
        @error="onError"
      />
    </form>
    <b-loading
      :is-full-page="false"
      :active.sync="isLoading"
      :can-cancel="true"
    ></b-loading>
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
    value: {
      firstName: String,
      lastName: String,
      dateOfBirth: Date,
    },
  },
  data() {
    const today = new Date();
    return {
      contactInfo: this.value,
      dateOfBirth: new Date(this.value.date_of_birth),
      isLoading: false,
      maxDate: today,
    };
  },
  methods: {
    onError(event) {
      this.$parent.showErrorMessage(event);
    },
  },
  watch: {
    contactInfo: {
      handler(val) {
        this.$emit('input', val);
      },
      deep: true,
    },
  },
};
</script>
