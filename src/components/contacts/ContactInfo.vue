<template>
  <div>
    <media-item v-bind:title="fullName()" icon="fas fa-user"></media-item>
    <media-item title="Date of Birth" icon="fas fa-birthday-cake">
      <p>{{ contact.date_of_birth | formatDate }}</p>
    </media-item>
    <media-item title="Email Addresses" icon="fas fa-envelope">
      <ul>
        <li v-for="email in contact.emails" v-bind:key="email">
          <a v-bind:href="'mailto:' + email" v-bind:title="'Send a message to ' + email">{{ email }}</a>
        </li>
      </ul>
    </media-item>
    <media-item title="Phone Numbers" icon="fas fa-phone">
      <ul>
        <li v-for="phone in contact.phone_numbers" v-bind:key="phone">
          <a v-bind:href="'tel:' + phone">{{ phone }}</a>
        </li>
      </ul>
    </media-item>
    <media-item
        title="Addresses"
        icon="fas fa-map-marker-alt"
        v-if="contact && contact.addresses && contact.addresses.length > 0">
      <media-item
          v-for="(address, index) in contact.addresses"
          v-bind:key="'address_item' + index"
          v-bind:noBorder="index === 0">
        <p>
          {{ address.address }} - {{ address.city }}<br/>
          {{ address.state }}, {{ address.country }}<br/>
          {{ address.zip_code }}
        </p>
      </media-item>
      <media-item>
        <map-component :addresses="contact.addresses.map(address => formattedAddress(address))"/>
      </media-item>
    </media-item>
    <media-item>
      <div class="has-text-centered">
        <button class="button is-danger" @click="confirmContactDeletion">Delete Contact</button>
      </div>
    </media-item>
    <b-loading :is-full-page="false" :active.sync="isLoading" :can-cancel="true"></b-loading>
  </div>
</template>

<script>
import MediaItem from '@/components/base/MediaItem.vue';
import MapComponent from '@/components/base/MapComponent.vue';

export default {
  name: 'ContactInfo',
  components: { MediaItem, MapComponent },
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
      isLoading: false,
    };
  },
  methods: {
    fullName() {
      return `${this.contact.first_name} ${this.contact.last_name}`;
    },
    formattedAddress(address) {
      return `${address.address}, ${address.city} - ${address.state},
      ${address.country}. ${address.zip_code}`;
    },
    confirmContactDeletion() {
      this.$dialog.confirm({
        title: 'Deleting contact',
        message:
          'Are you sure you want to <b>delete</b> this contact? This action cannot be undone.',
        confirmText: 'Delete contact',
        type: 'is-danger',
        hasIcon: true,
        onConfirm: this.deleteContact,
      });
    },
    deleteContact() {
      this.isLoading = true;
      const url = `contacts/${this.contact.id}`;
      this.$http.delete(url).then(
        () => {
          this.isLoading = false;
          this.$toast.open('Contact deleted!');
          this.$emit('deleted', this.contact.id);
        },
        () => {
          this.$parent.showErrorMessage('Error while deleting contact.');
        },
      );
    },
  },
};
</script>
