<template>
  <mapbox
      :access-token="mapBoxToken"
      :map-options="mapBoxOptions"
      @map-load="mapLoaded">
  </mapbox>
</template>

<script>
import Mapbox from 'mapbox-gl-vue';

export default {
  name: 'MapComponent',
  components: { Mapbox },
  props: { addresses: Array },
  data() {
    return {
      mapBoxToken:
        'pk.eyJ1IjoiZWx0b252cyIsImEiOiJjam5xNXpkYWIwcW5pM2tuNTdnNDBwNm1iIn0.1tKc9Kel5r8l4_7J6WmlCA',
      mapBoxOptions: {
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v10',
        center: [0, 0],
        zoom: 0,
      },
      mapBoxLayerLayout: { 'icon-image': 'circle-15' },
      addressesCoordinates: [],
    };
  },
  methods: {
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
    },
    getCoordinatesFromAddress(map) {
      this.addressesCoordinates = [];
      this.addresses.forEach((address) => {
        const encodedAddress = encodeURI(address);
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
