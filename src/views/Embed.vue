<template>
  <div class="container">
    <div class="row">
      <div class="col-lg-12 col-md-12 col-sm-12 col-12 d-flex">
        <!-- <span class="input-group-text" id="inputGroupPrepend">
          <i class="fas fa-map-marker" aria-hidden="true"></i>
        </span>-->
        <!-- <span class="fa fa-map-marker"></span> -->
        <gmap-autocomplete
          type="text"
          class="form-control"
          @place_changed="setPlace"
          placeholder="Search your location"
          onfocus="value = ''"
        ></gmap-autocomplete>
        <!-- <span>
          <div v-if="dataFound===3" class="spin">
            <circle10></circle10>
          </div>
        </span> -->
        <!-- <span class="input-group-text" id="inputGroupPrepend"><i class="fa fa-search" aria-hidden="true"></i>
        </span>-->
      </div>
    </div>
    <div class="mt-5">
      <Heatmap :lat="lat" :lng="lng"></Heatmap>
    </div>
  </div>
</template>

<script>
import Heatmap from "../components/Heatmap.vue";
export default {
  data() {
    return {
      lat: "12.9716",
      lng: "77.5946"
    };
  },
  components: {
    Heatmap
  },
  methods: {
    setPlace(place) {
      // console.log('place in setPLace',place)
      this.lat = place.geometry.location.lat();
      this.lng = place.geometry.location.lng();
      //   this.geoplace = place.name;
      //   this.city = place;
    }
  }
};
</script>

<style>
</style>