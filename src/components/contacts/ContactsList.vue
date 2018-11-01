<template>
  <div id="contacts-list">
    <no-results v-if="contacts.length === 0"/>

    <contact-row
        v-for="contact of contacts"
        v-bind:key="contact.id"
        v-bind:contact="contact"
        @click="showModal(contact)"/>

    <b-modal :active.sync="isModalActive" has-modal-card>
      <ContactModal v-bind:contact="modalProps" @deleted="contactDeleted"/>
    </b-modal>
  </div>
</template>

<script>
import NoResults from '@/components/base/NoResults.vue';
import ContactRow from '@/components/contacts/ContactRow.vue';
import ContactModal from '@/components/contacts/ContactModal.vue';

export default {
  name: 'ContactsList',
  components: {
    NoResults,
    ContactRow,
    ContactModal,
  },
  props: {
    contacts: Array,
  },
  data() {
    return {
      isModalActive: false,
      modalProps: {},
    };
  },
  computed: {
    contactIds() {
      return this.contacts.map(c => c.id);
    },
  },
  methods: {
    showModal(contact) {
      this.modalProps = contact;
      this.isModalActive = true;
    },
    contactDeleted(event) {
      const idx = this.contactIds.indexOf(event);
      this.$delete(this.contacts, idx);
    },
  },
};
</script>

<style lang="scss" scoped>
#contacts-list {
  margin: 30px 0;
}
</style>
