const modules = {
	sponsors: {
		idris( vehicle )
		{

		}
	},
	vehicles: {},
	weapons: {},
	upgrades: {
		armour( vehicle )
		{
			vehicle.hull += 2
			return vehicle
		},
		extracrew( vehicle )
		{
			vehicle.crew++

			if ( vehicle.crew > vehicle.maxCrew )
			{
				vehicle.crew = vehicle.maxCrew
			}

			return vehicle
		},
		prisoncar( vehicle )
		{
			vehicle.hull -= 2
			vehicle.cost -= 4
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

			if ( vehicle.maxGear > 6 )
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
		if ( vehicleModule )
		{
			vehicle = vehicleModule( vehicle )
		}

		if ( vehicle.sponsor )
		{
			let sponsorModule = modules.sponsors[ vehicle.sponsor.slug ]
			if ( sponsorModule )
			{
				vehicle = sponsorModule( vehicle )
			}
		}

		// loop through "extras" within that vehicle, passing vehicle to found modules
		for ( let extraType of extraTypes )
		{
			for ( let vehicleExtra of vehicle[ extraType ] )
			{
				let extraModule = modules[ extraType ][ vehicleExtra.slug ]
				if ( extraModule )
				{
					vehicle = extraModule( vehicle )
				}
			}
		}

		return vehicle
	}
}