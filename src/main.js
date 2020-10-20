import Vue from 'vue'
import {router} from "./router";
import App from "./App";
import {currentContext} from "./components/base/CurrentContext";
import {dictionaryStorage} from "./components/base/DictionaryStorage";

Vue.config.productionTip = false;

new Vue({
    router: router,
    render: h => h(App),
    created: function () {
        currentContext.reload();
        dictionaryStorage.init(()=>{
            // this.$router.replace("/home");
        })
    }
}).$mount('#app');
