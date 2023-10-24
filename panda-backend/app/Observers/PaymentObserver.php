<?php

namespace App\Observers;

use App\models\Payment;
use App\models\Sms;

class PaymentObserver
{
    public function created(Payment $payment)
    {
        // create sms
        Sms::create([
            'payment_id' => $payment->id,
            'bill_id' => $payment->bill_id,
            'party_id' => $payment->party_id,
            'created_by' => auth()->user()->id,
            'updated_by' => auth()->user()->id,
        ]);
    }

    public function updated(Payment $payment)
    {
        // Logic to perform when a Payment is updated.
    }

    public function deleted(Payment $payment)
    {
        // Logic to perform when a Payment is deleted.
    }
}