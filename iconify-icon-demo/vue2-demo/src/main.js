import Vue from 'vue';
import App from './App.vue';

Vue.config.productionTip = false;
Vue.config.ignoredElements = ['iconify-icon'];

new Vue({
	render: (h) => h(App),
}).$mount('#app');
