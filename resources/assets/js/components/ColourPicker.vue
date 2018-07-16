<template>
	<div ref="modal" class="colour-picker modal fade" tabindex="-1" role="dialog">
		<div class="modal-dialog modal-lg" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">Vehicle colours</h5>
					<button type="button" class="close" data-dismiss="modal" aria-label="Close">
						<i class="fas fa-times"></i>
					</button>
				</div>
				<div class="modal-body">
					<div class="container-fluid">
						<div class="row">
							<div class="col-md-6 px-0 px-md-2">
								<div class="card">
									<div class="card-header" v-bind:style="{ 'background-color': foregroundHexColour, 'color': foregroundTextHexColour}">
										Base Colour
									</div>
									<div class="card-body">
										<swatches-picker v-model="foregroundColour"></swatches-picker>
									</div>
								</div>
							</div>
							<div class="col-md-6">
								<div class="card">
									<div class="card-header" v-bind:style="{ 'background-color': backgroundHexColour, 'color': backgroundTextHexColour }">
										Trim Colour
									</div>
									<div class="card-body">
										<swatches-picker v-model="backgroundColour"></swatches-picker>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="modal-footer">
						<button type="button"
						        class="btn btn-primary"
						        v-on:click="save">Save
						</button>
						<button type="button"
						        class="btn btn-secondary"
						        v-on:click="clear">Clear Colours
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {Swatches} from 'vue-color'
	import tinycolor from 'tinycolor2'

	const defaultForegroundColour = '#000'
	const defaultBackgroundColour = '#fff'

	export default {
		name: 'colourPicker',
		components: {
			'swatches-picker': Swatches
		},
		data()
		{
			return {
				index: null,
				foregroundColour: defaultForegroundColour, // vue-color must have colour values so default to black & white
				backgroundColour: defaultBackgroundColour
			}
		},
		computed: {
			foregroundHexColour()
			{
				return _.get( this.foregroundColour, 'hex' ) || this.foregroundColour // default colour doesn't have a "hex" property
			},
			backgroundHexColour()
			{
				return _.get( this.backgroundColour, 'hex' ) || this.backgroundColour // default colour doesn't have a "hex" property
			},
			foregroundTextHexColour()
			{
				return tinycolor( this.foregroundHexColour ).isLight() ? '#000' : '#fff'
			},
			backgroundTextHexColour()
			{
				return tinycolor( this.backgroundHexColour ).isLight() ? '#000' : '#fff'
			}
		},
		methods: {
			show( index, foregroundColour, backgroundColour )
			{
				this.index = index
				this.foregroundColour = foregroundColour || defaultForegroundColour
				this.backgroundColour = backgroundColour || defaultBackgroundColour

				$( this.$refs.modal ).modal( 'show' )
			},
			save()
			{
				this.$emit( 'coloursChanged', this.index, this.foregroundHexColour, this.backgroundHexColour )
			},
			clear()
			{
				this.$emit( 'coloursChanged', this.index, null, null )
			},
			hide()
			{
				$( this.$refs.modal ).modal( 'hide' )
			}
		}
	}
</script>

