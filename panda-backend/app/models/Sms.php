<?php

namespace App\models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Sms extends Model
{
    use SoftDeletes;

    protected $table = 'sms';

    protected $fillable = [
        'payment_id',
        'bill_id',
        'party_id',
        'description',
        'status',
        'created_by',
        'updated_by',
        'deleted_by'
    ];

    public function payment()
    {
        return $this->belongsTo(Payment::class);
    }
}
