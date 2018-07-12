<template>
	<div class="sponsor-button d-inline-block" ref="container">
		<div class="btn-group d-print-none">
			<button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown">
				{{ sponsorName }}
			</button>
			<div class="dropdown-menu">
				<a class="dropdown-item"
				   href="#"
				   v-on:click.prevent="selectSponsor(null)">None</a>
				<hr>
				<a v-for="(sponsor, index) in sponsors"
				   :item="sponsor"
				   :key="index"
				   class="dropdown-item"
				   href="#"
				   v-on:click.prevent="selectSponsor(sponsor)"
				   data-toggle="tooltip"
				   data-placement="auto"
				   data-html="true"
				   v-bind:title="'Perks: ' + getPerkNames( sponsor )"> {{ sponsor.name }} </a>
			</div>
		</div>
		<div class="d-inline-block ml-sm-3 d-print-none">
			<div class="form-check">
				<input class="form-check-input toggle-checkbox"
				       type="checkbox"
				       id="allowAllPerksCheckbox"
				       v-model="allowAllPerksCheckbox">

				<label class="form-check-label" for="allowAllPerksCheckbox">

					<span v-show="allowAllPerksCheckbox">
						<i class="fas fa-toggle-on text-primary"></i>
					</span>

					<span v-show="!allowAllPerksCheckbox">
						<i class="fas fa-toggle-off text-primary"></i>
					</span>

					Allow all perks </label>
			</div>
		</div>
		<h3 class="d-none d-print-block mb-0" v-show="hasSponsor">
			{{ sponsorName }}
		</h3>
	</div>
</template>

<script>
	import sponsorsData from '../data/sponsors.json'

	export default {
		mounted()
		{
			$( '.sponsor-button [data-toggle="tooltip"]' ).tooltip()
		},
		props: [
			'sponsor',
			'allowAllPerks'
		],
		data()
		{
			return {
				sponsors: _.sortBy( sponsorsData, 'name' ),
				allowAllPerksCheckbox: this.allowAllPerks
			}
		},
		computed: {
			hasSponsor()
			{
				return this.sponsor && this.sponsor.name
			},
			sponsorName()
			{
				return this.sponsor ? this.sponsor.name : 'Sponsor'
			}
		},
		watch: {
			allowAllPerksCheckbox( newValue )
			{
				this.$emit( 'allowAllPerksChanged', newValue )
			}
		},
		methods: {
			getPerkNames( sponsor )
			{
				let names = []
				sponsor.perks.forEach( perk => names.push( perk.name ) )
				return names.sort().join( ', ' )
			},
			selectSponsor( sponsor )
			{
				this.$emit( 'selected', sponsor )

				$( '[data-toggle="tooltip"]', this.$refs.container ).tooltip( 'hide' )

				return false
			}
		}
	}
</script>