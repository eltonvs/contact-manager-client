<template>
  <form action="">
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Contact Details</p>
      </header>
      <section class="modal-card-body">
        <b-field label="ID">
          <b-input
              type="text"
              :value="id"
              placeholder="Your id"
              required>
          </b-input>
        </b-field>

        <b-field label="First name">
          <b-input
              type="text"
              :value="first_name"
              placeholder="Your id"
              required>
          </b-input>
        </b-field>

        <b-field label="Last name">
          <b-input
              type="text"
              :value="last_name"
              placeholder="Your id"
              required>
          </b-input>
        </b-field>

        <b-field label="Date of Birth">
          <b-input
              type="text"
              :value="date_of_birth"
              placeholder="Your id"
              required>
          </b-input>
        </b-field>

        <b-field label="Phone Number" v-for="phone in phone_numbers" :key="phone">
          <b-input
              type="text"
              :value="phone"
              placeholder="Your id"
              required>
          </b-input>
        </b-field>

        <b-field label="Email" v-for="email in emails" :key="email">
          <b-input
              type="email"
              :value="email"
              placeholder="Your id"
              required>
          </b-input>
        </b-field>
      </section>
      <footer class="modal-card-foot">
        <button class="button" type="button" @click="$parent.close()">Close</button>
        <button class="button is-primary">Update</button>
      </footer>
      <b-loading :is-full-page="false" :active.sync="isLoading" :can-cancel="true"></b-loading>
    </div>
  </form>
</template>

<script>
export default {
  name: 'ContactModal',
  props: {
    id: Number,
    first_name: String,
    last_name: String,
    date_of_birth: String,
    phone_numbers: Array,
    emails: Array,
    addresses: Array,
  },
  data() {
    return {
      isLoading: false,
    };
  },
};
</script>

<style scoped>
</style>
