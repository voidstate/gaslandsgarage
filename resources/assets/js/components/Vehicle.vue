<template>
	<div v-bind:id="'vehicle_' + this.uid" ref="container" class="vehicle col-sm-6 col-lg-4 col-xl-3 animated slideInRight">
		<div class="card card-default">
			<div class="card-header vehicle-card-header">
				<div class="float-right close-button d-print-none" v-on:click="deleteVehicle">
					<i class="fas fa-times"></i>
				</div>
				<div class="more-button btn-group dropright d-print-none">
					<div data-toggle="dropdown">
						<i class="fas fa-ellipsis-h btn-icon"></i>
					</div>
					<div class="more-dropdown-menu dropdown-menu px-2">
						<div class="duplicate-button d-inline-block"
						     data-toggle="tooltip"
						     data-placement="bottom"
						     title="Duplicate vehicle"
						     v-on:click="duplicateVehicle">
							<i class="fas fa-copy"></i>
						</div>
						<div class="picker-button d-inline-block pl-2"
						     data-toggle="tooltip"
						     data-placement="bottom"
						     title="Vehicle colours"
						     v-on:click="changeColours">
							<i class="fas fa-eye-dropper"></i>
						</div>
					</div>
				</div>
				<div class="cost-badge">
					<span class="badge badge-dark">
						<img src="/images/icons/drum.svg" alt="Can">
						{{ cost }} cans
					</span>
				</div>
				<div class="slots-badge d-print-none" v-bind:class="{ 'slots-overspent' : slotsOverspent }">
					<span class="badge badge-dark">
						<i class="fas fa-cog slots-icon"></i>
						{{ slots }}/{{ maxSlots }} slots
					</span>
				</div>
				<div class="stripes"
				     v-show="showStripes">
					<div class="edge-stripe left"></div>
					<div class="foreground-stripe"
					     v-bind:style="{ 'background-color': vehicleData.colours.foreground }"></div>
					<div class="edge-stripe center"></div>
					<div class="background-stripe"
					     v-bind:style="{ 'background-color': vehicleData.colours.background }"></div>
					<div class="edge-stripe right"></div>
				</div>
				<h4 v-show="!editingLabel" v-on:click="editLabel" class="vehicle-label">{{ currentLabel }}</h4>
				<div class="edit-name-container mb-2" v-show="editingLabel">
					<input class="edit-name-input form-control"
					       maxlength="30"
					       placeholder="New name..."
					       ref="editLabelInput"
					       v-model="newLabel"
					       v-on:keyup.enter="doneEditingLabel"
					       v-on:keyup.esc="cancelEditingLabel"
					       v-on:blur="cancelEditingLabel">
				</div>
				<div v-show="hasNewLabel">
					{{ vehicleData.name }}
				</div>
				<div class="d-none d-print-block mt-1">
					{{ weight }}
				</div>
			</div>

			<div class="card-body vehicle-stats">
				<div class="row">
					<div class="col">
						<button
								class="btn btn-sm btn-block btn-primary"
								data-toggle="tooltip"
								data-placement="auto"
								title="Hull">
							<img src="/images/icons/shield.svg" class="btn-svg shield-svg"> {{ modifiedVehicleData.hull }}
						</button>
					</div>
					<div class="col">
						<button href="#"
						        class="btn btn-sm btn-block btn-primary"
						        data-toggle="tooltip"
						        data-placement="auto"
						        title="Crew"><i class="fas fa-users btn-icon"></i> {{ modifiedVehicleData.crew }}
						</button>
					</div>
					<div class="col">
						<button href="#"
						        class="btn btn-sm btn-block btn-primary"
						        data-toggle="tooltip"
						        data-placement="auto"
						        title="Handling">
							<i class="fas fa-dice btn-icon"></i> {{ modifiedVehicleData.handling }}
						</button>
					</div>
					<div class="col">
						<button href="#"
						        class="btn btn-sm btn-block btn-primary"
						        data-toggle="tooltip"
						        data-placement="auto"
						        title="Max Gear">
							<img src="/images/icons/gears.svg" class="btn-svg gears-svg"> {{ modifiedVehicleData.maxGear }}
						</button>
					</div>
				</div>
			</div>

			<div class="card-body vehicle-buttons d-print-none">

				<!-- Upgrade buttons -->
				<div class="btn-group d-flex">

					<div class="btn-group w-100">
						<button type="button"
						        class="btn btn-secondary dropdown-toggle w-100"
						        data-toggle="dropdown">

							<span class="d-none d-md-inline">
								<i class="fas fa-plus-square btn-icon"></i>
							</span>

							Weapon
						</button>
						<div class="dropdown-menu scrollable-dropdown-menu">
							<a v-for="(weapon, index) in weaponOptions"
							   :key="index"
							   class="dropdown-item"
							   href="#"
							   v-on:click.prevent="addWeapon(weapon, true)"
							   data-toggle="tooltip"
							   data-placement="right"
							   data-html="true"
							   data-boundary="window"
							   v-bind:title="'Type: ' + weapon.type + '<br>Attack: ' + weapon.attack + '<br>Range: ' + weapon.range + '<br>Slots: ' + weapon.slots"> {{ weapon.name }} ({{ weapon.cost }}) </a>
						</div>
					</div>

					<div class="btn-group w-100">
						<button
								type="button"
								class="btn btn-secondary dropdown-toggle w-100"
								data-toggle="dropdown">

							<span class="d-none d-md-inline">
								<i class="fas fa-plus-square btn-icon"></i>
							</span>

							Upgrade
						</button>
						<div class="dropdown-menu scrollable-dropdown-menu">
							<a v-for="(upgrade, index) in upgradeOptions"
							   :key="index"
							   class="dropdown-item"
							   href="#"
							   v-on:click.prevent="addUpgrade(upgrade, true)"
							   data-toggle="tooltip"
							   data-placement="right"
							   data-html="true"
							   data-boundary="window"
							   v-bind:title="'Slots: ' + upgrade.slots"> {{ upgrade.name }} ({{ upgrade.cost }}) </a>
						</div>
					</div>

					<div class="btn-group w-100">
						<button v-bind:disabled="!hasSponsor && !allowAllPerks"
						        type="button"
						        class="btn btn-secondary dropdown-toggle w-100"
						        data-toggle="dropdown">

							<span class="d-none d-md-inline">
								<i class="fas fa-plus-square btn-icon"></i>
							</span>

							Perk
						</button>
						<div class="dropdown-menu scrollable-dropdown-menu">
							<a v-for="(perk, index) in perkOptions"
							   :key="index"
							   class="dropdown-item"
							   href="#"
							   v-on:click.prevent="addPerk(perk, true)"
							   data-toggle="tooltip"
							   data-placement="left"
							   data-html="true"
							   data-boundary="window"
							   v-bind:title="perk.description[ $descriptionMode ]"> {{ perk.name }} ({{ perk.cost }}) </a>
						</div>
					</div>
				</div>
				<!-- /Upgrade buttons -->

			</div>

			<div class="card-body vehicle-hull-boxes d-none d-print-block pb-2">
				<div class="vehicle-hull-box border d-inline-block mr-1" v-for="n in modifiedVehicleData.hull"></div>
			</div>

			<div class="card-body vehicle-extras">

				<!-- Accordion -->
				<div v-bind:id="'vehicleAccordion_' + this.uid">

					<!-- Weapons -->
					<div class="card" v-show="hasWeapons">
						<div class="card-header">
							<div class="accordion-header mb-0"
							     data-toggle="collapse"
							     v-bind:data-target="'#vehicleWeaponCardBody_' + this.uid"
							     v-on:click="onAccordionClick">
								<button class="btn btn-link">
									Weapons
								</button>
								<span class="item-count-badge badge badge-dark">{{ numWeapons }} weapon<span v-show="numWeapons !== 1">s</span></span>
							</div>
						</div>
						<div v-bind:id="'vehicleWeaponCardBody_' + this.uid"
						     v-bind:data-parent="'#vehicleAccordion_' + this.uid"
						     v-bind:class="{ 'd-block': accordionOpen }"
						     class="collapse d-print-block">
							<div class="card-body">
								<div class="table-responsive">
									<table class="table table-sm table-dark">
										<thead class="thead-dark">
										<tr>
											<th scope="col"></th>
											<th scope="col">Attack</th>
											<th scope="col">Range</th>
											<th scope="col">Ammo</th>
											<th scope="col">
												<i class="fas fa-cog cost-icon"></i>
											</th>
											<th scope="col">
												<img src="/images/icons/drum.svg" alt="Cans" class="svg-icon">
											</th>
											<th scope="col" class="d-print-none"></th>
										</tr>
										</thead>
										<tbody>

										<template v-for="(weapon, index) in modifiedVehicleData.weapons">
											<tr>
												<th scope="row">
													{{ weapon.name}}
													<facing-button v-if="upgradeHasFacing( 'weapons', weapon )"
													               v-bind:extra="weapon"
													               v-on:changed="onFacingChanged( 'weapons', index, $event )"></facing-button>
													<war-rig-location-button v-if="upgradeHasWarRigLocation( 'weapons', weapon )"
													                         v-bind:extra="weapon"
													                         v-on:changed="onWarRigLocationChanged( 'weapons', index, $event )"></war-rig-location-button>
												</th>
												<td>{{ weapon.attack || '–'}}</td>
												<td>{{ weapon.range}}</td>
												<td>{{ weapon.ammo || '&#8734;' }}</td>
												<td>{{ weapon.slots}}</td>
												<td>{{ getWeaponCost( weapon ) || 'free' }}</td>
												<td class="text-right d-print-none">
												<span class="close-button" v-if="weapon.removable" v-on:click="removeWeapon( index )">
													<i class="fas fa-times"></i>
												</span>
												</td>
											</tr>
											<tr v-if="weapon.specials.length !== 0" class="specials-row">
												<td class="small" colspan="7" v-html="getExtraSpecialsList( weapon )"></td>
											</tr>
											<tr class="d-none d-print-table-row" v-if="weapon.ammo">
												<th></th>
												<td class="text-left" colspan="6">
													<div class="card-body vehicle-ammo-boxes d-none d-print-block pb-2">
														<div class="vehicle-ammo-box border d-inline-block mr-1" v-for="n in weapon.ammo"></div>
													</div>
												</td>
											</tr>
										</template>

										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
					<!-- /Weapons -->

					<!-- Upgrades -->
					<div class="card" v-show="hasUpgrades">
						<div class="card-header">
							<div class="mb-0 collapsed" data-toggle="collapse"
							     v-bind:data-target="'#vehicleUpgradeCardBody_' + this.uid"
							     v-on:click="onAccordionClick">
								<button class="btn btn-link">
									Upgrades
								</button>
								<span class="item-count-badge badge badge-dark">{{ numUpgrades }} upgrade<span v-show="numUpgrades !== 1">s</span></span>
							</div>
						</div>
						<div v-bind:id="'vehicleUpgradeCardBody_' + this.uid"
						     v-bind:data-parent="'#vehicleAccordion_' + this.uid"
						     v-bind:class="{ 'd-block': accordionOpen }"
						     class="collapse d-print-block">
							<div class="card-body">
								<table class="table table-sm table-dark">
									<thead class="thead-dark">
									<tr>
										<th scope="col"></th>
										<th scope="col">
											<i class="fas fa-cog cost-icon"></i>
										</th>
										<th scope="col">
											<img src="/images/icons/drum.svg" alt="Cans" class="svg-icon">
										</th>
										<th scope="col" class="d-print-none"></th>
									</tr>
									</thead>
									<tbody>

									<template v-for="(upgrade, index) in modifiedVehicleData.upgrades">
										<tr>
											<th scope="row">
												{{ upgrade.name}}
											</th>
											<td>{{ upgrade.slots}}</td>
											<td>{{ getUpgradeCost( upgrade ) || 'free' }}</td>
											<td class="text-right d-print-none">
											<span class="close-button" v-if="upgrade.removable" v-on:click="removeUpgrade( index )">
												<i class="fas fa-times"></i>
											</span>
											</td>
										</tr>
										<tr v-if="upgrade.specials.length !== 0" class="specials-row">
											<td class="small" colspan="5" v-html="getExtraSpecialsList( upgrade )"></td>
										</tr>
									</template>

									</tbody>
								</table>
							</div>
						</div>
					</div>
					<!-- /Upgrades -->

					<!-- Perks -->
					<div class="card" v-show="hasPerks">
						<div class="card-header">
							<div class="mb-0" data-toggle="collapse"
							     v-bind:data-target="'#vehiclePerkCardBody_' + this.uid"
							     v-on:click="onAccordionClick">
								<button class="btn btn-link">
									Perks
								</button>
								<span class="item-count-badge badge badge-dark float-right">{{ numPerks }} perk<span v-show="numPerks !== 1">s</span></span>
							</div>
						</div>
						<div v-bind:id="'vehiclePerkCardBody_' + this.uid"
						     v-bind:data-parent="'#vehicleAccordion_' + this.uid"
						     v-bind:class="{ 'd-block': accordionOpen }"
						     class="collapse d-print-block">
							<div class="card-body">
								<table class="table table-sm table-dark">
									<thead class="thead-dark">
									<tr>
										<th scope="col"></th>
										<th scope="col">
											<img src="/images/icons/drum.svg" alt="Cans" class="svg-icon">
										</th>
										<th scope="col" class="d-print-none"></th>
									</tr>
									</thead>
									<tbody>

									<template v-for="(perk, index) in modifiedVehicleData.perks">
										<tr>
											<th scope="row">
												{{ perk.name}}
											</th>
											<td>{{ perk.cost || 'free' }}</td>
											<td class="text-right d-print-none">
											<span class="close-button" v-if="perk.removable" v-on:click="removePerk( index )">
												<i class="fas fa-times"></i>
											</span>
											</td>
										</tr>
										<tr class="specials-row">
											<td class="small" colspan="4" v-html="perk.description[ $descriptionMode ]"></td>
										</tr>
									</template>

									</tbody>
								</table>
							</div>
						</div>
					</div>
					<!-- /Perks -->

					<!-- /Accordion -->
				</div>

			</div>
		</div>
	</div>
