<template>
  <div class="home section">
    <main class="container">
      <b-loading :is-full-page="true" :active.sync="isLoading" :can-cancel="false"></b-loading>
      <div class="columns">
        <section class="column">
          <div id="search-area">
            <b-field>
              <b-input type="text" placeholder="Search by name, email, phone number..." expanded></b-input>
              <p class="control"><button class="button is-dark"><i class="fas fa-search"></i></button></p>
            </b-field>
          </div>
          <div class="add-contact">
            <b-field>
              <p class="control">
                <button class="button is-info is-pulled-right" @click="addNewContact">
                  <i class="fas fa-user-plus"></i>&nbsp; Add new Contact
                </button>
              </p>
            </b-field>
          </div>
          <div class="is-clearfix"></div>
          <contacts-list :contacts="contacts"/>
        </section>
        <aside class="column is-one-third">
          <div id="birthdays-list">
            <h2 class="title"><i class="fas fa-birthday-cake"></i> Birthdays</h2>
            <div class="contact level is-mobile" v-for="i in 10" :key="i">
              <div class="contact__image level-right">
                <img src="https://coswafe.com/img/static/blank.png" alt="Profile picture">
              </div>
              <div class="contact__info level-item is-size-5 is-size-6-mobile has-text-weight-semibold">
                John Doe
              </div>
              <div class="contact__actions level-right"><i class="fas fa-eye"></i></div>
            </div>
          </div>
        </aside>
      </div>
    </main>
    <b-modal :active.sync="isModalActive" has-modal-card>
      <add-contact-modal @success="loadContacts()"></add-contact-modal>
    </b-modal>
  </div>
</template>

<script>
import Header from '@/components/layout/Header.vue';
import ContactsList from '@/components/contacts/ContactsList.vue';
import AddContactModal from '@/components/contacts/AddContactModal.vue';

export default {
  name: 'home',
  components: {
    Header,
    ContactsList,
    AddContactModal,
  },
  data() {
    return {
      contacts: [],
      isLoading: false,
      isModalActive: false,
    };
  },
  methods: {
    loadContacts() {
      this.isLoading = true;
      this.$http.get('contacts').then(
        response => {
          if (response.status === 200) {
            this.contacts = response.body;
          }
          this.isLoading = false;
        },
        () => {
          this.isLoading = false;
        },
      );
    },
    addNewContact() {
      this.isModalActive = true;
    },
  },
  mounted() {
    this.loadContacts();
  },
};
</script>

<style lang="scss" scoped>
.add-contact {
  margin-top: 30px;
}
</style>
