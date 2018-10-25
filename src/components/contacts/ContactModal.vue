<template>
  <div>
    <div class="modal-card" v-if="!isEditing">
      <header class="modal-card-head">
        <p class="modal-card-title">Contact Details</p>
      </header>
      <section class="modal-card-body">
        <media-item v-bind:title="fullName()" icon="fas fa-user"></media-item>
        <media-item title="Date of Birth" icon="fas fa-birthday-cake">
          <p>{{ contact.date_of_birth | formatDate }}</p>
        </media-item>
        <media-item title="Email Addresses" icon="fas fa-envelope">
          <ul>
            <li v-for="email in contact.emails" v-bind:key="email">
              <a v-bind:href="'mailto:' + email">{{ email }}</a>
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
        <media-item title="Addresses" icon="fas fa-map-marker-alt">
          <media-item v-for="(address, index) in contact.addresses" v-bind:key="index" v-bind:noBorder="index === 0">
            <div class="columns">
              <div class="column">
                {{ formattedAddress(address) }}
              </div>
              <div class="column">
                map
              </div>
            </div>
          </media-item>
        </media-item>
      </section>
      <footer class="modal-card-foot">
        <button class="button" type="button" @click="$parent.close()">Close</button>
        <button class="button is-primary" @click="isEditing = !isEditing">Update</button>
      </footer>
      <b-loading :is-full-page="false" :active.sync="isLoading" :can-cancel="true"></b-loading>
    </div>
    <div class="modal-card" v-if="isEditing">
      <header class="modal-card-head">
        <p class="modal-card-title">Edit Contact</p>
      </header>
      <section class="modal-card-body">
        <form action="">
          <b-field label="ID">
            <b-input
                type="text"
                :value="contact.id"
                placeholder="Your id"
                required>
            </b-input>
          </b-field>

          <b-field label="First name">
            <b-input
                type="text"
                :value="contact.first_name"
                placeholder="Your id"
                required>
            </b-input>
          </b-field>

          <b-field label="Last name">
            <b-input
                type="text"
                :value="contact.last_name"
                placeholder="Your id"
                required>
            </b-input>
          </b-field>

          <b-field label="Date of Birth">
            <b-input
                type="text"
                :value="contact.date_of_birth"
                placeholder="Your id"
                required>
            </b-input>
          </b-field>

          <b-field label="Phone Number" v-for="phone in contact.phone_numbers" :key="phone">
            <b-input
                type="text"
                :value="phone"
                placeholder="Your id"
                required>
            </b-input>
          </b-field>

          <b-field label="Email" v-for="email in contact.emails" :key="email">
            <b-input
                type="email"
                :value="email"
                placeholder="Your id"
                required>
            </b-input>
          </b-field>
        </form>
      </section>
      <footer class="modal-card-foot">
        <button class="button" type="button" @click="$parent.close()">Close</button>
        <button class="button is-primary" @click="isEditing = !isEditing">Update</button>
      </footer>
      <b-loading :is-full-page="false" :active.sync="isLoading" :can-cancel="true"></b-loading>
    </div>
  </div>
</template>

<script>
import MediaItem from '@/components/base/MediaItem.vue';

export default {
  name: 'ContactModal',
  components: { MediaItem },
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
      isEditing: false,
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
  },
};
</script>

<style lang="scss" scoped>
</style>
