/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import vuetify from './vuetify'
import pinia from '../store'
import router from '../router'
import VueApexCharts from 'vue3-apexcharts';
import { VueReCaptcha } from 'vue-recaptcha-v3'

export function registerPlugins (app) {

  app
    .use(vuetify)
    .use(router)
    .use(pinia)
    .use(VueApexCharts)
    .use(VueReCaptcha, {
      siteKey: import.meta.env.VITE_RECAPTCHA_KEY,
      loaderOptions: {
        useRecaptchaNet: true
      }
    })
    app.config.productionTip = false;
}
