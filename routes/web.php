<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::view( '/', 'layout.main' )->name( 'index' );

// XHR routes

Route::prefix( 'garage' )->group( function()
{
	Route::get( 'list/{user}', 'GarageController@list' );
	Route::get( 'count/{user}', 'GarageController@count' );
	Route::get( 'load/{user_id}/{team}', 'GarageController@load' );
	Route::post( 'save/{force?}', 'GarageController@save' );
	Route::get( 'delete/{user_id}/{team_id}', 'GarageController@delete' );
} );

Route::prefix( 'user' )->group( function()
{
	Route::get( '/get-id', 'UserController@getId' );
} );

Route::view( 'privacy', 'legal.privacy' );
