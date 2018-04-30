<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Team extends Model
{
	/**
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */
	protected $fillable = [
		'user_id', 'name', 'sponsor', 'cost', 'max_cost', 'vehicle_names', 'vehicle_count', 'dehydrated', 'hash',
	];

	protected $hidden = [
		'hash'
	];

	public function user()
	{
		return $this->belongsTo( User::class );
	}
}
