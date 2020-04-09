<template>
  <div style="display: none;">
    <slot v-if="ready"></slot>
  </div>
</template>

<script>
import { findRealParent, propsBinder } from "vue2-leaflet";
import { DomEvent, L } from "leaflet";
import "leaflet.heat";
import idw from "../lib/leaflet-idw";

const props = {
  latLng: {
    type: Array,
    default: () => [],
    custom: false
  },
  minOpacity: {
    type: Number,
    custom: true,
    default: 0.05
  },
  maxZoom: {
    type: Number,
    custom: true,
    default: 18
  },
  radius: {
    type: Number,
    custom: true,
    default: 25
  },
  blur: {
    type: Number,
    custom: true,
    default: 15
  },
  max: {
    type: Number,
    custom: true,
    default: 1.0
  },
  visible: {
    type: Boolean,
    custom: true,
    default: true
  },
  trigger: {
    type: Number,
    default: 999
  },
  maxVal: {
    type: Number
  }
};
export default {
  name: "LHeatmap",
  props,
  data() {
    return {
      ready: false,
      map: ""
    };
  },
  mounted() {
    const options = {};
    if (this.minOpacity) {
      options.minOpacity = this.minOpacity;
    }
    if (this.maxZoom) {
      options.maxZoom = this.maxZoom;
    }
    if (this.radius) {
      options.radius = this.radius;
    }
    if (this.blur) {
      options.blur = this.blur;
    }
    if (this.max) {
      options.max = this.max;
    }
    this.mapObject = idw(this.latLng, {
      opacity: 0.5,
      maxZoom: 18,
      cellSize: 7,
      exp: 3,
      max: 400,
      gradient: {
        0.0: "#A7F020",
        0.1: "#FFF7BC",
        0.2: "#FEE391",
        0.3: "#FEC44F",
        0.4: "#FE9929",
        0.5: "#EC7014",
        0.6: "#CC4C02",
        0.8: "#993404",
        1.0: "#662506"
      }
    });
    DomEvent.on(this.mapObject, this.$listeners);
    propsBinder(this, this.mapObject, props);
    this.ready = true;
    this.parentContainer = findRealParent(this.$parent);
    this.parentContainer.addLayer(this, !this.visible);
    // console.log("keys",Object.keys(this.mapObject));
    // console.log("map obj",this.mapObject._map.dragging)
    this.mapObject._map.dragging.disable();
    console.log("lat long array from parent")
    this.mapObject._map.setMinZoom(12);
  },
  beforeDestroy() {
    this.parentContainer.removeLayer(this);
  },
  methods: {
    setMinOpacity(newVal) {
      this.mapObject.setOptions({ minOpacity: newVal });
    },
    setMaxZoom(newVal) {
      this.mapObject.setOptions({ maxZoom: newVal });
    },
    setRadius(newVal) {
      this.mapObject.setOptions({ radius: newVal });
    },
    setBlur(newVal) {
      this.mapObject.setOptions({ blur: newVal });
    },
    setMax(newVal) {
      this.mapObject.setOptions({ max: newVal });
    },
    setVisible(newVal, oldVal) {
      if (newVal === oldVal) return;
      if (newVal) {
        this.parentContainer.addLayer(this);
      } else {
        this.parentContainer.removeLayer(this);
      }
    },
    addLatLng(value) {
      this.mapObject.addLatLng(value);
    }
  },
  watch: {
    trigger: function(ol, nl) {
      console.log('trigger called')
      this.mapObject.redraw();
      this.mapObject.setOptions({
       opacity: 0.5,
      maxZoom: 18,
      cellSize: 6,
      exp: 3,
      max: 400,
      gradient: {
        0.0: "#A7F020",
        0.1: "#FFF7BC",
        0.2: "#FEE391",
        0.3: "#FEC44F",
        0.4: "#FE9929",
        0.5: "#EC7014",
        0.6: "#CC4C02",
        0.8: "#993404",
        1.0: "#662506"
      }
      });
    }
  }
};
</script>

<style>
.leaflet-control-attribution {
  display: none
}
.leaflet-container {
    border-radius:4rem;
    height: 80vh !important;
}
.leaflet-left .leaflet-control {
    margin-left: 33px !important;
}
.leaflet-top .leaflet-control {
    margin-top: 19px !important;
}
.leaflet-container {
  width: 100% !important;
  /* height: 100% !important; */
}
</style>
