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
      <label class="label">Email Addresses</label>
      <b-field
          grouped
          v-for="(email, index) in emailAddresses"
          v-bind:key="index">
        <b-input
            placeholder="Email Address"
            type="email"
            :disabled="email.isLoading || email.isSaving"
            v-model="email.email"
            v-on:input="onEmailChanged(email, index)"
            expanded>
        </b-input>
        <p class="control action-buttons">
          <button
              class="button is-danger"
              v-bind:class="{'is-loading' : email.isDeleting}"
              :disabled="!canDeleteEmail(email)"
              @click.prevent="removeEmail(email, index)">
            <i class="fas fa-times squared"></i>
          </button>
          <button
              class="button is-primary"
              v-bind:class="{'is-loading' : email.isSaving}"
              @click.prevent="sendEmail(email, index)"
              v-bind:disabled="!canSaveEmail(email)">
            <i class="fas fa-check squared"></i>
          </button>
        </p>
      </b-field>
      <button
          class="button"
          v-bind:disabled="!canAddEmail()"
          @click.prevent="addEmail">
        Add email &nbsp;<i class="fas fa-plus"></i>
      </button>

      <hr>

      <!-- Phone Numbers Section -->
      <label class="label">Phone Numbers</label>
      <b-field
          grouped
          v-for="(phone, index) in phoneNumbers"
          v-bind:key="index">
        <b-input
            placeholder="Phone Number"
            type="tel"
            :disabled="phone.isLoading || phone.isSaving"
            v-model="phone.phone"
            v-on:input="onPhoneChanged(phone, index)"
            expanded>
        </b-input>
        <p class="control action-buttons">
          <button
              class="button is-danger"
              v-bind:class="{'is-loading' : phone.isDeleting}"
              :disabled="!canDeletePhone(phone)"
              @click.prevent="removePhone(phone, index)">
            <i class="fas fa-times squared"></i>
          </button>
          <button
              class="button is-primary"
              v-bind:class="{'is-loading' : phone.isSaving}"
              @click.prevent="sendPhone(phone, index)"
              v-bind:disabled="!canSavePhone(phone)">
            <i class="fas fa-check squared"></i>
          </button>
        </p>
      </b-field>
      <button
          class="button"
          v-bind:disabled="!canAddPhone()"
          @click.prevent="addPhone">
        Add phone &nbsp;<i class="fas fa-plus"></i>
      </button>

    </form>
    <b-loading :is-full-page="false" :active.sync="isLoading" :can-cancel="true"></b-loading>
  </div>
</template>

