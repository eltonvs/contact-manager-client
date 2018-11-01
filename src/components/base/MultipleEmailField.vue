<template>
  <div>
    <label class="label">Email Addresses</label>
    <b-field
        grouped
        v-for="(email, index) in emailAddresses"
        :key="'email_input' + index">
      <b-field expanded>
        <b-input
            required
            placeholder="Email Address"
            type="email"
            v-model="email.email"
            :disabled="email.isLoading || email.isSaving"
            @keydown.native.enter.prevent="save(email, index)"
            @input="onChanged(email, index)">
        </b-input>
      </b-field>
      <p class="control action-buttons">
        <button
            class="button is-danger"
            :class="{'is-loading' : email.isDeleting}"
            :disabled="!canRemove(email)"
            @click.prevent="remove(email, index)">
          <i class="fas fa-times squared"></i>
        </button>
        <button
            class="button is-primary"
            :class="{'is-loading' : email.isSaving}"
            :disabled="!canSave(email)"
            @click.prevent="save(email, index)">
          <i class="fas fa-check squared"></i>
        </button>
      </p>
    </b-field>
    <button
        class="button"
        :disabled="!canAdd()"
        @click.prevent="add">
      Add email &nbsp;<i class="fas fa-plus"></i>
    </button>
  </div>
</template>

<script>
export default {
  name: 'MultipleEmailField',
  props: { contactId: Number, emailList: Array },
  data() {
    return {
      emailAddresses: this.emailList.map(e => this.createEmailObject(e, false)),
    };
  },
  methods: {
    createEmailObject: (email, isNew = true) => ({
      email,
      isNew,
      wasChanged: false,
      isSaving: false,
      isDeleting: false,
    }),
    onChanged(email, index) {
      const myEmail = email;
      myEmail.wasChanged = myEmail.email !== this.emailList[index];
    },
    canAdd() {
      return this.emailAddresses.filter(e => e.isNew).length === 0;
    },
    canRemove(email) {
      return (
        this.emailAddresses.filter(e => !e.isNew).length > 1 || email.isNew
      );
    },
    canSave: email => email.email && (email.isNew || email.wasChanged),
    add() {
      this.emailAddresses.push(this.createEmailObject(''));
    },
    remove(email, index) {
      const myEmail = email;
      if (!this.canRemove(myEmail)) return;
      if (myEmail.isNew) {
        // Just delete from UI
        this.$delete(this.emailAddresses, index);
      } else {
        myEmail.isDeleting = true;
        const url = `contacts/${this.contactId}/emails/${myEmail.email}`;
        this.$http.delete(url).then(
          () => {
            myEmail.isDeleting = false;
            this.$delete(this.emailAddresses, index);
            this.$delete(this.emailList, index);
          },
          () => {
            myEmail.isDeleting = false;
            this.$emit('error', 'This email cannot be deleted!');
          },
        );
      }
    },
    save(email, index) {
      if (!this.canSave(email)) return;
      const baseUrl = `contacts/${this.contactId}/emails`;
      const myEmail = email;
      const emailObj = { email: myEmail.email };
      myEmail.isSaving = true;
      if (email.isNew) {
        this.$http.post(baseUrl, emailObj).then(
          () => {
            myEmail.isSaving = false;
            myEmail.isNew = false;
            myEmail.wasChanged = false;
            this.emailList.push(myEmail.email);
          },
          () => this.saveError(myEmail),
        );
      } else {
        this.$http.put(`${baseUrl}/${this.emailList[index]}`, emailObj).then(
          () => {
            myEmail.isSaving = false;
            myEmail.isNew = false;
            myEmail.wasChanged = false;
            this.emailList[index] = myEmail.email;
          },
          () => this.saveError(myEmail),
        );
      }
    },
    saveError(email) {
      const myEmail = email;
      myEmail.isSaving = false;
      this.$emit('error', `The email "${myEmail.email}" cannot be saved.`);
    },
  },
};
</script>
