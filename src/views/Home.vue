<template>
  <div class="home section">
    <main class="container">
      <b-loading
        :is-full-page="true"
        :active.sync="isLoading"
        :can-cancel="false"
      ></b-loading>
      <div class="columns">
        <section class="column">
          <search-component v-model="searchString" @search="searchContacts" />
          <div class="add-contact">
            <b-field>
              <p class="control">
                <button
                  class="button is-info is-pulled-right"
                  @click="addNewContact"
                >
                  <i class="fas fa-user-plus"></i>&nbsp; Add new Contact
                </button>
              </p>
            </b-field>
          </div>
          <div class="add-contact" v-if="isSearchResults">
            <button class="button is-pulled-left" @click="clearSearchResults">
              <i class="fas fa-times"></i>&nbsp; Clear Search Results
            </button>
          </div>
          <div class="is-clearfix"></div>
          <no-results
            message="No contact found"
            v-if="!isLoading && contacts.length === 0"
          />
          <contacts-list :contacts="contacts" v-if="contacts.length > 0" />
        </section>
        <aside class="column is-one-third">
          <birthdays-component :key="birthdaysKey" />
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
import SearchComponent from '@/components/base/SearchComponent.vue';
import NoResults from '@/components/base/NoResults.vue';
import ContactsList from '@/components/contacts/ContactsList.vue';
import AddContactModal from '@/components/contacts/AddContactModal.vue';
import BirthdaysComponent from '@/components/contacts/BirthdaysComponent.vue';

export default {
  name: 'home',
  components: {
    Header,
    SearchComponent,
    NoResults,
    ContactsList,
    AddContactModal,
    BirthdaysComponent,
  },
  data() {
    return {
      contacts: [],
      isLoading: false,
      isModalActive: false,
      isSearchResults: false,
      searchString: '',
      birthdaysKey: 0,
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
    searchContacts() {
      this.isLoading = true;
      const params = { params: { query: this.searchString } };
      this.$http.get('contacts/search', params).then(
        response => {
          if (response.status === 200) {
            this.contacts = response.body;
            this.isSearchResults = true;
          }
          this.isLoading = false;
        },
        () => {
          this.isLoading = false;
          this.contacts = [];
        },
      );
    },
    clearSearchResults() {
      this.searchString = '';
      this.isSearchResults = false;
      this.loadContacts();
    },
  },
  mounted() {
    this.loadContacts();
  },
  watch: {
    contacts: {
      handler() {
        this.birthdaysKey += 1;
      },
      deep: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.add-contact {
  margin-top: 30px;
}
</style>
