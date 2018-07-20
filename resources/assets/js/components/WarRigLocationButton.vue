<template>
	<span ref="container">
		<button class="location-button btn btn-sm btn-primary"
		        v-on:click="toggleExtraLocation"
		        data-toggle="tooltip"
		        data-placement="auto"
		        data-html="false"
		        v-bind:title="locationTitle">

			<img src="/images/icons/war-rig-tractor.svg"
			     class="svg-icon"

			     v-show="!extra.location || extra.location === 'tractor'">

			<img src="/images/icons/war-rig-trailer.svg"
			     class="svg-icon"
			     v-show="extra.location === 'trailer'">

		</button>
	</span>
</template>

<script>
	const locations = [ 'tractor', 'trailer' ]

	export default {
		name: 'warRigLocationButton',
		props: [ 'extra' ],
		mounted()
		{
			// build tooltip
			$( '[data-toggle="tooltip"]', this.$refs.container ).tooltip()
		},
		computed: {
			locationTitle()
			{
				return !this.extra.location || this.extra.location === 'tractor' ? 'Tractor' : 'Trailer'
			}
		},
		methods: {
			toggleExtraLocation()
			{
				const newLocation = locations[ !this.extra.location || locations.indexOf( this.extra.location ) === 0 ? 1 : 0 ]
				this.$emit( 'changed', newLocation )

				// rebuild tooltip
				setTimeout( () =>
				{
					$( '[data-toggle="tooltip"]', this.$refs.container ).tooltip( 'dispose' )
					$( '[data-toggle="tooltip"]', this.$refs.container ).tooltip()
				}, 50 )
			},
		}
	}
</script>

