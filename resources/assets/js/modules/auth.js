import hello from 'hellojs/dist/hello.all'
import popupAlert from '../plugins/popupAlert'

let provider, // which authority was used to log in? google/facebook
    profile, // returned from authority
    userId // db user id

const init = () =>
{
	// event listeners
	hello.on( 'auth.login', onLogin )
	hello.on( 'auth.logout', onLogout )

	hello.init( {
			facebook: '217460255476142',
			google: 'mzE72Ziw5078-BgNp9eHuKo3'
		},
		{
			scope: 'email'
		} )
}

/**
 * Get db user_id from oAuth provider user.id
 *
 * @param providerUser
 * @returns {Promise<int>}
 */
const getUserId = providerUser =>
{
	return new Promise( ( resolve, reject ) =>
	{
		axios.get( '/user/get-id', {
			params: {
				provider: provider,
				id: providerUser.id,
				name: providerUser.name,
				email: providerUser.email
			}
		} ).then( response =>
		{
			resolve( response.data.id )
		} ).catch( error =>
		{
			reject( error )
		} )
	} )
}
/**
 * Get number of saved teams
 *
 * @returns axios-style promise
 */
const getTeamCount = () =>
{
	return new Promise( ( resolve, reject ) =>
	{
		axios.get( '/garage/count/' + userId ).then( response =>
		{
			resolve( response.data.count )
		} )
	} )
}

/**
 * Kick off log in
 *
 * @param provider
 */
const login = provider =>
{
	if( provider !== 'facebook' && provider !== 'google' )
	{
		throw new Error( 'Provider not recognised' )
	}

	hello( provider ).login()
}

/**
 * Kick off log out
 */
const logout = () =>
{
	if( !provider )
	{
		popupAlert.alert( 'danger', 'Cannot log out. You are not logged in!.' )
		return
	}

	hello( provider ).logout()
}

const onLogin = authResponse =>
{
	provider = authResponse.network

	hello( provider ).api( 'me' ).then( authProfile =>
	{
		// store
		profile = authProfile

		// get our own user id
		getUserId( authProfile ).then( id =>
		{
			userId = id // persist userId
			publish()
		} )
	} )
}

const onLogout = () =>
{
	provider = undefined
	userId = undefined
	profile = undefined
	publish()
}

/**
 * Check to see if user is logged in
 *
 * @returns {boolean}
 */
const isLoggedIn = () =>
{
	return !!userId
}

/**
 * Simple pub-sub. Provide a listener to be called on login/logout with new status
 *
 * @type {Array}
 */
let listeners = []
const subscribe = listener =>
      {
	      listeners.push( listener )
      },
      publish   = () =>
      {
	      for( const listener of listeners )
	      {
		      listener( isLoggedIn() )
	      }
      }

export default {
	FACEBOOK: 'facebook',
	GOOGLE: 'google',
	init: init,
	login: login,
	logout: logout,
	isLoggedIn: isLoggedIn,
	getUserId()
	{
		return userId
	},
	getUserName()
	{
		return profile ? profile.name : undefined
	},
	getUserThumbnail()
	{
		return profile ? profile.thumbnail : undefined
	},
	getTeamCount: getTeamCount, // async
	subscribe: subscribe
}