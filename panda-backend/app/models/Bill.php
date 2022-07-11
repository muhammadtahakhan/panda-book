<?php

namespace App\models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\CreatedUpdatedBy;
class Bill extends Model
{
    use SoftDeletes, CreatedUpdatedBy;
    protected $table = 'bills';
    protected $fillable = [ 'amount', 'party_id', 'description' ];


    public function party()
    {
     return $this->belongsTo('App\User');
    }


}
