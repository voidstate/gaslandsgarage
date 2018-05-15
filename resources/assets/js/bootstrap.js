
window._ = require('lodash');
window.Popper = require('popper.js').default;

/**
 * We'll load jQuery and the Bootstrap jQuery plugin which provides support
 * for JavaScript based Bootstrap features such as modals and tabs. This
 * code may be modified to fit the specific needs of your application.
 */

try {
    window.$ = window.jQuery = require('jquery');

    require('bootstrap');
} catch (e) {
    console.error( 'Failed to load jQuery')
}

/**
 * We'll load the axios HTTP library which allows us to easily issue requests
 * to our Laravel back-end. This library automatically handles sending the
 * CSRF token as a header based on the value of the "XSRF" token cookie.
 */

window.axios = require('axios');

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

/**
 * Next we will register the CSRF Token as a common header with Axios so that
 * all outgoing HTTP requests automatically have it attached. This is just
 * a simple convenience so we don't have to attach every token manually.
 */

let token = document.head.querySelector('meta[name="csrf-token"]');

if (token) {
    window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
} else {
    console.error('CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token');
}

/**
 * Echo exposes an expressive API for subscribing to channels and listening
 * for events that are broadcast by Laravel. Echo and event broadcasting
 * allows your team to easily build robust real-time web applications.
 */

// import Echo from 'laravel-echo'

// window.Pusher = require('pusher-js');

// window.Echo = new Echo({
//     broadcaster: 'pusher',
//     key: process.env.MIX_PUSHER_APP_KEY,
//     cluster: process.env.MIX_PUSHER_APP_CLUSTER,
//     encrypted: true
// });

/*
 * Font Awesome
 */

import fontawesome from '@fortawesome/fontawesome'

import faCar from '@fortawesome/fontawesome-free-solid/faCar'
import faCog from '@fortawesome/fontawesome-free-solid/faCog'
import faCopy from '@fortawesome/fontawesome-free-solid/faCopy'
import faCheckCircle from '@fortawesome/fontawesome-free-solid/faCheckCircle'
import faCloudDownloadAlt from '@fortawesome/fontawesome-free-solid/faCloudDownloadAlt'
import faCloudUploadAlt from '@fortawesome/fontawesome-free-solid/faCloudUploadAlt'
//import faCube from '@fortawesome/fontawesome-free-solid/faCube'
import faExclamationTriangle from '@fortawesome/fontawesome-free-solid/faExclamationTriangle'
import faFacebookSquare from '@fortawesome/fontawesome-free-brands/faFacebookSquare'
import faGoogle from '@fortawesome/fontawesome-free-brands/faGoogle'
import faInfoCircle from '@fortawesome/fontawesome-free-solid/faInfoCircle'
import faLock from '@fortawesome/fontawesome-free-solid/faLock'
import faPlusSquare from '@fortawesome/fontawesome-free-solid/faPlusSquare'
import faPrint from '@fortawesome/fontawesome-free-solid/faPrint'
import faQuestionCircle from '@fortawesome/fontawesome-free-solid/faQuestionCircle'
//import faRandom from '@fortawesome/fontawesome-free-solid/faRandom'
//import faShieldAlt from '@fortawesome/fontawesome-free-solid/faShieldAlt'
import faSpinner from '@fortawesome/fontawesome-free-solid/faSpinner'
import faTimes from '@fortawesome/fontawesome-free-solid/faTimes'
import faTrashAlt from '@fortawesome/fontawesome-free-solid/faTrashAlt'
import faUnlock from '@fortawesome/fontawesome-free-solid/faUnlock'
import faUsers from '@fortawesome/fontawesome-free-solid/faUsers'

fontawesome.library.add(
	faCar,
	faCog,
	faCopy,
	faCheckCircle,
	faCloudDownloadAlt,
	faCloudUploadAlt,
	//faCube,
	faExclamationTriangle,
	faFacebookSquare,
	faGoogle,
	faInfoCircle,
	faLock,
	faPlusSquare,
	faPrint,
	faQuestionCircle,
	//faRandom,
	//faShieldAlt,
	faSpinner,
	faTimes,
	faTrashAlt,
	faUsers,
	faUnlock
)

/*
 * Polyfill ES6 promises
 */

import 'es6-promise/auto'

/*
 * Polyfill intersection-observer
 */

import 'intersection-observer'