<template>
	<nav class="navbar fixed-top navbar-expand-lg navbar-dark justify-content-between" ref="container">
		<a class="navbar-brand" href="#">Gaslands Garage</a>

		<div ref="teamSummary" v-show="showSummary" class="team-summary text-center animated fadeInDown">
			<span class="badge badge-dark">
				<h5 class="d-none d-sm-inline-block">{{ summary.name }}</h5>
				<span class="summary-costs">
					<img src="/images/icons/drum.svg" class="ml-sm-3"> {{ summary.cost }} <span class="d-none d-sm-inline-block">cans</span>
				</span>
			</span>
		</div>

		<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse">
			<span class="navbar-toggler-icon"></span>
		</button>

		<div id="navbarCollapse" class="navbar-collapse collapse navbar-right">
			<ul class="navbar-nav ml-auto">
				<li class="nav-item">
					<a class="nav-link" href="#" v-on:click.prevent="addTeam">

						<span data-toggle="tooltip"
						      data-placement="bottom"
						      data-html="true"
						      title="Start a New Team"
						      class="d-none d-sm-inline">
							<i class="fas fa-lg fa-fw fa-plus-square"></i>
						</span>

						<span class="d-sm-none">
							<i class="fas fa-lg fa-fw fa-plus-square"></i>
						</span>

						<span class="d-lg-none ml-1"> Start a New Team</span> </a>
				</li>
				<li class="nav-item">
					<a class="nav-link" href="#" v-on:click.prevent="showGarage" v-bind:class="{ disabled: !loggedIn }">

						<span data-toggle="tooltip"
						      data-placement="bottom"
						      data-html="true"
						      title="View My Teams"
						      class="d-none d-sm-inline">
							<i class="fas fa-lg fa-fw fa-car" data-fa-transform="grow-2"></i>
						</span>

						<span class="d-sm-none">
						<i class="fas fa-lg fa-fw fa-car" data-fa-transform="grow-2"></i>
						</span>

						<span class="d-lg-none ml-1"> View My Teams</span>

						<span class="team-count-badge badge badge-light ml-1" v-show="teamCount">{{ teamCount }}</span>
					</a>
				</li>
				<li class="nav-item">
					<a class="nav-link" href="#" v-on:click.prevent="saveTeam" v-bind:class="{ disabled: !loggedIn }">

						<span data-toggle="tooltip"
						      data-placement="bottom"
						      data-html="true"
						      title="Save Current Team"
						      class="d-none d-sm-inline">
							<i class="fas fa-lg fa-fw fa-cloud-upload-alt"></i>
						</span>

						<span class="d-sm-none">
						<i class="fas fa-lg fa-fw fa-cloud-upload-alt"></i>
						</span>

						<span class="d-lg-none ml-1">Save Current Team</span> </a>

				</li>
				<li class="nav-item">
					<a class="nav-link" href="#" v-on:click.prevent="printTeam">

						<span data-toggle="tooltip"
						      data-placement="bottom"
						      data-html="true"
						      title="Print Team"
						      class="d-none d-sm-inline">
							<i class="fas fa-lg fa-fw fa-print" data-fa-transform="shrink-1"></i>
						</span>

						<span class="d-sm-none">
						<i class="fas fa-lg fa-fw fa-print" data-fa-transform="shrink-1"></i>
						</span>

						<span class="d-lg-none ml-1">Print Team</span> </a>

				</li>
				<li class="nav-item dropdown">
					<a class="nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown">

						<span data-toggle="tooltip"
						      data-placement="bottom"
						      data-html="true"
						      title="Settings"
						      class="d-none d-sm-inline">
							<i class="fas fa-lg fa-fw fa-cog"></i>
						</span>

						<span class="d-sm-none">
						<i class="fas fa-lg fa-fw fa-cog"></i>
						</span>

						<span class="d-lg-none ml-1">Settings</span>

					</a>

					<div class="dropdown-menu">
						<a class="dropdown-item" href="#" v-on:click.prevent="toggleAccordions">Toggle Accordions</a>
						<a class="dropdown-item" href="#" v-on:click.prevent="toggleBackground">Toggle Background</a>
						<a class="dropdown-item" href="#" v-on:click.prevent="resetTeam">Reset Team</a>
					</div>
				</li>
				<li class="nav-item dropdown">

					<a class="nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown">

						<span v-show="!loggedIn">
							<span data-toggle="tooltip"
							      data-placement="bottom"
							      data-html="true"
							      title="Log In"
							      class="d-none d-sm-inline">
								<i class="fas fa-lg fa-fw fa-lock"></i>
							</span>

							<span class="d-sm-none">
								<i class="fas fa-lg fa-fw fa-lock"></i>
							</span>
						</span>


						<span v-show="loggedIn">
							<span data-toggle="tooltip"
							      data-placement="bottom"
							      data-html="true"
							      title="Log Out"
							      class="d-none d-sm-inline">
							<i class="fas fa-lg fa-fw fa-unlock"></i>
							</span>

							<span class="d-sm-none">
								<i class="fas fa-lg fa-fw fa-unlock"></i>
							</span>
						</span>

						<span class="d-lg-none ml-1">
							<span v-show="loggedIn">
								Log Out
							</span>
							<span v-show="!loggedIn">
								Log In
							</span>
						</span>

					</a>

					<div class="dropdown-menu">
						<div class="dropdown-item" v-show="!loggedIn">
							<button class="btn btn-facebook btn-block border-white" v-on:click="loginFacebook">
								<i class="fab fa-facebook-square"></i> Log In with Facebook
							</button>
						</div>
						<!--
						<div class="dropdown-item" v-show="!loggedIn">
							<button class="btn btn-google btn-block border-white" v-on:click="loginGoogle">
								<i class="fab fa-google"></i> Log In with Google
							</button>
						</div>
						-->
						<div class="dropdown-item" v-show="loggedIn">
							<div class="media user-profile">
								<img class="profile-image mr-3" v-bind:src="userThumbnail" alt="Your Face!">
								<div class="media-body">
									<h5 class="profile-name my-0">{{ userName }}</h5>
									<p>
										<span v-show="!teamCount">
											<i class="fas fa-spinner fa-pulse profile-loading-icon"></i>
										</span> <span class="profile-team-count" v-show="teamCount">
											{{ teamCountMsg }}
										</span>
									</p>
								</div>

							</div>
						</div>
						<div class="dropdown-item" v-show="loggedIn">
							<button class="btn btn-secondary btn-block" v-on:click="logout">
								<i class="fas fa-lock"></i> Log Out
							</button>
						</div>
					</div>
				</li>
			</ul>
		</div>
	</nav>
