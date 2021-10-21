window.$=window.jQuery=require("jquery");
require('jquery-ui-sortable-npm');
Vue = require("vue").default;

Vue.component("rp-form",require("./component/form.vue").default);

const app=new Vue({
    el: "#rp"
});