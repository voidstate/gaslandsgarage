'use strict'

import Cookies from 'js-cookie'

const bgClasses = new Map( [
	[ 1, 'landscape' ],
	[ 2, 'dark' ],
	[ 3, 'bright' ],
	[ 4, 'light' ],
	[ 5, 'chrome' ],
	[ 6, 'animated' ] ] )

let currentBgIndex = 0

export default {
	initBackground()
	{
		const savedBg = Cookies.get( 'background' ) || 1
		this.setBackground( savedBg )
	},
	setBackground( index )
	{
		index = parseInt( index )

		if ( index > bgClasses.size )
		{
			console.warn( 'Invalid background' )
			Cookies.set( 'background', null )
			return
		}

		bgClasses.forEach( ( className, classIndex ) =>
		{
			if ( index === classIndex )
			{
				document.body.classList.add( className + '-bg' )
			}
			else
			{
				document.body.classList.remove( className + '-bg' )
			}
		} )

		// save in memory
		currentBgIndex = index

		// save in cookie
		Cookies.set( 'background', currentBgIndex )
	},
	toggleBackground()
	{
		let index = currentBgIndex + 1
		if ( index > bgClasses.size )
		{
			index = 1
		}
		this.setBackground( index )
	}
}