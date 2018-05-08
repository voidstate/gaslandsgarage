<template>
	<div class="team">
		<team-details
				v-bind:name="name"
				v-bind:sponsor="sponsor"
				v-bind:cost="cost"
				v-bind:maxCost="maxCost"
				v-on:nameChanged="onNameChanged"
				v-on:sponsorChanged="onSponsorChanged"
				v-on:maxCostChanged="onMaxCostChanged"></team-details>
		<new-vehicle-button
				v-on:selected="onVehicleAdded"
				v-bind:sponsor="sponsor"></new-vehicle-button>
		<draggable v-model="vehicles" v-on:start="onVehicleDragStart" v-on:end="onVehicleDragEnd" class="row">
			<vehicle v-for="(vehicleData, index) in vehicles"
			         v-bind:vehicleData="vehicleData"
			         v-bind:sponsor="sponsor"
			         v-bind:accordionOpen="accordionsOpen"
			         :key="vehicleData.uid"
			         v-on:updated="onVehicleUpdated( index, $event )"
			         v-on:deleted="onVehicleDeleted( index )"></vehicle>
		</draggable>
	</div>
</template>

<script>
	import Vehicle from './Vehicle.vue'
	import NewVehicleButton from './NewVehicleButton.vue'
	import TeamDetails from './TeamDetails.vue'

	import eventBus from '../modules/eventBus'
	import vehicleDataBuilder from '../modules/vehicleDataBuilder'
	import auth from '../modules/auth'

	import Cookies from 'js-cookie'
	import draggable from 'vuedraggable'

	const getData = function ()
	{
		let data

		if( window.location.hash )
		{
			try
			{
				let hash     = window.location.hash.match( /\#(.*)/ )[ 1 ],
				    hydrated = vehicleDataBuilder.deserialize( hash )

				if( !hydrated )
				{
					throw new Error( 'Failed to hydrate' )
				}
				data = hydrated
			}
			catch( err )
			{
				Vue.popupAlert.alert( 'danger', 'Team stored in web address not recognised. Have you pasted it all in?' )
				console.error( err )
				data = vehicleDataBuilder.baseTeamData()
			}
		}
		else
		{
			data = vehicleDataBuilder.baseTeamData()
		}

		data.accordionsOpen = Cookies.get( 'accordionsOpen' ) || false

		return data
	}

	export default {
		name: 'Team',
		mounted()
		{
			// listen for events
			eventBus.$on( 'team.reset', this.onResetTeam )
			eventBus.$on( 'team.save', this.onSave )
			eventBus.$on( 'team.load', this.onLoad )
			eventBus.$on( 'team.toggle-accordions', this.onToggleAccordions )

			setTimeout( () => this.emitSummary(), 100 )
		},
		updated()
		{
			this.$nextTick( () =>
			{
				const serialized = vehicleDataBuilder.serialize( this.$data )
				history.pushState( null, null, '#' + serialized )
			} )
		},
		components: {
			vehicle: Vehicle,
			'new-vehicle-button': NewVehicleButton,
			'team-details': TeamDetails,
			draggable
		},
		data()
		{
			return getData()
		},
		computed: {
			cost()
			{
				return _.sumBy( this.vehicles, vehicle => vehicleDataBuilder.getVehicleCost( vehicle, this.sponsor ? this.sponsor.slug : null ) )
			},
			sponsorSlug()
			{
				return this.sponsor ? this.sponsor.slug : null
			}
		},
		watch: {
			name()
			{
				this.emitSummary()
			},
			cost()
			{
				this.emitSummary()
			}
		},
		methods: {
			emitSummary()
			{
				eventBus.$emit( 'team.summary-changed', {
					name: this.name,
					cost: this.cost
				} )
			},
			onLoad( id )
			{
				axios.get( '/garage/load/' + auth.getUserId() + '/' + id )
					.then( response =>
					{
						const hydrated = vehicleDataBuilder.hydrate( JSON.parse( response.data.team ) )

						Object.keys( hydrated ).forEach( ( key ) =>
						{
							this[ key ] = hydrated[ key ]
						} )

						eventBus.$emit( 'garage.hide' )
						Vue.popupAlert.alert( 'success', 'Team loaded' )
					} )
					.catch( error =>
					{
						eventBus.$emit( 'garage.hide' )
						Vue.popupAlert.alert( 'danger', 'Failed to load teams. Error: ' + error )
					} )
			},
			onSave()
			{
				if( !auth.isLoggedIn() )
				{
					Vue.popupAlert.alert( 'warning', 'Please log in to save this team.' )
					return
				}

				if( !this.vehicles.length )
				{
					Vue.popupAlert.alert( 'warning', 'Please add some vehicles to your team.' )
					return
				}

				if( !this.name || this.name === 'New Team' )
				{
					Vue.popupAlert.alert( 'warning', 'Please name your team. Click on the name to change it.' )
					return
				}

				let vehicleNames = []

				for( const vehicle of this.vehicles )
				{
					vehicleNames.push( (vehicle.label || vehicle.name) + ' (' + vehicleDataBuilder.getVehicleCost( vehicle, this.sponsorSlug ) + ')' )
				}

				let counts = {};
				vehicleNames.forEach( vehicleName =>
				{
					counts[ vehicleName ] = (counts[ vehicleName ] || 0) + 1;
				} );

				let vehicleNamesWithCount = []
				_.forIn( counts, ( count, vehicleName ) =>
				{
					vehicleNamesWithCount.push( vehicleName + (count > 1 ? ' x' + count : '') )
				} )

				const saveTeam = ( url ) =>
				{
					return axios.post( url, {
							id: this.id,
							user_id: auth.getUserId(),
							name: this.name,
							sponsor: this.sponsorSlug,
							cost: this.cost,
							max_cost: this.maxCost,
							vehicle_names: vehicleNamesWithCount.join( ', ' ),
							vehicle_count: this.vehicles.length,
							dehydrated: JSON.stringify( vehicleDataBuilder.dehydrate( this.$data ) )
						}
					)
				}

				Vue.popupAlert.confirm( 'Are you sure you want to save the current team?' )
					.then( () =>
					{
						saveTeam( '/garage/save' )
							.then( response =>
							{
								Vue.popupAlert.alert( 'success', this.name + ' team saved successfully.' )

								this.id = response.data.id

								eventBus.$emit( 'garage.changed' )
							} )
							.catch( error =>
								{
									// duplicate
									if( error.response.status === 418 )
									{
										Vue.popupAlert.confirm( 'This appears to be a duplicate team. Do you want to edit the existing team or create a new one?',
											{
												edit: 'Edit Existing',
												create: 'Create New'
											} )
											.then( ( action ) =>
											{
												if( action === 'edit' || action === 'create' )
												{
													saveTeam( '/garage/save/' + action )
														.then( response =>
														{
															Vue.popupAlert.alert( 'success', this.name + ' team saved successfully.' )

															this.id = response.data.id
														} )
														.catch( error =>
														{
															console.error( error )
															Vue.popupAlert.alert( 'danger', 'Cannot save team. Server error ' + error.response.status + '.' )
														} )

												}
												else
												{
													console.error( 'Invalid confirm action: ' + action )
												}
											} )
									}
									// validation
									else if( error.response.status === 422 )
									{
										let errorMessages = []
										for( const key in error.response.data.errors )
										{
											for( const errorMessage of error.response.data.errors[ key ] )
											{
												errorMessages.push( errorMessage )
											}
										}

										Vue.popupAlert.alert( 'danger', 'Cannot save team. Server validation error. ' + errorMessages.join( ' ' ) )
									}
									else
									{
										console.error( error )
										Vue.popupAlert.alert( 'danger', 'Cannot save team. Server error ' + error.response.status + '.' )
									}
								}
							)
					} )

			},
			onResetTeam()
			{
				this.resetTeam()
			},
			resetTeam()
			{
				_.forIn( vehicleDataBuilder.baseTeamData(), ( value, key ) =>
				{
					this[ key ] = value
				} )
			},
			onNameChanged( name )
			{
				this.name = name
			},
			onMaxCostChanged( maxCost )
			{
				this.maxCost = maxCost
			},
			onSponsorChanged( sponsor )
			{
				this.sponsor = sponsor

				// remove illegal vehicles
				if( this.hasSponsor )
				{
					let numVehicles = this.vehicles.length

					this.vehicles = this.vehicles.filter( ( vehicle ) =>
					{
						return vehicle.sponsors.length === 0 || vehicle.sponsors.includes( this.sponsorSlug )
					} )

					let newNumVehicles = this.vehicles.length
					if( newNumVehicles !== numVehicles )
					{
						Vue.popupAlert.alert( 'danger', (numVehicles - newNumVehicles) + ' illegal vehicles removed.' )
					}
				}
			},
			onVehicleAdded( baseVehicleData )
			{
				let vehicle = vehicleDataBuilder.vehicleFromBase( baseVehicleData )
				this.vehicles.push( vehicle )
			},
			onVehicleUpdated( index, vehicle )
			{
				this.vehicles[ index ] = vehicle
				this.$forceUpdate()
			},
			onVehicleDeleted( index )
			{
				this.vehicles.splice( index, 1 )
			},
			onToggleAccordions()
			{
				this.accordionsOpen = !this.accordionsOpen

				Cookies.set( 'accordionsOpen', this.accordionsOpen )

				Vue.popupAlert.alert( 'info', 'Accordions will now ' + (this.accordionsOpen ? 'remain open' : 'open and close when clicked') + '.' )
			},
			onVehicleDragStart( evt )
			{
				$( '.vehicle' ).removeClass( 'animated' )
			},
			onVehicleDragEnd()
			{
				$( '.vehicle' ).addClass( 'animated' )
			}
		}
	}
</script>