</template>

<script>
	import auth from '../modules/auth'
	import eventBus from '../modules/eventBus'
	import backgroundSwitcher from '../modules/backgroundSwitcher'

	export default {
		name: 'Nav',
		mounted()
		{
			auth.subscribe( this.onAuthChanged )
			auth.init()

			eventBus.$on( 'garage.changed', this.updateTeamCount )
			eventBus.$on( 'team-details.visibility', this.onTeamDetailsVisibilityChanged )
			eventBus.$on( 'team.summary-changed', this.onTeamSummaryChanged )

			$( '[data-toggle="tooltip"]', this.$refs.container ).tooltip()
		},
		data()
		{
			return {
				loggedIn: false,
				userName: undefined,
				userThumbnail: undefined,
				teamCount: 0,
				showSummary: false,
				summary: {
					name: '',
					cost: 0
				}
			}
		},
		computed: {
			teamCountMsg()
			{
				return this.teamCount > 0 ? this.teamCount + ' teams' : 'No teams yet'
			}
		},
		methods: {
			toggleBackground()
			{
				backgroundSwitcher.toggleBackground()
			},
			toggleAccordions()
			{
				eventBus.$emit( 'team.toggle-accordions' )
			},
			resetTeam()
			{
				eventBus.$emit( 'team.reset' )
			},
			onAuthChanged( authorised )
			{
				this.loggedIn = authorised

				if ( authorised )
				{
					this.userName = auth.getUserName()
					this.userThumbnail = auth.getUserThumbnail()

					this.updateTeamCount()

					Vue.popupAlert.alert( 'info', 'Login successful. Welcome to Gaslands Garage.' )
				}
				else
				{
					Vue.popupAlert.alert( 'info', 'Logout successful. See you around, Stranger.' )
				}
			},
			updateTeamCount()
			{
				auth.getTeamCount().then( count =>
				{
					this.teamCount = count
				} )
			},
			loginFacebook()
			{
				auth.login( auth.FACEBOOK )
			},
			loginGoogle()
			{
				auth.login( auth.GOOGLE )
			},
			logout()
			{
				auth.logout()
			},
			showGarage()
			{
				eventBus.$emit( 'garage.show' )
			},
			saveTeam()
			{
				eventBus.$emit( 'team.save' )
			},
			printTeam()
			{
				window.print()
			},
			addTeam()
			{
				var win = window.open( location.href.replace( location.hash, '' ), '_blank' )
				win.focus()
			},
			onTeamDetailsVisibilityChanged( visible )
			{
				this.showSummary = !visible
			},
			onTeamSummaryChanged( summary )
			{
				this.summary.name = summary.name
				this.summary.cost = summary.cost
			}
		}
	}
</script>
