<!DOCTYPE html>
<html lang="en">
<head>
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
	<meta name="csrf-token" content="{{ csrf_token() }}">

	<title>The Workshop &middot; Gaslands Garage</title>

	<link rel="icon" type="image/png" href="/images/favicon.png">

	<!-- Site CSS -->
	<link rel="stylesheet" href="/css/app.css">

	<style>
		body.animated-bg {
			background-image: url(/images/backgrounds/roads/{{ ( date( 'z' ) % 18) + 1  }}.jpg);
		}
	</style>

</head>
<body class="dark-bg">
<div class="container-fluid">

	<!-- nav -->
	<header class="row header-row">
		@include( 'layout.nav' )
	</header>
	<!-- nav -->

	<main class="main-row">

		<!-- message -->
	@include( 'layout.message-bar' )
	<!-- /message -->

		<!-- content -->
		<div class="main-content-row">
			<div id="team">
				<team ref="team"></team>
			</div>
			<noscript class="big-message">
				<div class="row">
					<div class="jumbotron col-md8 offset-md-2">
						<h1 class="display-4">Gaslands Offline. Mars Communications Down!</h1>
						<p class="lead">Looks like you disabled shiny, chromey JavaScript.</p>
						<hr class="my-4">
						<p class="small">You will need to enable JavaScript to use this web app. Please enable it in your browser's preferences.</p>
					</div>
				</div>
			</noscript>
		</div>
		<!-- /content -->

	</main>

	<!-- footer -->
	<footer class="row footer-row d-print-none">
		<div class="col">
			@include( 'layout.footer' )
		</div>
	</footer>
	<!-- /footer -->
</div>

<!-- modals -->
@include( 'layout.popup-alert-modal' )
@include( 'layout.popup-confirm-modal' )
@include( 'layout.help-modal' )
@include( 'layout.garage-modal' )
<!-- /modals -->

<!-- javascript -->
<script>
	var authTokens = {
		facebook: '{{ config( 'app.token_facebook' ) }}',
		google: '{{ config( 'app.token_google' ) }}'
	};
</script>
<script src="/js/app.js"></script>

</body>
</html>