<template>
	<button class="facing-button btn btn-sm btn-primary"
	        v-on:click="toggleExtraFacing">

		<img src="/images/icons/front-facing.svg"
		     class="svg-icon"
		     data-toggle="tooltip"
		     data-placement="auto"
		     data-html="false"
		     title="Front facing"
		     v-show="!extra.facing || extra.facing === 'front'">

		<img src="/images/icons/side-facing.svg"
		     class="svg-icon svg-icon-wide"
		     data-toggle="tooltip"
		     data-placement="auto"
		     data-html="false"
		     title="Side facing"
		     v-show="extra.facing === 'side'">

		<img src="/images/icons/rear-facing.svg"
		     class="svg-icon"
		     data-toggle="tooltip"
		     data-placement="auto"
		     data-html="false"
		     title="Rear facing"
		     v-show="extra.facing === 'rear'">

		<img src="/images/icons/turret-facing.svg"
		     alt="Turret"
		     class="svg-icon"
		     data-toggle="tooltip"
		     data-placement="auto"
		     data-html="false"
		     title="Turret"
		     v-show="extra.facing === 'turret'">

	</button>
</template>

<script>
	export default {
		name: 'facingButton',
		mounted()
		{
			if( !this.frontAllowed )
			{
				this.changeExtraFacing( 'rear' )
			}
		},
		props: [ 'extra' ],
		/*data()
		{
			return {
				extra: _.cloneDeep( this.extra )
			}
		},*/
		computed: {
			frontAllowed()
			{
				return this.extra.type !== undefined && this.extra.type !== 'dropped'
			},
			turretAllowed()
			{
				return this.extra.type !== undefined && this.extra.type === 'shooting'
			},
			facings()
			{
				let facings = [ 'side', 'rear' ]

				if( this.frontAllowed )
				{
					facings.unshift( 'front' )
				}

				if( this.turretAllowed )
				{
					facings.push( 'turret' )
				}

				return facings
			}
		},
		methods: {
			toggleExtraFacing()
			{
				const newFacing = this.getNextFacing( this.extra.facing )
				this.changeExtraFacing( newFacing )
			},
			changeExtraFacing( newFacing )
			{
				console.log( 'changeExtraFacing', newFacing )

				this.$emit( 'changed', newFacing )
			},
			getNextFacing( currentFacing )
			{
				if( !this.facings.includes( currentFacing ) )
				{
					currentFacing = this.facings[ 0 ]
				}

				let index = this.facings.indexOf( currentFacing ) + 1

				if( index >= this.facings.length )
				{
					index = 0
				}

				return this.facings[ index ]
			},
		}
	}
</script>

