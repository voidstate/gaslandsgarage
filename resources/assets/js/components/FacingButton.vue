<template>
	<button class="facing-button btn btn-sm btn-primary"
	        v-on:click="changeExtraFacing">

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
		props: [ 'extra' ],
		methods: {
			changeExtraFacing()
			{
				const turretAllowed = this.extra.type !== undefined && this.extra.type === 'shooting',
				      newFacing = this.getNextFacing( this.extra.facing, turretAllowed )

				this.$emit( 'changed', newFacing )
			},
			getNextFacing( currentFacing, turretAllowed = false )
			{

				console.log( 'getNextFacing', currentFacing, turretAllowed)

				let facings = [ 'front', 'side', 'rear' ]

				if( turretAllowed )
				{
					facings.push( 'turret' )
				}

				if( !facings.includes( currentFacing ) )
				{
					currentFacing = facings[ 0 ]
				}

				let index = facings.indexOf( currentFacing ) + 1

				if( index >= facings.length )
				{
					index = 0
				}

				return facings[ index ]
			},
		}
	}
</script>

