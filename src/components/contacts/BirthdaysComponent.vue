<template>
  <div id="birthdays-list">
    <h2 class="title is-4"><i class="fas fa-birthday-cake"></i> Birthdays of the month</h2>
    <no-results v-if="birthdays.length === 0"/>
    <div class="tile is-parent is-vertical" v-if="birthdays.length > 0">
      <article
          class="tile is-child notification is-dark"
          v-for="(contact, index) in birthdays"
          :key="'birthdays_' + index">
        <div class="content">
          <p class="title is-4">{{ contact.first_name + ' ' + contact.last_name }}</p>
          <p class="subtitle is-6">{{ contact.date_of_birth | formatDate }}</p>
          <div class="content has-text-left">
            <strong>Phone Numbers:</strong>
            <ul>
              <li v-for="phone in contact.phone_numbers" :key="phone">
                <a title='Make a call' :href="'tel:' + phone">{{ phone }}</a> -&nbsp;
                <a target="_blank" title="Send a message on WhatsApp" :href="whatsAppLink(phone)">
                  <i class="fab fa-whatsapp"></i>
                </a>
              </li>
            </ul>
            <strong>Email Addresses:</strong>
            <ul>
              <li v-for="email in contact.emails" :key="email"><a :href="'mailto:' + email">{{ email }}</a></li>
            </ul>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<script>
import NoResults from '@/components/base/NoResults.vue';

export default {
  name: 'BirthdaysComponent',
  components: { NoResults },
  data() {
    return {
      isLoading: false,
      birthdays: [],
    };
  },
  methods: {
    loadBirthdays() {
      this.isLoading = true;
      this.$http.get('contacts/birthdays').then(
        response => {
          this.birthdays = response.body;
          this.isLoading = false;
        },
        () => {
          this.birthdays = [];
          this.isLoading = false;
        },
      );
    },
    whatsAppLink: phone => {
      const filteredPhone = +phone.replace(/\D+/g, '');
      const defaultMessage = encodeURI('Happy Birthday!');
      return `https://wa.me/${filteredPhone}/?text=${defaultMessage}`;
    },
  },
  mounted() {
    this.loadBirthdays();
  },
};
</script>
