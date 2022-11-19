<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\models\Payment;
use App\models\Bill;
use App\User;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\API\BaseController as BaseController;
use Validator;
use App\Jobs\WhatsappNotifiction;
class PaymentController extends  BaseController
{
    public function create(Request $request) {
        $validator = Validator::make($request->all(), [
            'paid_amount' => 'required|numeric',
            'bill_id' => 'exists:bills,id',
            'party_id' => 'required|exists:users,id',
        ]);
        if ($validator->fails()) {
            return response()->json(['error'=>$validator->errors()], 422);
        }

        $data            = $request->all();
        $data = Payment::create($data);
        if($data) {
            WhatsappNotifiction::dispatch($data->id);
            return $this->sendResponse($data, 'Payment Received Successfully');
        }
        else {
            return $this->sendError($data, 'Payment can not update Successfully');
        }
    }

    public function delete(Request $request) {
        try{
            $validator = Validator::make($request->all(), [
                'id' => 'required|exists:payments,id,deleted_at,NULL',
            ]);
            if ($validator->fails()) {
                return response()->json(['error'=>$validator->errors()], 422);
            }

            $id = $request['id'];
            $data = Payment::find($request['id'])->delete();
            if($data) {
                return $this->sendResponse($data, 'Payment Deleted Successfully');
            }
            else {
                return $this->sendError($data, 'Payment Deleted Successfully');
            }
        } catch(\Exception $e) {
            return $this->sendError($e->getMessage(), []);
        }
    }

    public function bills($id) {
        try{
                $bills = User::find($id)->bills;
                return $this->sendResponse($bills, 'Bills Successfully');

        } catch(\Exception $e) {
            return $this->sendError($e->getMessage(), []);
        }
    }

    public function payments($id) {
        try{
                $bills = User::find($id)->payments;
                return $this->sendResponse($bills, 'Payments Successfully');

        } catch(\Exception $e) {
            return $this->sendError($e->getMessage(), []);
        }
    }
    public function status($id) {
        try{

            $data['billed_amount'] = Bill::where('party_id', $id)->sum('amount');
            $data['paid_amount'] = Payment::where('party_id', $id)->sum('paid_amount');
            $data['remaining_amount'] =  $data['billed_amount'] -  $data['paid_amount'];
            $data['party_id'] =  $id;
                return $this->sendResponse($data, 'billed amount and paid amount');

        } catch(\Exception $e) {
            return $this->sendError($e->getMessage(), []);
        }
    }

    public function history($id) {
        try{

            $data = Payment::with('party')->where('party_id', $id)->orderBy('created_at', 'DESC')->get();
                return $this->sendResponse($data, 'Paid amount');

        } catch(\Exception $e) {
            return $this->sendError($e->getMessage(), []);
        }
    }
}
