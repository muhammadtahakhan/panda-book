<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\models\Ukn;
use App\User;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\API\BaseController as BaseController;
use Validator;

class UknController extends  BaseController
{
    public function list(Request $request){
        try {
            $pageSize  =  $request->query->get('page_size', 5);
            $pageIndex =  $request->query->get('page_index', 0);
            $search    =  $request->query->get('search');

            $data = Ukn::orderBy('id', 'DESC');
            if($search) {
                $data = $data->where(function($query) use($search){

                    $query = $query->orWhere('ukn', 'LIKE', "%$search%");
                    $query = $query->orWhere('uin', 'LIKE', "%$search%");

                });
            }
            $data = $data->paginate($pageSize, ['*'], 'page', $pageIndex);
            return $this->sendResponse($data, 'Ukn List');
        } catch(\Exception $e) {
            return $this->sendError($e->getMessage(), []);
        }
    }

    public function create(Request $request) {
        $data            = $request->all();
        $data = Ukn::create($data);
        if($data) {
            return $this->sendResponse($data, 'Ukn Created Successfully');
        }
        else {
            return $this->sendError($data, 'Ukn can not updat Successfully');
        }
    }

    public function update(Request $request) {
        try {
            $this->validate($request, ['id' => 'exists:ukn,id']);
            $id = $request['id'];
            $data = Ukn::findOrFail($request['id']);
            $data->update($request->all());
            if($data) {
                return $this->sendResponse($data, 'Ukn Updated Successfully');
            }
            else {
                return $this->sendError($data, 'Ukn can not update Successfully');
            }
        } catch(\Exception $e) {
            return $this->sendError($e->getMessage(), []);
        }
    }

    public function delete(Request $request) {
        try{
            $this->validate($request, ['id' => 'exists:ukn,id',]);
            $id = $request['id'];
            $data = Ukn::find($request['id'])->delete();
            if($data) {
                return $this->sendResponse($data, 'Ukn Deleted Successfully');
            }
            else {
                return $this->sendError($data, 'Ukn Deleted Successfully');
            }
        } catch(\Exception $e) {
            return $this->sendError($e->getMessage(), []);
        }
    }
}
