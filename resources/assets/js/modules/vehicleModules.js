import popupAlert from '../plugins/popupAlert'

const bombAwayPerk = ( vehicle, extra, extraIndex ) =>
{
	if( vehicle.slug === 'gyrocopter' || vehicle.slug === 'helicopter' )
	{
		vehicle[ 'weapons' ][ extraIndex ].cost = 0
	}

	return vehicle
}

const modules = {
	sponsors: {},
	vehicles: {},
	weapons: {
		oil( vehicle, extra, extraIndex )
		{
			return bombAwayPerk( ...arguments )
		},
		caltrops( vehicle, extra, extraIndex )
		{
			return bombAwayPerk( ...arguments )
		},
		glue( vehicle, extra, extraIndex )
		{
			return bombAwayPerk( ...arguments )
		},
		mines( vehicle, extra, extraIndex )
		{
			return bombAwayPerk( ...arguments )

		},
		smoke( vehicle, extra, extraIndex )
		{
			return bombAwayPerk( ...arguments )
		}
	},
	upgrades: {
		armour( vehicle )
		{
			vehicle.hull += 2
			return vehicle
		},
		crew( vehicle )
		{
			vehicle.crew++

			if( vehicle.crew > vehicle.maxCrew )
			{
				vehicle.crew = vehicle.maxCrew

				popupAlert.alert( 'warning', 'Maximum crew of ' + vehicle.maxCrew + ' exceeded. Please remove the extra upgrades.Janet' +
					'' )
			}

			return vehicle
		},
		prisoncar( vehicle )
		{
			vehicle.hull -= 2
			return vehicle
		},
		tracks( vehicle )
		{
			vehicle.maxGear--
			vehicle.handling++
			return vehicle
		}
	},
	perks: {
		expertise( vehicle )
		{
			vehicle.handling++
			return vehicle
		},
		nuclearengine( vehicle )
		{
			vehicle.maxGear++

			if( vehicle.maxGear > 6 )
			{
				vehicle.maxGear = 6
			}

			return vehicle
		}
	}
}

const extraTypes = [ 'weapons', 'upgrades', 'perks' ]

export default {
	/**
	 * Use vehicles.map to modify multiple vehicles
	 *
	 * @param vehicle
	 */
	applyModules( vehicle )
	{
		vehicle = _.cloneDeep( vehicle ) // don't modify original if from Vue $data

		let vehicleModule = modules.vehicles[ vehicle.slug ]
		if( vehicleModule )
		{
			vehicle = vehicleModule( vehicle )
		}

		if( vehicle.sponsor )
		{
			let sponsorModule = modules.sponsors[ vehicle.sponsor.slug ]
			if( sponsorModule )
			{
				vehicle = sponsorModule( vehicle )
			}
		}

		// loop through "extras" within that vehicle, passing vehicle to found modules
		for( let extraType of extraTypes )
		{
			for( const [ vehicleExtraIndex, vehicleExtra ] of vehicle[ extraType ].entries() )
			{
				let extraModule = modules[ extraType ][ vehicleExtra.slug ]
				if( extraModule )
				{
					vehicle = extraModule( vehicle, vehicleExtra, vehicleExtraIndex )
				}
			}
		}

		return vehicle
	}
}