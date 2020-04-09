<template>
  <l-map :zoom="zoom" :center="center" @update:bounds="boundsUpdated" v-if="latLngArray">
    <l-tile-layer :url="url"></l-tile-layer>
    <leaflet-idw :lat-lng="latLngArray" :trigger="trigger" :maxVal="maxVal"></leaflet-idw>
    <!-- <l-marker :key="index" v-for="(m,index) in nAry" :lat-lng="m ? m.latlng : ''">
      <l-icon :icon-anchor="staticAnchor" v-if="m" :class-name="getClass(m.AQI)">
        <div class="headline">{{ m.AQI}}</div>
      </l-icon>
      <l-tooltip>{{m.place}}</l-tooltip>
    </l-marker>-->
    <l-marker :lat-lng="[lat,lng]">
      <l-icon :con-anchor="staticAnchor">
        <div>
          <img src="../assets/Path 3.png" height='30'/>
        </div>
      </l-icon>
      <!-- <l-tooltip>{{m.place}}</l-tooltip> -->
    </l-marker>
  </l-map>
</template>

<script>
import {
  LMap,
  LTileLayer,
  // LRectangle,
  LIcon,
  LTooltip,
  LMarker
} from "vue2-leaflet";
import LeafletIdw from "../components/LeafletIdw";
import { latLngBounds, latLng } from "leaflet";
import _ from "underscore";

