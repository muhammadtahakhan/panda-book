<?php

namespace App\models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\CreatedUpdatedBy;
use Illuminate\Support\Facades\Auth;
class Bill extends Model
{
    use  CreatedUpdatedBy;
    protected $table = 'bills';
    protected $fillable = [ 'amount', 'party_id', 'description' ];

    public function delete(): void
        {
            $this->deleted_at = now();
            $this->deleted_by = Auth::user()->id;
            $this->save();
        }

    public function party()
    {
     return $this->belongsTo('App\User');
    }


}
