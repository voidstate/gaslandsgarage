/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require( './bootstrap' )

/*
 * Background
 */

import backgroundSwitcher from './modules/backgroundSwitcher'

document.addEventListener( 'DOMContentLoaded', () => backgroundSwitcher.initBackground() )

const credit = $( '#voidstateCredit' )
credit.one( 'click', () =>
{
	credit.addClass( 'animated tada' )
} )

/*
 * Help modal
 */

// better to load this with XHR? Probably not. We get faster pages but lose SEO.

/*
 * Full description?
 *
 * @see https://vuejs.org/v2/cookbook/adding-instance-properties.html#Base-Example
 */

import Cookies from 'js-cookie'

Vue.prototype.$descriptionMode = Cookies.get( 'enableFullDescription' ) ? 'full' : 'short' // manually set this cookie to enable full descriptions

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
} )

// nav
Vue.component( 'site-nav', require( './components/Nav.vue' ) )
const siteNav = new Vue( {
	el: '#nav'
} )

// garage
Vue.component( 'garage', require( './components/Garage.vue' ) )
const garage = new Vue( {
	el: '#garage'
} )

/*
 * Title watcher
 */

import eventBus from './modules/eventBus'

const baseTitle = document.title

eventBus.$on( 'team.summary-changed', event =>
{
	if ( event.name !== 'New Team' )
	{
		document.title = event.name + ' · ' + baseTitle;
	}
} )