export default {
  components: {
    LMarker,
    LMap,
    LTileLayer,
    LIcon,
    LTooltip,
    LeafletIdw,
    latLngBounds,
    latLng
  },
  props: ["lat", "lng"],
  data() {
    return {
      trigger: 0,
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      urlWind:
        "http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      urlVelocity:
        "http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      zoom: 13,
      nloc: [],
      latLngArray: [],
      center: [this.lat, this.lng],
      markerlatlng: [this.lat, this.lng],
      bounds: [],
      maxVal: 0,
      minVal: 0,
      maxBounds: [],
      rectangle: {
        bounds: null,
        style: {
          color: "red",
          weight: 3
          // fillColor: "red"
        }
      },
      indexArray: [],
      nAry: [],
      call: 1,
      staticAnchor: [this.lat, this.lng]
    };
  },
  mounted() {
    this.zoom = this.zoom - 1;
  },
  methods: {
    boundsUpdated(bounds) {
      const b = JSON.parse(JSON.stringify(bounds));
      this.placesNear(
        bounds._northEast.lat,
        bounds._northEast.lng,
        bounds._southWest.lat,
        bounds._southWest.lng
      );
    },
    async placesNear(neLat, neLng, swLat, swLng) {
      this.call = this.call + 1;
    // local
    // const uri = `http://0.0.0.0:5001/bounds?neLat=${neLat}&neLng=${neLng}&swLat=${swLat}&swLng=${swLng}&lat=${this.lat}&lng=${this.lng}`
    //  ec2
    const uri = `http://13.233.107.20:5001/bounds?neLat=${neLat}&neLng=${neLng}&swLat=${swLat}&swLng=${swLng}&lat=${this.lat}&lng=${this.lng}`;
    // Fargate 
    // const uri = `http://13.233.2.223:5001/bounds?neLat=${neLat}&neLng=${neLng}&swLat=${swLat}&swLng=${swLng}&lat=${this.lat}&lng=${this.lng}`
      const options = {
        url: uri,
        method: "GET"
        // headers: { "x-api-key": "srjg6nKXxsT2sOod9vyy3EXqlbo1pqg4koClAnG7" }
      };
      await this.$http(options).then(result => {
        const dataArray = result.data;
        this.places = result.data[result.data.length -1];
        this.$emit("places", this.places);
        this.nloc = dataArray.map(elm => {
          if (elm.AQI && elm.lat) {
            if (!this.maxVal) this.maxVal = elm.AQI;
            if (!this.minVal) this.minVal = elm.AQI;
            this.maxVal = elm.AQI > this.maxVal ? elm.AQI : this.maxVal;
            this.minVal = elm.AQI < this.minVal ? elm.AQI : this.minVal;
            this.latLngArray.push([elm.lat, elm.lng, elm.AQI]);
            return {
              AQI: elm.AQI,
              aqiInfo: elm.AQI < 50 ? {category: 'Good'} : {category: 'Moderate'},
              place: elm.placeName,
              latlng: [elm.lat, elm.lng]
            };
          }
        });
        // this.$refs.idw;
        // console.log("refs.idw", this.$refs.idw.mapObject);
        this.$emit("mapEvent", "Hi");
        this.trigger = this.trigger + 1;
      });
      this.generateMarkers(this.nloc);
    },
    getClass(aqi) {
      if (typeof aqi === "number") {
        if (!aqi || aqi < 0) {
          return null;
        } else if (aqi <= 50) {
          return "green-mark";
        } else if (aqi > 50 && aqi <= 100) {
          return "yellow-mark";
        } else if (aqi > 100 && aqi <= 150) {
          return "orange-mark";
        } else if (aqi > 150 && aqi <= 200) {
          return "red-mark";
        } else if (aqi > 200 && aqi <= 300) {
          return "purple";
        } else if (aqi > 300) {
          return "maroon";
        }
      }
    },
    getHeadline(aqi) {
      if (typeof aqi === "number") {
        if (!aqi || aqi < 0) {
          return null;
        } else if (aqi <= 50) {
          return "greenHead";
        } else if (aqi > 50 && aqi <= 100) {
          return "yellowHead";
        } else if (aqi > 100 && aqi <= 150) {
          return "orangeHead";
        } else if (aqi > 150 && aqi <= 200) {
          return "redHead";
        } else if (aqi > 200 && aqi <= 300) {
          return "purpleHead";
        } else if (aqi > 300) {
          return "maroonHead";
        }
      }
    },
    redraw_map() {
      this.$emit("mapEvent", "Hi");
    },
    async generateMarkers(d) {
      this.nAry = [];
      const count = d.length;
      const f = (count / 15).toFixed(0);
      d.map(elm => {
        if (d.indexOf(elm) % f == 0) {
          this.nAry.push(elm);
        }
      });
    }
  },
  watch: {
    lat: {
      immediate: true,
      handler(v) {
        this.center = [this.lat, this.lng];
      }
    }
  }
};
</script>
<style>
.green-mark {
  background-color: #a8e05f;
  width: 42px !important;
  height: 42px !important;
  line-height: 50px;
  border-radius: 50%;
  -moz-border-radius: 50%;
  -webkit-border-radius: 50%;
  text-align: center;
  color: white;
  font-size: 15px;
  text-transform: uppercase;
  font-weight: 500;
  margin: 0 auto 40px;
  box-shadow: 5px 5px 5px 0px rgba(0, 0, 0, 0.5);
}
.yellow-mark {
  background-color: #ffdf58;
  width: 42px !important;
  height: 42px !important;
  line-height: 50px;
  border-radius: 50%;
  -moz-border-radius: 50%;
  -webkit-border-radius: 50%;
  text-align: center;
  color: white;
  font-size: 15px;
  text-transform: uppercase;
  font-weight: 500;
  margin: 0 auto 40px;
  box-shadow: 5px 5px 5px 0px rgba(0, 0, 0, 0.5);
}
.orange-mark {
  background-color: #fe9b57;
  width: 42px !important;
  height: 42px !important;
  line-height: 50px;
  border-radius: 50%;
  -moz-border-radius: 50%;
  -webkit-border-radius: 50%;
  text-align: center;
  color: white;
  font-size: 15px;
  text-transform: uppercase;
  font-weight: 500;
  margin: 0 auto 40px;
  box-shadow: 5px 5px 5px 0px rgba(0, 0, 0, 0.5);
}
.red-mark {
  background-color: #fe6a69;
  width: 42px !important;
  height: 42px !important;
  line-height: 50px;
  border-radius: 50%;
  -moz-border-radius: 50%;
  -webkit-border-radius: 50%;
  text-align: center;
  color: white;
  font-size: 15px;
  text-transform: uppercase;
  font-weight: 500;
  margin: 0 auto 40px;
  box-shadow: 5px 5px 5px 0px rgba(0, 0, 0, 0.5);
}
.purple-mark {
  background-color: #b19cd9;
  width: 42px !important;
  height: 42px !important;
  line-height: 50px;
  border-radius: 50%;
  -moz-border-radius: 50%;
  -webkit-border-radius: 50%;
  text-align: center;
  color: white;
  font-size: 15px;
  text-transform: uppercase;
  font-weight: 500;
  margin: 0 auto 40px;
  box-shadow: 5px 5px 5px 0px rgba(0, 0, 0, 0.5);
}
.maroon-mark {
  background-color: #6e0a1e;
  width: 42px !important;
  height: 42px !important;
  line-height: 50px;
  border-radius: 50%;
  -moz-border-radius: 50%;
  -webkit-border-radius: 50%;
  text-align: center;
  color: white;
  font-size: 15px;
  text-transform: uppercase;
  font-weight: 500;
  margin: 0 auto 40px;
  box-shadow: 5px 5px 5px 0px rgba(0, 0, 0, 0.5);
}
.greenHead {
  color: #718b3a;
  font-size: 15px;
}
.yellowHead {
  color: #a57f23;
  font-size: 15px;
}
.orangeHead {
  color: #b25826;
  font-size: 15px;
}
.redHead {
  color: #af2c3b;
  font-size: 15px;
}
.purpleHead {
  color: white;
  font-size: 15px;
}
.maroonHead {
  color: #b25826;
  font-size: 15px;
}

</style>
