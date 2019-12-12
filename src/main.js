import Buefy from 'buefy';
import 'buefy/dist/buefy.css';

import Gravatar from 'vue-gravatar';

import VueResource from 'vue-resource';

import moment from 'moment';

import Vue from 'vue';
import App from './App.vue';
import router from './router';

Vue.config.productionTip = false;

// Buefy
Vue.use(Buefy);

// Gravatar
Vue.component('v-gravatar', Gravatar);

// VueResource
Vue.use(VueResource);
Vue.http.options.emulateJSON = true;
Vue.http.options.root = 'http://localhost:8000/contactmanager/v1/';
const { http } = Vue;
export default http;

Vue.filter('formatDate', value =>
  value ? moment(String(value)).format('MM/DD/YYYY') : '',
);

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
