<template>
  <div id="search-area">
    <b-field>
      <b-input
          expanded
          type="text"
          size="is-medium"
          placeholder="Search by name, email, phone number..."
          v-model="searchString"
          @keydown.native.enter.prevent="performSearch">
      </b-input>
      <p class="control">
        <button class="button is-dark is-medium"><i class="fas fa-search"></i></button>
      </p>
    </b-field>
  </div>
</template>

<script>
export default {
  name: 'SearchComponent',
  props: {
    value: String,
  },
  computed: {
    searchString: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },
  },
  methods: {
    performSearch() {
      this.$emit('search', this.searchString);
    },
  },
};
</script>
