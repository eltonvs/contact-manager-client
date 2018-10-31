<template>
  <div>
    <media-item v-bind:title="fullName()" icon="fas fa-user"></media-item>
    <media-item title="Date of Birth" icon="fas fa-birthday-cake">
      <p>{{ contact.date_of_birth | formatDate }}</p>
    </media-item>
    <media-item title="Email Addresses" icon="fas fa-envelope">
      <ul>
        <li v-for="email in contact.emails" v-bind:key="email">
          <a v-bind:href="'mailto:' + email" v-bind:title="'Send a message to ' + email">{{ email }}</a>
        </li>
      </ul>
    </media-item>
    <media-item title="Phone Numbers" icon="fas fa-phone">
      <ul>
        <li v-for="phone in contact.phone_numbers" v-bind:key="phone">
          <a v-bind:href="'tel:' + phone">{{ phone }}</a>
        </li>
      </ul>
    </media-item>
    <media-item title="Addresses" icon="fas fa-map-marker-alt">
      <media-item
          v-for="(address, index) in contact.addresses"
          v-bind:key="'address_item' + index"
          v-bind:noBorder="index === 0">
        <p>
          {{ address.address }} - {{ address.city }}<br/>
          {{ address.state }}, {{ address.country }}<br/>
          {{ address.zip_code }}
        </p>
      </media-item>
      <media-item v-if="contact && contact.addresses && contact.addresses.length > 0">
        <mapbox
            :access-token="mapBoxToken"
            :map-options="mapBoxOptions"
            @map-load="mapLoaded">
        </mapbox>
      </media-item>
    </media-item>
    <b-loading :is-full-page="false" :active.sync="isLoading" :can-cancel="true"></b-loading>
  </div>
</template>

<script>
import Mapbox from 'mapbox-gl-vue';
import MediaItem from '@/components/base/MediaItem.vue';

export default {
  name: 'ContactInfo',
  components: { MediaItem, Mapbox },
  props: {
    contact: {
      id: Number,
      first_name: String,
      last_name: String,
      date_of_birth: String,
      phone_numbers: Array,
      emails: Array,
      addresses: Array,
    },
  },
  data() {
    return {
      isLoading: false,
      mapBoxToken:
        'pk.eyJ1IjoiZWx0b252cyIsImEiOiJjam5xNXpkYWIwcW5pM2tuNTdnNDBwNm1iIn0.1tKc9Kel5r8l4_7J6WmlCA',
      mapBoxOptions: {
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v10',
        center: [-96, 37.8],
        zoom: 3,
      },
      addressesCoordinates: [],
      mapBoxLayerLayout: { 'icon-image': 'circle-15' },
    };
  },
  methods: {
    fullName() {
      return `${this.contact.first_name} ${this.contact.last_name}`;
    },
    formattedAddress(address) {
      return `${address.address}, ${address.city} - ${address.state},
      ${address.country}. ${address.zip_code}`;
    },
    addCoordinatesToMap(map, coordinates) {
      map.addLayer({
        id: coordinates.toString(),
        type: 'symbol',
        source: {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates,
                },
              },
            ],
          },
        },
        layout: this.mapBoxLayerLayout,
      });
      this.addressesCoordinates.push(coordinates);
      map.fitBounds(this.addressesCoordinates, { padding: 40 });
    },
    getCoordinatesFromAddress(map) {
      this.addressesCoordinates = [];
      this.contact.addresses.forEach((address) => {
        const encodedAddress = encodeURI(this.formattedAddress(address));
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?limit=1&access_token=${
          this.mapBoxToken
        }`;
        this.$http.get(url).then(
          (response) => {
            if (
              response.body.features.length > 0 &&
              response.body.features[0].center.length > 0
            ) {
              this.addCoordinatesToMap(map, response.body.features[0].center);
            }
          },
          () => {},
        );
      });
    },
    mapLoaded(map) {
      this.getCoordinatesFromAddress(map);
    },
  },
};
</script>

<style lang="scss" scoped>
#map {
  width: 100%;
  height: 300px;
}
</style>
