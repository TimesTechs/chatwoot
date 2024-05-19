import Vue from 'vue';
import VueI18n from 'vue-i18n';
import VueRouter from 'vue-router';
import axios from 'axios';
// Global Components
import hljs from 'highlight.js';
import Multiselect from 'vue-multiselect';
import VueFormulate from '@braid/vue-formulate';
import WootSwitch from 'components/ui/Switch.vue';
import WootWizard from 'components/ui/Wizard.vue';
import { sync } from 'vuex-router-sync';
import Vuelidate from 'vuelidate';
import VTooltip from 'v-tooltip';
import WootUiKit from '../dashboard/components/index.js';
import App from '../dashboard/App.vue';
import i18n from '../dashboard/i18n/index.js';
import createAxios from '../dashboard/helper/APIHelper.js';
import commonHelpers, { isJSONValid } from '../dashboard/helper/commons.js';
import router, { initalizeRouter } from '../dashboard/routes/index.js';
import store from '../dashboard/store/index.js';
import constants from 'dashboard/constants/globals';
import * as Sentry from '@sentry/vue';
import 'vue-easytable/libs/theme-default/index.css';
import { Integrations } from '@sentry/tracing';
import {
  initializeAnalyticsEvents,
  initializeChatwootEvents,
} from '../dashboard/helper/scriptHelpers.js';
import FluentIcon from 'shared/components/FluentIcon/DashboardIcon.vue';
import VueDOMPurifyHTML from 'vue-dompurify-html';
import { domPurifyConfig } from '../shared/helpers/HTMLSanitizer.js';
import AnalyticsPlugin from '../dashboard/helper/AnalyticsHelper/plugin.js';
import resizeDirective from '../dashboard/helper/directives/resize.js';
import { directive as onClickaway } from 'vue-clickaway';

if (window.errorLoggingConfig) {
  Sentry.init({
    Vue,
    dsn: window.errorLoggingConfig,
    denyUrls: [
      // Chrome extensions
      /^chrome:\/\//i,
      /chrome-extension:/i,
      /extensions\//i,

      // Locally saved copies
      /file:\/\//i,

      // Safari extensions.
      /safari-web-extension:/i,
      /safari-extension:/i,
    ],
    integrations: [new Integrations.BrowserTracing()],
    ignoreErrors: [
      'ResizeObserver loop completed with undelivered notifications',
    ],
  });
}

Vue.use(VueDOMPurifyHTML, domPurifyConfig);
Vue.use(VueRouter);
Vue.use(VueI18n);
Vue.use(WootUiKit);
Vue.use(Vuelidate);
Vue.use(VueFormulate, {
  rules: {
    JSON: ({ value }) => isJSONValid(value),
  },
});
Vue.use(VTooltip, {
  defaultHtml: false,
});
Vue.use(hljs.vuePlugin);
Vue.use(AnalyticsPlugin);

Vue.component('multiselect', Multiselect);
Vue.component('woot-switch', WootSwitch);
Vue.component('woot-wizard', WootWizard);
Vue.component('fluent-icon', FluentIcon);

Vue.directive('resize', resizeDirective);
Vue.directive('on-clickaway', onClickaway);
const i18nConfig = new VueI18n({
  locale: 'en',
  messages: i18n,
});

sync(store, router);
// load common helpers into js
commonHelpers();

window.WootConstants = constants;
window.axios = createAxios(axios);
window.bus = new Vue();
initializeChatwootEvents();
initializeAnalyticsEvents();
initalizeRouter();

window.onload = () => {
  window.WOOT = new Vue({
    router,
    store,
    i18n: i18nConfig,
    components: { App },
    template: '<App/>',
  }).$mount('#app');
};

window.addEventListener('load', () => {
  window.playAudioAlert = () => {};
});