</template>

<script>
	import FacingButton from './FacingButton.vue'
	import WarRigLocationButton from './WarRigLocationButton.vue'

	import vehicleDataBuilder from '../modules/vehicleDataBuilder'
	import vehicleModules from '../modules/vehicleModules'
	import vehicleOptionValidator from '../modules/vehicleOptionValidators'

	const weaponData = vehicleDataBuilder.weaponData()
	const upgradeData = vehicleDataBuilder.upgradeData()
	const perkData = vehicleDataBuilder.perkData()

	export default {
		mounted()
		{
			// everyone gets a handgun
			if ( !_.find( this.vehicleData.weapons, { 'slug': 'handgun' } ) )
			{
				this.addWeapon( weaponData[ 0 ], false )
			}

			this.makeTooltips()
		},
		components: {
			'facing-button': FacingButton,
			'war-rig-location-button': WarRigLocationButton
		},
		props: [
			'vehicleData',
			'sponsor',
			'allowAllPerks',
			'accordionOpen'
		],
		data()
		{
			return {
				uid: this.vehicleData.uid,
				maxSlots: this.vehicleData.slots,
				newLabel: '',
				editingLabel: false
			}
		},
		computed: {
			modifiedVehicleData()
			{
				return vehicleModules.applyModules( this.vehicleData )
			},
			hasSponsor()
			{
				return !!this.sponsor
			},
			sponsorSlug()
			{
				return this.hasSponsor ? this.sponsor.slug : undefined
			},
			cost()
			{
				return vehicleDataBuilder.getVehicleCost( this.modifiedVehicleData, this.sponsorSlug )
			},
			slots()
			{
				return _.sumBy( this.vehicleData.weapons, weapon => weapon.slots ) +
					_.sumBy( this.vehicleData.upgrades, upgrade => upgrade.slots )
			},
			slotsOverspent()
			{
				return this.maxSlots - this.slots < 0
			},
			currentLabel()
			{
				return this.vehicleData.label || this.vehicleData.name
			},
			hasNewLabel()
			{
				return this.vehicleData.label !== this.vehicleData.name
			},
			weaponOptions()
			{
				return _.filter( weaponData, weapon =>
				{
					return this.extraHasSponsor( weapon ) &&
						vehicleOptionValidator.validateExtra( this.modifiedVehicleData, 'weapons', weapon )
				} )
			},
			upgradeOptions()
			{
				return _.filter( upgradeData, upgrade =>
				{
					return this.extraHasSponsor( upgrade ) &&
						(upgrade.weights.length === 0 || upgrade.weights.includes( this.vehicleData.weight )) &&
						(upgrade.vehicles.length === 0 || upgrade.vehicles.includes( this.vehicleData.slug )) &&
						vehicleOptionValidator.validateExtra( this.modifiedVehicleData, 'upgrades', upgrade )
				} )
			},
			perkOptions()
			{
				if ( this.allowAllPerks )
				{
					return perkData
				}

				return _.filter( perkData, perk =>
				{
					return this.extraHasSponsor( perk ) &&
						(perk.weights.length === 0 || perk.weights.includes( this.vehicleData.weight ))
				} )
			},
			hasWeapons()
			{
				return this.vehicleData.weapons.length !== 0
			},
			hasUpgrades()
			{
				return this.vehicleData.upgrades.length !== 0
			},
			hasPerks()
			{
				return this.vehicleData.perks.length !== 0
			},
			numWeapons()
			{
				return this.vehicleData.weapons.length
			},
			numUpgrades()
			{
				return this.vehicleData.upgrades.length
			},
			numPerks()
			{
				return this.vehicleData.perks.length
			},
			weight()
			{
				return _.upperFirst( this.vehicleData.weight )
			},
			showStripes()
			{
				return this.vehicleData.colours.foreground !== null && this.vehicleData.colours.background !== null
			}
		},
		watch: {
			vehicleData: {
				handler: function ( newValue )
				{
					this.$emit( 'updated', this.vehicleData )
				},
				deep: true
			},
			weaponOptions()
			{
				this.makeTooltips()
			},
			upgradeOptions()
			{
				this.makeTooltips()
			},
			perkOptions()
			{
				setTimeout( () => this.rebuildTooltips(), 50 )
			},
			slotsOverspent( newValue, oldValue )
			{
				if ( newValue && !oldValue )
				{
					Vue.popupAlert.alert( 'warning', 'Too many slots used.' )
				}
			}
		},
		methods: {
			deleteVehicle()
			{
				this.$emit( 'deleted' )
			},
			duplicateVehicle()
			{
				this.$emit( 'duplicated' )
			},
			editLabel()
			{
				// replace name with input
				this.editingLabel = true

				// focus doesn't work without a timeout
				window.setTimeout( () => this.$refs.editLabelInput.focus(), 10 )
			},
			doneEditingLabel()
			{
				this.vehicleData.label = this.newLabel
				this.editingLabel = false
			},
			cancelEditingLabel()
			{
				this.editingLabel = false
			},
			addWeapon( weapon, removable )
			{
				// can this weapon be removed
				weapon.removable = removable

				this.vehicleData.weapons.push( _.cloneDeep( weapon ) )

				$( '#vehicleWeaponCardBody_' + this.uid ).collapse( 'show' )

				this.hideTooltips()
			},
			removeWeapon( index )
			{
				this.vehicleData.weapons.splice( index, 1 )
			},
			getWeaponCost( weapon )
			{
				return vehicleDataBuilder.getExtraCost( 'weapons', weapon )
			},
			/*getUpgradeOptions()
			{
				return _.filter( upgradeData, upgrade =>
				{
					return this.extraHasSponsor( upgrade ) &&
						(upgrade.weights.length === 0 || upgrade.weights.includes( this.vehicleData.weight )) &&
						vehicleOptionValidator.validateExtra( this.modifiedVehicleData, 'upgrades', upgrade )
				} )
			},*/
			addUpgrade( upgrade, removable )
			{
				// can this upgrade be removed
				upgrade.removable = removable

				this.vehicleData.upgrades.unshift( upgrade )

				$( '#vehicleUpgradeCardBody_' + this.uid ).collapse( 'show' )

				this.hideTooltips()
			},
			removeUpgrade( index )
			{
				this.vehicleData.upgrades.splice( index, 1 )
			},
			getUpgradeCost( upgrade )
			{
				return vehicleDataBuilder.getExtraCost( 'upgrades', upgrade, this.sponsorSlug )
			},
			upgradeHasFacing( extraType, upgrade )
			{
				if ( extraType === 'weapons' )
				{
					return (upgrade.type === 'shooting' && !upgrade.specials.includes( 'Crew Fired' ) && upgrade.slug !== 'thumper') ||
						upgrade.type === 'smash' ||
						upgrade.type === 'dropped'
				}

				/*if( extraType === 'upgrades' )
				{
					return upgrade.slug === 'armour'
				}*/

				return false
			},
			upgradeHasWarRigLocation( extraType, upgrade )
			{
				return this.vehicleData.slug === 'warrig' && extraType === 'weapons' && upgrade.slug !== 'handgun'
			},
			addPerk( perk, removable )
			{
				// can only buy each perk once
				if ( _.find( this.vehicleData.perks, { 'slug': perk.slug } ) )
				{
					Vue.popupAlert.alert( 'danger', `Perk already added: ${ perk.name }` )
					return
				}

				// can this perk be removed
				perk.removable = removable

				// vehicle perks are free
				if ( perk.cost === undefined )
				{
					perk.cost = 0
				}

				this.vehicleData.perks.push( perk )

				$( '#vehiclePerkCardBody_' + this.uid ).collapse( 'show' )

				this.hideTooltips()
			},
			removePerk( index )
			{
				this.vehicleData.perks.splice( index, 1 )
			},
			getExtraSpecialsList( extra )
			{
				let formatted = []

				extra.specials.forEach( special =>
				{
					// handle text descriptions (use cookie to enable full - see app.js)
					if ( _.isObject( special ) )
					{
						special = special[ this.$descriptionMode ]
					}

					formatted.push( special )
				} )

				return formatted.join( ', ' )
			},
			extraHasSponsor( item )
			{
				return item.sponsors.length === 0 || // empty sponsor property means any sponsor can use it
					(this.hasSponsor && item.sponsors.includes( this.sponsorSlug ))
			},
			makeTooltips()
			{
				$( '[data-toggle="tooltip"]', this.$refs.container ).tooltip()
			},
			hideTooltips()
			{
				$( '[data-toggle="tooltip"]', this.$refs.container ).tooltip( 'hide' )
			},
			rebuildTooltips()
			{
				$( '[data-toggle="tooltip"]', this.$refs.container ).tooltip( 'dispose' )
				$( '[data-toggle="tooltip"]', this.$refs.container ).tooltip()
			},
			onFacingChanged( extraType, index, facing )
			{
				this.vehicleData[ extraType ][ index ].facing = facing
			},
			onWarRigLocationChanged( extraType, index, location )
			{
				console.log( 'onWarRigLocationChanged', extraType, index, location )

				console.log( 'pre', this.vehicleData[ extraType ][ index ].location )
				this.vehicleData[ extraType ][ index ].location = location
				console.log( 'post', this.vehicleData[ extraType ][ index ].location )
			},
			// disable Bootstrap event by cancelling propagation
			onAccordionClick( event )
			{
				if ( this.accordionOpen )
				{
					event.stopPropagation()
				}
			},
			changeColours()
			{
				this.$emit( 'changeColours' )
			}
		}
	}
</script>
