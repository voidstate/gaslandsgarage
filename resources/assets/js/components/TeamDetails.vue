<template>
	<div class="team-details" ref="container">
		<div class="card">
			<div class="card-body">
				<div class="d-flex">
					<div class="w-100">
						<h1 class="mb-2" v-show="!editingName" v-on:click="editName">{{ currentName }}</h1>

						<div class="mb-2" v-show="editingName">
							<input class="edit-name-input form-control"
							       placeholder="New name..."
							       ref="editNameInput"
							       v-model="newName"
							       v-on:keyup.enter="doneEditingName"
							       v-on:keyup.esc="cancelEditingName"
							       v-on:blur="cancelEditingName">
						</div>

						<div class="mb-2">
							<sponsor-button v-bind:sponsor="sponsor" v-on:selected="onSponsorSelected"></sponsor-button>
						</div>

						<h5 class="mb-1" v-show="hasSponsor">Perks</h5>
						<div v-for="(perk, index) in sponsorPerks"
						     :key="index"
						     class="perk-container d-inline-block mr-3 mb-1">
							<button data-toggle="tooltip"
							        data-placement="auto"
							        v-bind:title="perk.description"
							        class="btn btn-sm btn-outline-primary text-white"
							        href="#">
								{{ perk.name }}
								<div class="d-none d-print-block small">
									{{ perk.description }}
								</div>
							</button>

						</div>
					</div>
					<div class="ml-auto pl-2 cost-container">
						<div v-show="!editingMaxCost" v-bind:class="{ 'cost-too-high' : costTooHigh }" v-on:click="editMaxCost">
							<img src="/images/icons/drum.svg" class="svg-icon"> {{ cost }}/{{ maxCost }}
						</div>
						<div v-show="editingMaxCost">
							<input type="number"
							       step="1"
							       min="0"
							       list="defaultMaxCosts"
							       class="edit-max-cost-input form-control"
							       ref="editMaxCostInput"
							       v-model="newMaxCost"
							       v-on:keyup.enter="doneEditingMaxCost"
							       v-on:keyup.esc="cancelEditingMaxCost">
							<datalist id="defaultMaxCosts">
								<option value="20"></option>
								<option value="25"></option>
								<option value="50"></option>
								<option value="100"></option>
							</datalist>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import SponsorButton from './SponsorButton.vue'

	import eventBus from '../modules/eventBus'

	export default {
		mounted()
		{
			$( '[data-toggle="tooltip"]', this.$refs.container ).tooltip()

			this.initScrollObserver()
		},
		components: {
			'sponsor-button': SponsorButton,
		},
		props: [
			'name',
			'cost',
			'maxCost',
			'sponsor',
		],
		data()
		{
			return {
				newName: '',
				editingName: false,
				newMaxCost: '',
				editingMaxCost: false
			}
		},
		computed: {
			currentName()
			{
				return this.name || 'New Team'
			},
			costTooHigh()
			{
				return this.cost > this.maxCost
			},
			hasSponsor()
			{
				return !!this.sponsor
			},
			sponsorName()
			{
				return this.hasSponsor ? this.sponsor.name : 'None'
			},
			sponsorPerks()
			{
				return this.hasSponsor ? this.sponsor.perks : []
			}
		},
		watch: {
			costTooHigh( newCost, oldCost )
			{
				if( newCost && newCost !== oldCost )
				{
					Vue.popupAlert.alert( 'warning', 'Too many cans spent.' )
				}
			},
			sponsor()
			{
				$( '[data-toggle="tooltip"]', this.$refs.container ).tooltip( 'dispose' )

				window.setTimeout( () => $( '[data-toggle="tooltip"]', this.$refs.container ).tooltip(), 50 )
			},
		},
		methods: {
			initScrollObserver()
			{
				const options = {
					root: null,
					rootMargin: "0px",
					threshold: 1
				};

				const observer = new IntersectionObserver( handleIntersect, options );
				observer.observe( this.$refs.container );

				function handleIntersect( entries, observer )
				{
					eventBus.$emit( 'team-details.visibility', entries[0].intersectionRatio === 1 )
				}
			},
			editName()
			{
				// replace name with input
				this.editingName = true

				// focus doesn't work without a timeout
				window.setTimeout( () => this.$refs.editNameInput.focus(), 10 );
			},
			doneEditingName()
			{
				this.editingName = false
				this.$emit( 'nameChanged', this.newName )
			},
			cancelEditingName()
			{
				this.editingName = false
			},
			editMaxCost()
			{
				// replace cost with input
				this.editingMaxCost = true

				// focus doesn't work without a timeout
				window.setTimeout( () => this.$refs.editMaxCostInput.focus(), 10 );
			},
			doneEditingMaxCost()
			{
				this.editingMaxCost = false
				this.$emit( 'maxCostChanged', this.newMaxCost )
			},
			cancelEditingMaxCost()
			{
				this.editingMaxCost = false
			},
			onSponsorSelected( sponsor )
			{
				this.$emit( 'sponsorChanged', sponsor )
			}
		}
	}
</script>