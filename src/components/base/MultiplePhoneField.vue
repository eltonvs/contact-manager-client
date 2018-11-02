<template>
  <div>
    <label class="label">Phone Numbers</label>
    <b-field
        grouped
        v-for="(phone, index) in phoneNumbers"
        :key="'phone_input' + index">
      <b-field expanded>
        <b-input
            required
            placeholder="Phone Number"
            type="tel"
            minlength="7"
            maxlength="20"
            v-model="phone.phone"
            :disabled="isUpdating && (phone.isLoading || phone.isSaving)"
            @keydown.native.enter.prevent="save(phone, index)"
            @input="onChanged(phone, index)">
        </b-input>
      </b-field>
      <p class="control action-buttons">
        <button
            class="button is-danger"
            :class="{'is-loading' : phone.isDeleting}"
            :disabled="!canRemove(phone)"
            @click.prevent="remove(phone, index)">
          <i class="fas fa-times squared"></i>
        </button>
        <button
            class="button is-primary"
            :class="{'is-loading' : phone.isSaving}"
            :disabled="!canSave(phone)"
            v-if="isUpdating"
            @click.prevent="save(phone, index)">
          <i class="fas fa-check squared"></i>
        </button>
      </p>
    </b-field>
    <button
        class="button"
        :disabled="!canAdd()"
        @click.prevent="add">
      Add phone &nbsp;<i class="fas fa-plus"></i>
    </button>
  </div>
</template>

<script>
export default {
  name: 'MultiplePhoneField',
  props: {
    isUpdating: { type: Boolean, default: true },
    value: Array,
    contactId: Number,
    phoneList: Array,
  },
  data() {
    return {
      phoneNumbers: this.isUpdating
        ? this.phoneList.map(p => this.createPhoneObject(p, false))
        : this.value.map(p => this.createPhoneObject(p, true)),
    };
  },
  methods: {
    createPhoneObject: (phone, isNew = true) => ({
      phone,
      isNew,
      wasChanged: false,
      isSaving: false,
      isDeleting: false,
    }),
    onChanged(phone, index) {
      if (!this.isUpdating) return;
      const myPhone = phone;
      myPhone.wasChanged = myPhone.phone !== this.phoneList[index];
    },
    isValid: phone => {
      const re = /^\+(?:[0-9] ?){6,14}[0-9]$/;
      return phone.phone !== '' && re.test(phone.phone);
    },
    canAdd() {
      return (
        (this.isUpdating &&
          this.phoneNumbers.filter(p => p.isNew).length === 0) ||
        (!this.isUpdating && this.phoneNumbers.every(this.isValid))
      );
    },
    canRemove(phone) {
      return (
        (this.isUpdating &&
          (this.phoneNumbers.filter(p => !p.isNew).length > 1 ||
            phone.isNew)) ||
        (!this.isUpdating && this.phoneNumbers.filter(this.isValid).length > 1)
      );
    },
    canSave(phone) {
      return (
        this.isUpdating &&
        this.isValid(phone) &&
        (phone.isNew || phone.wasChanged)
      );
    },
    add() {
      this.phoneNumbers.push(this.createPhoneObject(''));
    },
    remove(phone, index) {
      const myPhone = phone;
      if (!this.canRemove(myPhone)) return;
      if (myPhone.isNew) {
        // Just delete from UI
        this.$delete(this.phoneNumbers, index);
      } else {
        myPhone.isDeleting = true;
        const url = `contacts/${this.contactId}/phone_numbers/${myPhone.phone}`;
        this.$http.delete(url).then(
          () => {
            myPhone.isDeleting = false;
            this.$delete(this.phoneNumbers, index);
            this.$delete(this.phoneList, index);
          },
          () => {
            myPhone.isDeleting = false;
            this.$emit('error', 'This phone cannot be deleted!');
          },
        );
      }
    },
    save(phone, index) {
      if (!this.canSave(phone)) return;
      const baseUrl = `contacts/${this.contactId}/phone_numbers`;
      const myPhone = phone;
      const phoneObj = { phone: myPhone.phone };
      myPhone.isSaving = true;
      if (phone.isNew) {
        this.$http.post(baseUrl, phoneObj).then(
          () => {
            myPhone.isSaving = false;
            myPhone.isNew = false;
            myPhone.wasChanged = false;
            this.phoneList.push(myPhone.phone);
          },
          err => this.saveError(myPhone, err.body.phone),
        );
      } else {
        this.$http.put(`${baseUrl}/${this.phoneList[index]}`, phoneObj).then(
          () => {
            myPhone.isSaving = false;
            myPhone.isNew = false;
            myPhone.wasChanged = false;
            this.phoneList[index] = myPhone.phone;
          },
          err => this.saveError(myPhone, err.body.phone),
        );
      }
    },
    saveError(phone, errors) {
      const myPhone = phone;
      const errorsStr = errors.join(', ');
      myPhone.isSaving = false;
      this.$emit(
        'error',
        `The phone "${myPhone.phone}" cannot be saved: ${errorsStr}`,
      );
    },
  },
  watch: {
    phoneNumbers: {
      handler(val) {
        const filtered = val.map(phone => phone.phone);
        this.$emit('input', filtered);
      },
      deep: true,
    },
  },
};
</script>
