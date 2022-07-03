<?php

namespace App;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Providers\Passport;
use Laravel\Passport\HasApiTokens;
use App\Traits\CreatedUpdatedBy;

class User extends Authenticatable
{
    use Notifiable, HasApiTokens, CreatedUpdatedBy; // update this line

    function getLoginStatusAttribute() {
        return count(User::find($this->id)->tokens);
    }

    protected $appends = ['login_status'];
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [

        'name', 'email', 'password',  'name',

    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];
}
