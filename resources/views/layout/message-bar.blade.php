@if( Session::has('message-danger' ) || Session::has('message-warning' ) || Session::has('message-success' ) || Session::has('message-info' ) )
	<div class="main-message-row">
		@foreach( ['danger', 'warning', 'success', 'info'] as $type )
			@if( Session::has('message-' . $type ) )
				<p class="alert alert-{{ $type }}">
					{!! Session::get('message-' . $type) !!}
					<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
				</p>
			@endif
		@endforeach
	</div>
@endif