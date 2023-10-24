<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\models\Sms;
use Validator;

class SmsController extends BaseController
{
    public function index(Request $request)
    {
        try {
            $pageSize  =  $request->query->get('page_size', 5);
            $pageIndex =  $request->query->get('page_index', 0);
            $search    =  $request->query->get('search');
            $filter    =  $request->query->get('filter');

            $data = Sms::query()->with(['payment' => function($query) {
                $query->select('id', 'paid_amount', 'bill_id', 'party_id', 'payment_category', 'payment_type', 'cheque_number', 'description');
            }, 
            'payment.party' => function($query) {
                $query->select('id', 'email', 'name', 'address', 'mobile', 'residence', 'user_type');
            },
            'payment.bill' => function($query) {
                $query->select('id', 'amount', 'party_id', 'description');
            }])
            ->whereHas('payment', function ($query) {
                // Apply the whereHas condition to 'payment'
                $query
                    ->whereHas('party') // Apply the whereHas condition to 'payment.party'
                    ->whereHas('bill'); // Apply the whereHas condition to 'payment.bill'
            })
            ->orderBy('id', 'DESC');
            
            $data = $data->paginate($pageSize, ['*'], 'page', $pageIndex);
            return $this->sendResponse($data, 'Sms List');
        } catch(\Exception $e) {
            return $this->sendError($e->getMessage(), []);
        }
    }

    public function show($id)
    {
        try {
            $data = Sms::query()->with(['payment' => function($query) {
                $query->select('id', 'paid_amount', 'bill_id', 'party_id', 'payment_category', 'payment_type', 'cheque_number', 'description');
            }, 
            'payment.party' => function($query) {
                $query->select('id', 'email', 'name', 'address', 'mobile', 'residence', 'user_type');
            },
            'payment.bill' => function($query) {
                $query->select('id', 'amount', 'party_id', 'description');
            }])
            ->whereId($id)
            ->whereHas('payment', function ($query) {
                // Apply the whereHas condition to 'payment'
                $query
                    ->whereHas('party') // Apply the whereHas condition to 'payment.party'
                    ->whereHas('bill'); // Apply the whereHas condition to 'payment.bill'
            })
            ->first();
            return $this->sendResponse($data, 'SMS Fetched!');
        } catch (\Exception $e) {
            return $this->sendError($e->getMessage(), []);
        }
    }

    public function update(Request $request, $id)
    {   
        try {
            $validatedData = Validator::make($request->all(), [
                'status' => 'required|boolean'
            ]);

            if ($validatedData->fails()) {
                return response()->json(['error'=>$validatedData->errors()], 422);
            }

            $data = Sms::query()->whereId($id)->first();

            if(!$data) return $this->sendError('SMS not found!', []);

            $data->update($request->all());

            return $this->sendResponse($data, 'Update Successfully!');
        } catch (\Exception $e) {
            return $this->sendError($e->getMessage(), []);
        }
    }


    public function status($id)
    {
        try {
            $data = Sms::query()->select('status')->whereId($id)->first();
            return $this->sendResponse($data, 'SMS Status');
        } catch (\Exception $e) {
            return $this->sendError($e->getMessage(), []);
        }
    }
}