<script>
export default {
  name: 'ContactForm',
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
      phoneNumbers: this.contact.phone_numbers.map(phone => ({
        phone,
        isNew: false,
        wasChanged: false,
        isSaving: false,
        isDeleting: false,
      })),
      emailAddresses: this.contact.emails.map(email => ({
        email,
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
    // Email related methods
    canAddEmail() {
      return this.emailAddresses.filter(e => e.isNew).length === 0;
    },
    addEmail() {
      const emptyEmail = {
        email: '',
        isNew: true,
        wasChanged: false,
        isSaving: false,
        isDeleting: false,
      };
      this.emailAddresses.push(emptyEmail);
    },
    canDeleteEmail(email) {
      // Has at least 2 saved emails or Is a new and unsaved email
      return (
        this.emailAddresses.filter(e => !e.isNew).length > 1 || email.isNew
      );
    },
    canSaveEmail: email => email.email && (email.isNew || email.wasChanged),
    removeEmail(email, index) {
      const myEmail = email;
      if (email.isNew) {
        // Just delete from UI
        this.$delete(this.emailAddresses, index);
      } else if (this.emailAddresses.filter(e => !e.isNew).length > 1) {
        myEmail.isDeleting = true;
        const url = `contacts/${this.contact.id}/emails/${email.email}`;
        this.$http.delete(url).then(
          () => {
            myEmail.isDeleting = false;
            this.$delete(this.emailAddresses, index);
            this.$delete(this.contact.emails, index);
          },
          () => {
            myEmail.isDeleting = false;
            this.showErrorMessage('This email cannot be deleted!');
          },
        );
      }
    },
    onEmailChanged(email, index) {
      const myEmail = email;
      myEmail.wasChanged = myEmail.email !== this.contact.emails[index];
    },
    sendEmail(email, index) {
      if (!this.canSaveEmail(email)) {
        return;
      }
      const myEmail = email;
      myEmail.isSaving = true;
      if (email.isNew) {
        const url = `contacts/${this.contact.id}/emails`;
        this.$http.post(url, { email: email.email }).then(
          () => {
            myEmail.isSaving = false;
            myEmail.isNew = false;
            myEmail.wasChanged = false;
            this.contact.emails.push(myEmail.email);
          },
          () => {
            myEmail.isSaving = false;
            this.showErrorMessage('This email cannot be saved.');
          },
        );
      } else {
        const url = `contacts/${this.contact.id}/emails/${
          this.contact.emails[index]
        }`;
        this.$http.put(url, { email: email.email }).then(
          () => {
            myEmail.isSaving = false;
            myEmail.isNew = false;
            myEmail.wasChanged = false;
            this.contact.emails[index] = myEmail.email;
          },
          () => {
            myEmail.isSaving = false;
            this.showErrorMessage('This email cannot be updated.');
          },
        );
      }
    },
    // Phone related methods
    canAddPhone() {
      return this.phoneNumbers.filter(p => p.isNew).length === 0;
    },
    addPhone() {
      const emptyPhone = {
        phone: '',
        isNew: true,
        wasChanged: false,
        isSaving: false,
        isDeleting: false,
      };
      this.phoneNumbers.push(emptyPhone);
    },
    canDeletePhone(phone) {
      // Has at least 2 saved phones or Is a new and unsaved phone
      return (
        this.phoneNumbers.filter(p => !p.isNew).length > 1 || phone.isNew
      );
    },
    canSavePhone: phone => phone.phone && (phone.isNew || phone.wasChanged),
    removePhone(phone, index) {
      const myPhone = phone;
      if (phone.isNew) {
        // Just delete from UI
        this.$delete(this.phoneNumbers, index);
      } else if (this.phoneNumbers.filter(p => !p.isNew).length > 1) {
        myPhone.isDeleting = true;
        const url = `contacts/${this.contact.id}/phone_numbers/${phone.phone}`;
        this.$http.delete(url).then(
          () => {
            myPhone.isDeleting = false;
            this.$delete(this.phoneNumbers, index);
            this.$delete(this.contact.phone_numbers, index);
          },
          () => {
            myPhone.isDeleting = false;
            this.showErrorMessage('This phone cannot be deleted!');
          },
        );
      }
    },
    onPhoneChanged(phone, index) {
      const myPhone = phone;
      myPhone.wasChanged = myPhone.phone !== this.contact.phone_numbers[index];
    },
    sendPhone(phone, index) {
      if (!this.canSavePhone(phone)) {
        return;
      }
      const myPhone = phone;
      myPhone.isSaving = true;
      if (phone.isNew) {
        const url = `contacts/${this.contact.id}/phone_numbers`;
        this.$http.post(url, { phone: phone.phone }).then(
          () => {
            myPhone.isSaving = false;
            myPhone.isNew = false;
            myPhone.wasChanged = false;
            this.contact.phone_numbers.push(myPhone.phone);
          },
          () => {
            myPhone.isSaving = false;
            this.showErrorMessage('This phone cannot be saved.');
          },
        );
      } else {
        const url = `contacts/${this.contact.id}/phone_numbers/${
          this.contact.phone_numbers[index]
        }`;
        this.$http.put(url, { phone: phone.phone }).then(
          () => {
            myPhone.isSaving = false;
            myPhone.isNew = false;
            myPhone.wasChanged = false;
            this.contact.phone_numbers[index] = myPhone.phone;
          },
          () => {
            myPhone.isSaving = false;
            this.showErrorMessage('This phone cannot be updated.');
          },
        );
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.action-buttons .button {
  margin-right: 10px;

  &:last-child {
    margin-right: 0;
  }
}

.squared {
  width: 15px;
}
</style>
