<template>
  <div>
    <label class="label">Addresses</label>
    <section
        class="tile is-vertical notification"
        v-for="(address, index) in addresses"
        :key="'address_input' + index">
      <b-field label="Address" expanded horizontal>
        <b-input
            placeholder="Address"
            type="text"
            v-model="address.address"
            :disabled="address.isLoading || address.isSaving"
            @input="onChanged(address, index)">
        </b-input>
      </b-field>
      <b-field label="City" expanded horizontal>
        <b-input
            placeholder="City"
            type="text"
            v-model="address.city"
            :disabled="address.isLoading || address.isSaving"
            @input="onChanged(address, index)">
        </b-input>
      </b-field>
      <b-field label="State" expanded horizontal>
        <b-input
            placeholder="State"
            type="text"
            v-model="address.state"
            :disabled="address.isLoading || address.isSaving"
            @input="onChanged(address, index)">
        </b-input>
      </b-field>
      <b-field label="Country" expanded horizontal>
        <b-input
            placeholder="Country"
            type="text"
            v-model="address.country"
            :disabled="address.isLoading || address.isSaving"
            @input="onChanged(address, index)">
        </b-input>
      </b-field>
      <b-field label="Zip Code" expanded horizontal>
        <b-input
            required
            placeholder="Zip Code"
            type="text"
            v-model="address.zipCode"
            :disabled="address.isLoading || address.isSaving"
            @input="onChanged(address, index)">
        </b-input>
      </b-field>
      <div class="action-buttons has-text-right">
        <button
            class="button is-danger"
            :class="{'is-loading' : address.isDeleting}"
            @click.prevent="remove(address, index)">
          <i class="fas fa-times squared"></i>&nbsp; Remove Address
        </button>
        <button
            class="button is-primary"
            :class="{'is-loading' : address.isSaving}"
            :disabled="!canSave(address)"
            @click.prevent="save(address, index)">
          <i class="fas fa-check squared"></i>&nbsp; Save Address
        </button>
      </div>
    </section>
    <button
        class="button"
        :disabled="!canAdd()"
        @click.prevent="add">
      Add address &nbsp;<i class="fas fa-plus"></i>
    </button>
  </div>
</template>

<script>
export default {
  name: 'MultipleAddressField',
  props: { contactId: Number, addressList: Array },
  data() {
    return {
      addresses: this.addressList.map(a => this.createAddressObject(a, false)),
    };
  },
  methods: {
    createAddressObject: (address = {}, isNew = true) => ({
      address: address.address || '',
      city: address.city || '',
      state: address.state || '',
      country: address.country || '',
      zipCode: address.zip_code || '',
      isNew,
      wasChanged: false,
      isSaving: false,
      isDeleting: false,
    }),
    canAdd() {
      return this.addresses.filter(a => a.isNew).length === 0;
    },
    add() {
      this.addresses.push(this.createAddressObject());
    },
    canSave: address =>
      address.address &&
      address.city &&
      address.state &&
      address.country &&
      address.zipCode &&
      (address.isNew || address.wasChanged),
    remove(address, index) {
      const myAddress = address;
      const addressId = this.addressList[index].id;
      if (address.isNew) {
        // Just delete from UI
        this.$delete(this.addresses, index);
      } else if (addressId) {
        myAddress.isDeleting = true;
        const url = `contacts/${this.contactId}/addresses/${addressId}`;
        this.$http.delete(url).then(
          () => {
            myAddress.isDeleting = false;
            this.$delete(this.addresses, index);
            this.$delete(this.addressList, index);
          },
          () => {
            myAddress.isDeleting = false;
            this.showErrorMessage('This address cannot be deleted!');
          },
        );
      }
    },
    onChanged(address, index) {
      const newAddress = address;
      const oldAddress = this.addressList[index];
      newAddress.wasChanged =
        oldAddress === undefined ||
        newAddress.address !== oldAddress.address ||
        newAddress.city !== oldAddress.city ||
        newAddress.state !== oldAddress.state ||
        newAddress.country !== oldAddress.country ||
        newAddress.zipCode !== oldAddress.zipCode;
    },
    save(address, index) {
      if (!this.canSave(address)) return;
      const baseUrl = `contacts/${this.contactId}/addresses`;
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
        this.$http.post(baseUrl, addressObj).then(
          response => {
            myAddress.isSaving = false;
            myAddress.isNew = false;
            myAddress.wasChanged = false;
            this.addressList.push(response.body);
          },
          () => this.saveError(myAddress),
        );
      } else {
        const url = `${baseUrl}/${this.addressList[index].id}`;
        this.$http.put(url, addressObj).then(
          response => {
            myAddress.isSaving = false;
            myAddress.isNew = false;
            myAddress.wasChanged = false;
            this.addressList[index] = response.body;
          },
          () => this.saveError(myAddress),
        );
      }
    },
    saveError(address) {
      // noinspection UnnecessaryLocalVariableJS
      const myAddress = address;
      myAddress.isSaving = false;
      this.$parent.showErrorMessage('This address cannot be saved.');
    },
  },
};
</script>

<style scoped>
</style>
