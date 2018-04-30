<?php

namespace App\Http\Controllers;

use App\Models\Team;
use App\Models\User;
use Illuminate\Http\Request;

class GarageController extends Controller
{
	public function list( User $user )
	{
		return [
			'teams' => $user->teams()->get( [
				'id',
				'name',
				'sponsor',
				'cost',
				'max_cost',
				'vehicle_count',
				'vehicle_names',
				'updated_at'
			] )
		];
	}

	public function count( User $user )
	{
		return [ 'count' => $user->teams()->count() ];
	}

	public function save( Request $request, $force_mode = null )
	{
		if ( ! empty( $force_mode ) && ! in_array( $force_mode, [ 'edit', 'create' ] ) )
		{
			throw new \InvalidArgumentException( 'Force mode invalid' );
		}

		$teamData = $request->validate( [
			'id'            => 'integer|min:1|nullable',
			'user_id'       => 'required|numeric',
			'name'          => 'required|max:255',
			'sponsor'       => 'max:255',
			'cost'          => 'required|integer|min:1',
			'max_cost'      => 'required|integer|min:1',
			'vehicle_names' => 'required|max:255',
			'vehicle_count' => 'required|integer|min:1',
			'dehydrated'    => 'required|json'
		] );

		/*return [
			'input'     => $request->input(),
			'validated' => $teamData
		];*/

		// already tried to submit and detected duplicate
		if ( $force_mode === 'edit' )
		{
			$hash             = md5( serialize( $teamData[ 'dehydrated' ] ) );
			$teamData[ 'id' ] = Team::where( 'user_id', $teamData[ 'user_id' ] )
			                        ->where( 'hash', $hash )
			                        ->firstOrFail()
									->id;
		}

		if ( ! empty( $teamData[ 'id' ] ) )
		{
			/*d( 'Updating' );
			exit;*/

			$team = Team::find( $teamData[ 'id' ] );
			$team->fill( $teamData );
			$team->save();
		}
		else
		{
			// we use a has of the data to check for duplicates
			$hash = md5( serialize( $teamData[ 'dehydrated' ] ) );

			// duplicate?
			if ( ! $force_mode )
			{
				//\DB::enableQueryLog();

				$duplicate = (bool) Team::where( 'user_id', $teamData[ 'user_id' ] )
				                        ->where( 'hash', $hash )
				                        ->count();

				/*!d( $duplicate, \DB::getQueryLog() );
				exit;*/

				if ( $duplicate )
				{
					return response()->json( [ 'errors' => [ 'Duplicate team' ] ], 418 ); // I'm a teapot!
				}
			}

			// append hash
			$teamData[ 'hash' ] = $hash;

			/*!d( 'Creating', $teamData, $force_mode );
			exit;*/

			// team is not a duplicate or $force_mode = create
			$team = Team::create(
				$teamData
			);
		}

		return [ 'id' => $team->id ];
	}

	public function load( $user_id, Team $team )
	{
		if( $team->user_id != $user_id )
		{
			return response()->json( [ 'errors' => [ 'Team does not belong to this user' ] ], 422 );
		}

		return [ 'team' => $team->dehydrated ];
	}

	public function delete( Request $request, $user_id, $team_id )
	{
		// to make it less likely someone deleted teams by messing around with routes, we ask for user and team ids
		\Validator::make(
			[
				'user_id' => $user_id,
				'team_id' => $team_id
			],
			[
				'team_id' => 'required|integer|min:1',
				'user_id' => 'required|integer|min:1',
			] )->validate();

		$team = Team::where( 'id', $team_id )
		            ->where( 'user_id', $user_id )
		            ->firstOrFail();

		$success = $team->delete();

		return [ 'success' => $success ];
	}
}
