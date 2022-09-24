<?php

namespace App\models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\CreatedUpdatedBy;
use Illuminate\Support\Facades\Auth;

class Payment extends Model
{
    use SoftDeletes, CreatedUpdatedBy;
    protected $table = 'payments';
    protected $fillable = [
        'paid_amount', 'bill_id', 'party_id', 'description',
        'payment_category', 'payment_type', 'cheque_number'
    ];

    public function party()
    {
     return $this->belongsTo('App\User', 'id', 'party_id');
    }
}
