import popupAlert from '../plugins/popupAlert'

const modules = {
	weapons: {
		boomram( vehicle )
		{
			return _.findIndex( vehicle.weapons, [ 'slug', 'boomram' ] ) === -1
		}
	},
	upgrades: {
		crew( vehicle )
		{
			return vehicle.crew < vehicle.maxCrew
		},
		tracks( vehicle )
		{
			return vehicle.slug !== 'gyrocopter' && vehicle.slug !== 'helicopter' && vehicle.slug !== 'tank'
		}
	},
	perks: {}
}

export default {
	/**
	 * Determine if extras are allowed for a particular vehicle
	 *
	 * @param vehicle
	 * @param extraType
	 * @param vehicleExtra
	 */
	validateExtra( vehicle, extraType, vehicleExtra )
	{
		const extraModule = modules[ extraType ][ vehicleExtra.slug ]
		if( extraModule )
		{
			return extraModule( vehicle )
		}

		return true
	}
}