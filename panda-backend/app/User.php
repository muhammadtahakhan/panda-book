<?php

namespace App;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Providers\Passport;
use Laravel\Passport\HasApiTokens;
use App\Traits\CreatedUpdatedBy;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\models\Payment;
use App\models\Bill;

class User extends Authenticatable
{
    use SoftDeletes, Notifiable, HasApiTokens, CreatedUpdatedBy; // update this line

    function getLoginStatusAttribute() {
        return count(User::find($this->id)->tokens);
    }

    protected $appends = ['login_status', 'balance'];
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [

        'name', 'email', 'password',  'mobile', 'address', 'user_type',
        'car',
        'tenant_name',
        'tenant_mobile',
        'tenant_car',
        'tenant_two_name',
        'tenant_two_mobile',
        'tenant_two_car',

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

    public function getBalanceAttribute() {
        $data['billed_amount'] = Bill::where('party_id', $this->id)->sum('amount');
        $data['paid_amount'] = Payment::where('party_id', $this->id)->sum('paid_amount');
        $data['remaining_amount'] =  $data['billed_amount'] -  $data['paid_amount'];

        return  $data['remaining_amount'];
    }

    public function bills()
    {
        return $this->hasMany('App\models\Bill', 'party_id');
    }
    public function payments()
    {
        return $this->hasMany('App\models\Payment', 'party_id');
    }
}
