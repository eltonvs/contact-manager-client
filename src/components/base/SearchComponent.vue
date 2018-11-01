<template>
  <div id="search-area">
    <b-field>
      <b-input
          expanded
          type="text"
          placeholder="Search by name, email, phone number..."
          v-model="searchString"
          @keydown.native.enter.prevent="performSearch">
      </b-input>
      <p class="control">
        <button class="button is-dark"><i class="fas fa-search"></i></button>
      </p>
    </b-field>
  </div>
</template>

<script>
export default {
  name: 'SearchComponent',
  data() {
    return {
      searchString: '',
    };
  },
  methods: {
    performSearch() {
      this.$emit('search', this.searchString);
    },
  },
};
</script>
