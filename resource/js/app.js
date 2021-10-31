window.$=window.jQuery=require("jquery");
require('jquery-ui-sortable-npm');
Vue = require("vue").default;

Vue.component("acf",require("./component/form.vue").default);
Vue.component("acf_maker",require("./component/form_maker.vue").default);

const app=new Vue({
    el: "#acf"
});