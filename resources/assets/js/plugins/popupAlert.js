/**
 * Vue plugin for showing popup alerts.
 *
 * @usage Vue.popupAlert.alert( 'danger', 'Perk already added' )
 * @see https://vuejs.org/v2/guide/plugins.html
 */

const allowedContexts = [
	'primary', 'success', 'danger', 'warning', 'info'
]

const prefixMessage = ( context, message ) =>
{
	if( context === 'danger' || context === 'warning' )
	{
		return '<i class="fas fa-exclamation-triangle"></i> ' + message
	}
	else if( context === 'info' )
	{
		return '<i class="fas fa-info-circle"></i> ' + message
	}
	else if( context === 'success' )
	{
		return '<i class="fas fa-check-circle"></i> ' + message
	}

	return message
}

const switchContext = ( modalDialog, context ) =>
{
	if( !modalDialog.hasClass( `popup-alert-${ context }` ) )
	{
		for( const allowedContext of allowedContexts )
		{
			modalDialog.removeClass( `popup-alert-${ allowedContext }` )
		}
		modalDialog.addClass( `popup-alert-${ context }` )
	}
}

const showAlert = ( context, message ) =>
{
	const modal       = $( '#alertModal' ),
	      modalDialog = modal.find( '.modal-dialog' ),
	      modalTitle  = modal.find( '.modal-title' )

	if( !allowedContexts.includes( context ) )
	{
		console.error( 'Unknown context: ' + context )
		return
	}

	// start hidden
	modal.modal( 'hide' )

	// add icon
	message = prefixMessage( context, message )

	modalTitle.html( message )

	// switch context
	switchContext( modalDialog, context )

	modal.modal( 'show' )

	if( context !== 'danger' && context !== 'warning' )
	{
		window.setTimeout( () => modal.modal( 'hide' ), 2500 )
	}
}

const showConfirm = ( message, actions = { ok: 'OK' } ) =>
{
	const modal       = $( '#confirmModal' ),
	      modalBody   = modal.find( '.modal-body' ),
	      modalFooter = modal.find( '.modal-footer' )

	// start hidden
	modal.modal( 'hide' )

	modalBody.text( message )

	// add buttons
	let actionButtons = {}
	_.forIn( actions, ( label, key ) =>
	{
		actionButtons[ key ] = $( `<button type="button" class="btn btn-primary ${ key }-btn">${ label }</button>` ).prependTo( modalFooter )
	} )

	// remove when hidden
	modal.on( 'hidden.bs.modal', () =>
	{
		// remove buttons
		_.forIn( actionButtons, ( actionButton ) =>
		{
			actionButton.remove()
		} )

		// unbind event
		modal.off( 'hidden.bs.modal' )
	} )

	modal.modal( 'show' )

	return new Promise( ( resolve, reject ) =>
	{
		// wire up actions (OK by default)
		_.forIn( actionButtons, ( actionButton, key ) =>
		{
			actionButton.on( 'click.confirm', () =>
			{
				modal.modal( 'hide' )

				resolve( key )
			} )
		} )
	} )
}

const vueModule = {
	install( Vue )
	{
		Vue.popupAlert = {
			alert: showAlert,
			confirm: showConfirm
		}
	}
}

export default {
	vueModule: vueModule,
	alert: showAlert,
	confirm: showConfirm
}