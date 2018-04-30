<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
	public function getId( Request $request )
	{
		$user = User::updateOrCreate(
			[
				'provider'    => $request->provider,
				'provider_id' => $request->id
			],
			[
				'name'  => $request->name,
				'email' => $request->email
			]
		);

		return [ 'id' => $user->id ];
	}
}
