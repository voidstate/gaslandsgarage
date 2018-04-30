<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTeamsTable extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create( 'teams', function( Blueprint $table )
		{
			$table->increments( 'id' );
			$table->integer( 'user_id' );
			$table->string( 'name' );
			$table->string( 'sponsor' )->nullable();
			$table->smallInteger( 'cost' )->unsigned();
			$table->smallInteger( 'max_cost' )->unsigned();
			$table->string( 'vehicle_names' );
			$table->smallInteger( 'vehicle_count' )->unsigned();
			$table->json( 'dehydrated' );
			$table->string( 'hash' );
			$table->timestamps();
		} );
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::dropIfExists( 'teams' );
	}
}
