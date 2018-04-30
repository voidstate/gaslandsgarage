<template>
	<div class="new-vehicle-button d-print-none" ref="newVehicleButtonContainer">
		<div class="btn-group">
			<button type="button" class="btn btn-primary" v-bind:disabled="!hasCurrentVehicle" v-on:click="useCurrentVehicle">{{ currentVehicle ? 'Add ' + currentVehicle.name : 'Add Vehicle' }}</button>
			<button type="button" class="btn btn-primary dropdown-toggle dropdown-toggle-split" data-toggle="dropdown"></button>
			<div class="dropdown-menu" ref="dropdownMenu">
				<a v-for="(vehicle, index) in vehicleOptions"
				   v-bind:item="vehicle"
				   v-bind:key="index"
				   class="dropdown-item"
				   href="#"
				   v-on:click.prevent="selectVehicle(vehicle)"
				   data-toggle="tooltip"
				   data-placement="auto"
				   data-html="true"
				   v-bind:title="'Cost: ' + vehicle.cost + '<br>Build slots: ' + vehicle.slots + '<br>Crew: ' + vehicle.crew + '<br>Handling: ' + vehicle.handling + '<br>Hull: ' + vehicle.hull + '<br>Max Gear: ' + vehicle.maxGear + '<br>Weight: ' + vehicle.weight"> {{ vehicle.name }} ({{ vehicle.cost }}) </a>
			</div>
		</div>
	</div>
</template>

<script>
	import vehicleTypes from '../data/vehicles.json'

	export default {
		mounted()
		{
			$( '[data-toggle="tooltip"]', this.$refs.newVehicleButtonContainer ).tooltip()
		},
		props: [ 'sponsor' ],
		data()
		{
			return {
				currentVehicle: null
			}
		},
		computed: {
			hasCurrentVehicle()
			{
				return !!this.currentVehicle
			},
			vehicleOptions()
			{
				return vehicleTypes.filter( vehicle =>
				{
					return !this.sponsor || // no sponsor
						vehicle.sponsors.length === 0 || // vehicle allows any sponsor
						vehicle.sponsors.includes( this.sponsor.slug ) // vehicle allows this sponsor
				} )
			}
		},
		vehicleTypes: vehicleTypes, // readonly so we don't need getters/setters
		methods: {
			selectVehicle( vehicle )
			{
				this.currentVehicle = vehicle

				this.$emit( 'selected', vehicle )

				// hide tooltips
				$( '[data-toggle="tooltip"]', this.$refs.newVehicleButtonContainer ).tooltip( 'hide' )
			},
			useCurrentVehicle()
			{
				if( this.currentVehicle )
				{
					this.$emit( 'selected', this.currentVehicle )
				}
			},
		}
	}
</script>

<style scoped>
	.new-vehicle-button {
		display: inline-block;
	}
</style>