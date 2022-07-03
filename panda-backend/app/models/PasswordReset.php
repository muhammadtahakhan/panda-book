<?php

namespace App\models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PasswordReset extends Model
{
    // use SoftDeletes;

    protected $table = 'reset_codes';
   

    protected $fillable = [
        'email','mobile','token'
    ];
}
