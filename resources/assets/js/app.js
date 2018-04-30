/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require( './bootstrap' );

/*
 * Background
 */

import backgroundSwitcher from './modules/backgroundSwitcher'
document.addEventListener( 'DOMContentLoaded', () => backgroundSwitcher.initBackground() )


/*
 * Help modal
 */

// better to load this with XHR? Faster pages but lose SEO.


/*
 * Vue components
 */

import Vue from 'vue'
window.Vue = Vue

// popups
// can be used by vue as a plug in (also by JS with show method)
import popupAlertVueModule from './plugins/popupAlert'
Vue.use( popupAlertVueModule.vueModule )

// team
Vue.component( 'team', require( './components/Team.vue' ) )
const team = new Vue( {
	el: '#team'
} );

// nav
Vue.component( 'site-nav', require( './components/Nav.vue' ) )
const siteNav = new Vue( {
	el: '#nav'
} );

// garage
Vue.component( 'garage', require( './components/Garage.vue' ) )
const garage = new Vue( {
	el: '#garage'
} );