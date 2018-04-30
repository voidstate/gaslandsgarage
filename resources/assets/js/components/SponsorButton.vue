<template>
	<div class="sponsor-button" ref="container">
		<div class="btn-group d-print-none">
			<button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown">
				{{ sponsorName }}
			</button>
			<div class="dropdown-menu">
				<a class="dropdown-item"
				   href="#"
				   v-on:click.prevent="selectSponsor(null)">None</a>
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
			'sponsor'
		],
		data()
		{
			return {
				sponsors: _.sortBy( sponsorsData, 'name' )
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
		methods: {
			getPerkNames( sponsor )
			{
				let names = []
				sponsor.perks.forEach( perk => names.push( perk.name ) )
				return names.sort().join( ', ' )
			},
			selectSponsor( sponsor )
			{
				console.log( 'sponsor selected', sponsor )

				this.$emit( 'selected', sponsor )

				$( '[data-toggle="tooltip"]', this.$refs.container ).tooltip( 'hide' )

				return false
			}
		}
	}
</script>

<style scoped>
	.sponsor-button {
		display: inline-block;
	}
</style>