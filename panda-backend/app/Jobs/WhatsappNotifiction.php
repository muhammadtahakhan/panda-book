<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\models\Payment;
use Illuminate\Support\Facades\Http;

class WhatsappNotifiction implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
    public $tries = 5;

    protected $payment_id;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(int $payment_id)
    {
        $this->payment_id = $payment_id;
    }

    public function retryUntil()
    {
        return now()->addMinutes(5);
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        print_r($this->payment_id);
       $payment = Payment::find($this->payment_id)->get();
       $response = Http::withBasicAuth('AC365ad1115c1683f8afe5b1221fe7d5e1', '21287ffe0c01cef6794227adfaa9327d')->asForm()->post('https://api.twilio.com/2010-04-01/Accounts/AC365ad1115c1683f8afe5b1221fe7d5e1/Messages.json', [
        'To' => 'whatsapp:+923150208667',
        'From' => 'whatsapp:+14155238886',
        'Body' => 'Your Yummy Cupcakes Company order of 1 dozen frosted cupcakes has shipped and ',
    ]);
       print_r($response->body());
    }
}
