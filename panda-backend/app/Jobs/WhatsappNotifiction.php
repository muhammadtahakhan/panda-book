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
       $response = Http::withBasicAuth(env('TWILIO_SID'), env('TWILIO_TOKEN'))->asForm()->post(env('TWILIO_URL'), [
        'To' => 'whatsapp:+923150208667',
        'From' => 'whatsapp:+14155238886',
        'Body' => 'Your Yummy Cupcakes Company order of 1 dozen frosted cupcakes has shipped and ',
    ]);
       print_r($response->body());
    }
}
