import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import apiClientPromise from "./plugin/axios";
import Cookies from "js-cookie";
import { swalWithCustomStyles } from './plugin/swal';
import datatable from "./components/table/datatable.vue";
import Crypto from "./plugin/crypto";
import auth from "./plugin/auth";
import currency from "./plugin/currency";
import date from "./plugin/date";

// Import Bootstrap CSS and JS
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import "@fortawesome/fontawesome-free/css/all.css";

//custom css
import "@/assets/main.scss";

import Vue3EasyDataTable from "vue3-easy-data-table";
import VueSelect from "vue-select";
import "vue3-easy-data-table/dist/style.css";
import "vue-select/dist/vue-select.css";

async function initApp() {
    const app = createApp(App);
    app.component("EasyDataTable", Vue3EasyDataTable);
    app.component("DataTable", datatable);
    app.component("v-select", VueSelect);

    app.config.globalProperties.$swal = swalWithCustomStyles;
    const axios = await apiClientPromise;
    app.config.globalProperties.$axios = axios;
    app.config.globalProperties.$cookie = Cookies;
    app.config.globalProperties.$crypto = Crypto;
    app.config.globalProperties.$auth = auth;
    app.config.globalProperties.$currency = currency;
    app.config.globalProperties.$date = date;

    app.provide("$crypto", Crypto);
    app.provide("$axios", axios);
    app.provide("$currency", currency);
    app.provide("$date", date);
    app.provide("$router", router);
    app.provide("$auth", auth);
    app.provide("$swal", swalWithCustomStyles);

    app.use(router);
    app.mount("#app");
}

initApp();