<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\models\Ukn;
use App\models\Bill;
use App\User;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\API\BaseController as BaseController;
use Validator;
use App\Exports\UsersExport;
use Maatwebsite\Excel\Facades\Excel;


class AppartmentController extends BaseController
{
    public function list(Request $request){
        try {
            $pageSize  =  $request->query->get('page_size', 10);
            $pageIndex =  $request->query->get('page_index', 0);
            $search    =  $request->query->get('search');

            $data = User::orderBy('id', 'DESC')->where('user_type', 'appartment');
            if($search) {
                $data = $data->where(function($query) use($search){

                    $query = $query->orWhere('email', 'LIKE', "%$search%");
                    $query = $query->orWhere('name', 'LIKE', "%$search%");
                    $query = $query->orWhere('address', 'LIKE', "%$search%");
                    $query = $query->orWhere('mobile', 'LIKE', "%$search%");

                });
            }
            $data = $data->paginate($pageSize, ['*'], 'page', $pageIndex);
            return $this->sendResponse($data, 'Appartment List');
        } catch(\Exception $e) {
            return $this->sendError([], $e->getMessage());
        }
    }


     /**
     * Register api
     *
     * @return \Illuminate\Http\Response
     */
    public function register(Request $request)
    {
        \DB::beginTransaction();
        try {
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'mobile' => 'required|unique:users',
            'email' => 'required|email|unique:users',
            'address' => 'required',

        ]);
     if ($validator->fails()) {
            return response()->json(['error'=>$validator->errors()], 422);
        }
      $input = $request->all();
        $input['password'] = bcrypt('987654321;');
        if (request()->has('name')) {    $input['name'] = $request->input('name'); }
        if (request()->has('email')) {    $input['email'] = $request->input('email'); }
        if (request()->has('mobile')) {    $input['mobile'] = $request->input('mobile'); }
        if (request()->has('address')) {    $input['address'] = $request->input('address'); }

        if (request()->has('car')) {    $input['car'] = $request->input('car'); }
        if (request()->has('tenant_name')) {    $input['tenant_name'] = $request->input('tenant_name'); }
        if (request()->has('tenant_mobile')) {    $input['tenant_mobile'] = $request->input('tenant_mobile'); }
        if (request()->has('tenant_car')) {    $input['tenant_car'] = $request->input('tenant_car'); }
        if (request()->has('tenant_two_name')) {    $input['tenant_two_name'] = $request->input('tenant_two_name'); }
        if (request()->has('tenant_two_mobile')) {    $input['tenant_two_mobile'] = $request->input('tenant_two_mobile'); }
        if (request()->has('tenant_two_car')) {    $input['tenant_two_car'] = $request->input('tenant_two_car'); }

        $input['user_type'] = "appartment";


            $user = User::create($input);
            if($request->input('payable_amount') !== null && $request->input('payable_amount') > 0){
                $data['amount'] = $request->input('payable_amount');
                $data['party_id'] = $user->id;
                $data['description'] = "Initial Payable amount or opening Bill";
                $data = Bill::create($data);
            }

            \DB::commit();
        return $this->sendResponse($user, 'Appartment Updated Successfully');
    } catch(\Exception $e) {
        \DB::rollback();
        return $this->sendError([], $e->getMessage());
     }
    }


    public function update_details(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'id' => 'exists:users,id',
                'email' => 'required|email|exists:users',
                'mobile' => 'required',
                'address' => 'required',

            ]);
         if ($validator->fails()) {
                return response()->json(['error'=>$validator->errors()], 422);
            }

            $id = $request['id'];
            unset($request['email']);
            $data = User::findOrFail($request['id']);
            $data = $data->update($request->all());
            if($data) {
                return $this->sendResponse($data, 'Residency Updated Successfully');
            }
            else {
                return $this->sendError($data, 'Residency can not update Successfully');
            }
        } catch(\Exception $e) {
            return $this->sendError($e->getMessage(), []);
        }
    }

    public function delete(Request $request) {
        try{
            $this->validate($request, ['id' => 'exists:users,id',]);
            $id = $request['id'];
            $data = User::find($request['id'])->delete();
            if($data) {
                return $this->sendResponse($data, 'Appartment Deleted Successfully');
            }
            else {
                return $this->sendError($data, 'Appartment Deleted Successfully');
            }
        } catch(\Exception $e) {
            return $this->sendError([], $e->getMessage());
        }
    }

    public function export()
    {
        $file = Excel::store(new UsersExport, 'public/exports/appartments.xlsx');
        return $this->sendResponse('exports/appartments.xlsx', 'Appartment Deleted Successfully');
    }
}
