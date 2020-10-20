import Vue from 'vue';
import Router from 'vue-router';

import Home from './components/home/Home';
import ParkManager from './components/house/park/ParkManager';
import Customer from './components/crm/CustomerManager';
import Mine from './components/mine/Mine';
import CustomerDetail from './components/crm/CustomerDetail';
import Login from './components/mine/Login';
import HomeContent from "./components/home/HomeContent";
import ParkDetail from "./components/house/park/ParkDetail";
import FloorManager from "./components/house/floor/FloorManager";
import FloorDetail from './components/house/floor/FloorDetail';
import CustomerFollowupEditor from "./components/crm/followup/CustomerFollowupEditor";
import CustomerUpDownEditor from "./components/crm/followup/CustomerUpDownEditor";
import HouseEditor from "./components/house/HouseEditor";


Vue.use(Router);

const routes = [{
    name: 'home',
    path: '/',
    component: Home,
    meta:{
       keepAlive:true
    },
    children: [{
        path: '',
        component: HomeContent,
    }, {
        name: 'park',
        path: '/park',
        component: ParkManager,
        meta:{
            keepAlive:true
        }
    },  {
        name: 'floor',
        path: '/floor',
        component: FloorManager,
        meta:{
            keepAlive:true
        }
    }, {
        name: 'customer',
        path: '/customer',
        component: Customer,
        meta: {
            keepAlive: true
        }
    }, {
        name: 'mine',
        path: '/mine',
        component: Mine,
        meta:{
            keepAlive:false
        }
    },]
}, {
    name: 'houseEditor',
    path: '/house/editor',
    component: HouseEditor,
    meta:{
        keepAlive:true
    }
}, {
    name: 'customerDetail',
    path: '/customer/detail/:id',
    component: CustomerDetail,
    meta:{
        keepAlive:true
    }
}, {
    name:'followupEditor',
    path:'/customer/followup/editor/:cusStatus/:cusId',
    component:CustomerFollowupEditor
},   {
    name:'upDownEditor',
    path:'/customer/updown/:cusStatus/:cusId',
    component:CustomerUpDownEditor
},  {
    name: 'parkDetail',
    path: '/park/detail/:id',
    component: ParkDetail,
    meta:{
        keepAlive:true
    }
},  {
    name: 'floorDetail',
    path: '/floor/detail/:id',
    component: FloorDetail,
    meta:{
        keepAlive:false
    }
},{
    name: 'login',
    path: '/login',
    component: Login,
    meta: {
        requireAuth: true
    }
}];

const router = new Router({
    // mode:'history',
    routes: routes
});

export {router};