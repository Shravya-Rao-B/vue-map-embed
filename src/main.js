import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueGeolocation from 'vue-browser-geolocation';
import * as VueGoogleMaps from 'vue2-google-maps';
import { LMap, LTileLayer, LMarker } from 'vue2-leaflet';
import 'leaflet/dist/leaflet.css';
Vue.component('l-map', LMap);
Vue.component('l-tile-layer', LTileLayer);
Vue.component('l-marker', LMarker);
import axios from 'axios';
import vueCustomElement from 'vue-custom-element';

Vue.use(vueCustomElement)
Vue.use(VueGeolocation);
Vue.use(VueGoogleMaps, {
  load: {
    key:'AIzaSyD1otF6r8Nbuwk-3R9j4AR7PX2sTlE6Qh4',
    libraries: 'places' // necessary for places input 
  }
});
Vue.component('l-map', LMap);
Vue.component('l-tile-layer', LTileLayer);
Vue.component('l-marker', LMarker);

Vue.prototype.$http = axios;  

// Vue.config.productionTip = false

// new Vue({
//   router,
//   render: h => h(App)
// }).$mount('#app')
// App.store = store
App.router = router
Vue.customElement('vue-widget', App)
