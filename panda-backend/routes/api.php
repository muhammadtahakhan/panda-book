<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('login', 'API\UserController@login');
Route::post('register', 'API\UserController@register');
Route::post('verifyemail', 'API\UserController@verifyEmail');



Route::group([
        // 'namespace' => 'Auth',
        // 'middleware' => 'api',
        'prefix' => 'password'
    ], function () {
        Route::post('create', 'API\PasswordResetController@create');
        Route::get('find/{token}', 'API\PasswordResetController@find');
        Route::post('reset', 'API\PasswordResetController@reset');
    });


Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});
Route::group(['middleware' => ['json.response', 'auth:api']], function(){
    Route::get('logout', 'API\UserController@logout');
    Route::post('details', 'API\UserController@details');
    Route::post('updatedetails', 'API\UserController@update_details');
    Route::get('whoami', 'API\UserController@whoami');
    Route::get('users', 'API\UserController@list');
    Route::get('user/{id}', 'API\UserController@user_by_id');
    Route::get('statics', 'API\UserController@statics');
    Route::post('changeuser', 'API\UserController@changeUser');

    Route::get('ukn', 'API\UknController@list');
    Route::post('ukn', 'API\UknController@create');
    Route::put('ukn', 'API\UknController@update');
    Route::delete('ukn', 'API\UknController@delete');




    Route::get('ping', 'API\UserController@ping');

    // Billing
    Route::get('bill', 'API\BillController@list');
    Route::post('bill', 'API\BillController@create');
    Route::post('bill_for_all', 'API\BillController@create_for_all');
    Route::delete('bill', 'API\BillController@delete');

    // Appartment
    Route::get('appartment', 'API\AppartmentController@list');
    Route::post('appartment', 'API\AppartmentController@register');
    Route::put('appartment', 'API\AppartmentController@update_details');
    Route::delete('appartment', 'API\AppartmentController@delete');

    // Payments
    Route::post('appartment', 'API\PaymentController@create');
    Route::get('appartment/bills/{id}', 'API\PaymentController@bills');
    Route::get('appartment/payments/{id}', 'API\PaymentController@payments');
    Route::get('appartment/status/{id}', 'API\PaymentController@status');
});
