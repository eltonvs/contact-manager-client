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
      <label class="label">Phone Numbers</label>
      <b-field
          grouped
          v-for="(phone, index) in phoneNumbers"
          v-bind:key="'phone_input' + index">
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

      <hr>

      <!-- Addresses Section -->
      <label class="label">Addresses</label>
      <section class="tile is-vertical notification"
               v-for="(address, index) in addresses"
               v-bind:key="'address_input' + index">
        <b-field label="Address" expanded horizontal>
          <b-input
              placeholder="Address"
              type="text"
              :disabled="address.isLoading || address.isSaving"
              v-model="address.address"
              v-on:input="onAddressChanged(address, index)">
          </b-input>
        </b-field>
        <b-field label="City" expanded horizontal>
          <b-input
              placeholder="City"
              type="text"
              :disabled="address.isLoading || address.isSaving"
              v-model="address.city"
              v-on:input="onAddressChanged(address, index)">
          </b-input>
        </b-field>
        <b-field label="State" expanded horizontal>
          <b-input
              placeholder="State"
              type="text"
              :disabled="address.isLoading || address.isSaving"
              v-model="address.state"
              v-on:input="onAddressChanged(address, index)">
          </b-input>
        </b-field>
        <b-field label="Country" expanded horizontal>
          <b-input
              placeholder="Country"
              type="text"
              :disabled="address.isLoading || address.isSaving"
              v-model="address.country"
              v-on:input="onAddressChanged(address, index)">
          </b-input>
        </b-field>
        <b-field label="Zip Code" expanded horizontal>
          <b-input
              required
              placeholder="Zip Code"
              type="text"
              :disabled="address.isLoading || address.isSaving"
              v-model="address.zipCode"
              v-on:input="onAddressChanged(address, index)">
          </b-input>
        </b-field>
        <div class="action-buttons has-text-right">
          <button
              class="button is-danger"
              v-bind:class="{'is-loading' : address.isDeleting}"
              @click.prevent="removeAddress(address, index)">
            <i class="fas fa-times squared"></i>&nbsp; Remove Address
          </button>
          <button
              class="button is-primary"
              v-bind:class="{'is-loading' : address.isSaving}"
              @click.prevent="sendAddress(address, index)"
              v-bind:disabled="!canSaveAddress(address)">
            <i class="fas fa-check squared"></i>&nbsp; Save Address
          </button>
        </div>
      </section>
      <button
          class="button"
          v-bind:disabled="!canAddAddress()"
          @click.prevent="addAddress">
        Add address &nbsp;<i class="fas fa-plus"></i>
      </button>

    </form>
    <b-loading :is-full-page="false" :active.sync="isLoading" :can-cancel="true"></b-loading>
  </div>
</template>

<script>
import MultipleEmailField from '@/components/base/MultipleEmailField.vue';

export default {
  name: 'ContactForm',
  components: { MultipleEmailField },
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
      return this.phoneNumbers.filter(p => !p.isNew).length > 1 || phone.isNew;
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
    // Address related methods
    canAddAddress() {
      return this.addresses.filter(a => a.isNew).length === 0;
    },
    addAddress() {
      const emptyAddress = {
        address: '',
        city: '',
        state: '',
        country: '',
        zipCode: '',
        isNew: true,
        wasChanged: false,
        isSaving: false,
        isDeleting: false,
      };
      this.addresses.push(emptyAddress);
    },
    canSaveAddress: address =>
      address.address &&
      address.city &&
      address.state &&
      address.country &&
      address.zipCode &&
      (address.isNew || address.wasChanged),
    removeAddress(address, index) {
      const myAddress = address;
      const addressId = this.contact.addresses[index].id;
      if (address.isNew) {
        // Just delete from UI
        this.$delete(this.addresses, index);
      } else if (addressId) {
        myAddress.isDeleting = true;
        const url = `contacts/${this.contact.id}/addresses/${addressId}`;
        this.$http.delete(url).then(
          () => {
            myAddress.isDeleting = false;
            this.$delete(this.addresses, index);
            this.$delete(this.contact.addresses, index);
          },
          () => {
            myAddress.isDeleting = false;
            this.showErrorMessage('This address cannot be deleted!');
          },
        );
      }
    },
    onAddressChanged(address, index) {
      const newAddress = address;
      const oldAddress = this.contact.addresses[index];
      newAddress.wasChanged =
        newAddress.address !== oldAddress.address ||
        newAddress.city !== oldAddress.city ||
        newAddress.state !== oldAddress.state ||
        newAddress.country !== oldAddress.country ||
        newAddress.zipCode !== oldAddress.zipCode;
    },
    sendAddress(address, index) {
      if (!this.canSaveAddress(address)) {
        return;
      }
      const myAddress = address;
      const addressObj = {
        address: myAddress.address,
        city: myAddress.city,
        state: myAddress.state,
        country: myAddress.country,
        zip_code: myAddress.zipCode,
      };
      myAddress.isSaving = true;
      if (myAddress.isNew) {
        const url = `contacts/${this.contact.id}/addresses`;
        this.$http.post(url, addressObj).then(
          (response) => {
            myAddress.isSaving = false;
            myAddress.isNew = false;
            myAddress.wasChanged = false;
            this.contact.addresses.push(response.body);
          },
          () => {
            myAddress.isSaving = false;
            this.showErrorMessage('This address cannot be saved.');
          },
        );
      } else {
        const url = `contacts/${this.contact.id}/addresses/${
          this.contact.addresses[index].id
        }`;
        this.$http.put(url, addressObj).then(
          (response) => {
            myAddress.isSaving = false;
            myAddress.isNew = false;
            myAddress.wasChanged = false;
            this.contact.addresses[index] = response.body;
          },
          () => {
            myAddress.isSaving = false;
            this.showErrorMessage('This address cannot be updated.');
          },
        );
      }
    },
  },
};
</script>
