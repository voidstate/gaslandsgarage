<template>
	<div id="garageModal" class="modal fade" tabindex="-1">
		<div class="modal-dialog modal-md">
			<div class="modal-content">
				<div class="modal-header">
					<h2 class="modal-title">Garage</h2>
					<button type="button" class="close" data-dismiss="modal" aria-label="Close">
						<i class="fas fa-times"></i>
					</button>
				</div>
				<div class="modal-body">
					<div class="alert alert-info" v-show="!hasTeams">
						<i class="fas fa-info-circle"></i> You have not saved any teams yet. Once you do, they will appear here.
					</div>
					<table class="w-100">
						<template v-for="team of teams">
							<tr class="team">
								<td class="align-top pr-3">
									<h5 class="mb-0">{{ team.name }}</h5>
									<p>{{ team.sponsor }}</p>
								</td>
								<td class="align-top pr-3">
									<p>
										{{ team.cost }}/{{ team.max_cost }} cans<br> {{ team.vehicle_count }} vehicles<br> {{ team.vehicle_names }}
									</p>
								</td>
								<td class="align-top text-right">
									<button class="btn btn-primary btn-sm mb-1" v-on:click="onLoad( team.id )">
										<i class="fas fa-fw fa-cloud-download-alt"></i>
									</button>
									<button class="btn btn-primary btn-sm mb-1" v-on:click="onDelete( team.id )">
										<i class="fas fa-fw fa-trash-alt"></i>
									</button>
								</td>
							</tr>
						</template>
					</table>
				</div>
			</div>
		</div>
	</div>

</template>

<script>
	import auth from '../modules/auth'
	import eventBus from '../modules/eventBus'

	let modal

	export default {
		name: 'Garage',
		mounted()
		{
			modal = $( '#garageModal' )

			eventBus.$on( 'garage.show', this.onShow )
			eventBus.$on( 'garage.hide', this.onHide )
		},
		data()
		{
			return {
				teams: []
			}
		},
		computed: {
			hasTeams()
			{
				return this.teams.length > 0
			}
		},
		methods: {
			onShow()
			{
				if( !auth.isLoggedIn() )
				{
					Vue.popupAlert.alert( 'warning', 'Please log in to view your garage.' )
				}

				axios.get( '/garage/list/' + auth.getUserId() )
					.then( response =>
					{
						this.teams = response.data.teams
						modal.modal( 'show' )
					} )
					.catch( error =>
					{
						Vue.popupAlert.alert( 'danger', 'Failed to load teams. Error: ' + error )
					} )
			},
			onHide()
			{
				modal.modal( 'hide' )
			},
			onLoad( id )
			{
				eventBus.$emit( 'team.load', id )
			},
			onDelete( id )
			{
				axios.get( '/garage/delete/' + auth.getUserId() + '/' + id )
					.then( response =>
					{
						modal.modal( 'hide' )
						eventBus.$emit( 'garage.changed' )
						Vue.popupAlert.alert( 'success', 'Team deleted.' )
					} )
					.catch( error =>
					{
						modal.modal( 'hide' )
						console.error( error )
						Vue.popupAlert.alert( 'danger', 'Cannot delete team. Server error ' + error.response.status + '.' )
					} )
			}
		}
	}
</script>

