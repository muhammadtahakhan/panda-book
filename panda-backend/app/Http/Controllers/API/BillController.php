<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\User;
use App\models\Bill;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\API\BaseController as BaseController;
use Validator;

class BillController extends  BaseController
{
    public function list(Request $request){
        try {
            $pageSize  =  $request->query->get('page_size', 5);
            $pageIndex =  $request->query->get('page_index', 0);
            $search    =  $request->query->get('search');

            $data = Bill::orderBy('id', 'DESC');
            if($search) {
                $data = $data->where(function($query) use($search){

                    $query = $query->orWhere('Bill', 'LIKE', "%$search%");
                    $query = $query->orWhere('uin', 'LIKE', "%$search%");

                });
            }
            $data = $data->paginate($pageSize, ['*'], 'page', $pageIndex);
            return $this->sendResponse($data, 'Bill List');
        } catch(\Exception $e) {
            return $this->sendError([], $e->getMessage());
        }
    }

    public function create(Request $request) {
        $currentUser = Auth::user();

        $validator = Validator::make($request->all(), [
            'amount' => 'required|numeric',
            'party_id' => 'required|exists:users,id',
            'description' => 'required'
        ]);
        if ($validator->fails()) {
            return response()->json(['error'=>$validator->errors()], 422);
        }

        $data            = $request->all();
        $data = Bill::create($data);
        if($data) {
            return $this->sendResponse($data, 'Bill Created Successfully');
        }
        else {
            return $this->sendError($data, 'Bill can not updat Successfully');
        }
    }

    public function create_for_all(Request $request) {
        $currentUser = Auth::user();

        $validator = Validator::make($request->all(), [
            'amount' => 'required|numeric',
            'description' => 'required'
        ]);
        if ($validator->fails()) {
            return response()->json(['error'=>$validator->errors()], 422);
        }

        $data            = $request->all();
        $res = [];
        $apparments = User::where('user_type','appartment')->get();
        foreach ($apparments as $key => $value) {
            $data['party_id'] = $value['id'];
            $res[] = Bill::create($data);
        }

        if($res) {
            return $this->sendResponse($res, 'Bill Created Successfully');
        }
        else {
            return $this->sendError($data, 'Bill can not updat Successfully');
        }
    }



    public function delete(Request $request) {
        try{
            $validator = Validator::make($request->all(), [
                'id' => 'required|exists:bills,id,deleted_at,NULL',
            ]);
            if ($validator->fails()) {
                return response()->json(['error'=>$validator->errors()], 422);
            }

            $id = $request['id'];
            $data = Bill::find($request['id'])->delete();
            if($data) {
                return $this->sendResponse($data, 'Bill Deleted Successfully');
            }
            else {
                return $this->sendError($data, 'Bill Deleted Successfully');
            }
        } catch(\Exception $e) {
            return $this->sendError([], $e->getMessage());
        }
    }
}
