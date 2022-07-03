<?php

namespace App\models;

use Illuminate\Database\Eloquent\Model;

class Ukn extends Model
{
    protected $table = 'ukn';
    protected $fillable = [
        'ukn', 'uin', 'status', 'message', 'tag_document', 'otp'
    ];
}
