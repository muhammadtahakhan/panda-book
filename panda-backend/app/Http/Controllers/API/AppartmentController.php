<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\models\Ukn;
use App\User;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\API\BaseController as BaseController;
use Validator;


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
        $input['user_type'] = "appartment";
        $user = User::create($input);

        return $this->sendResponse($user, 'Appartment Updated Successfully');
    } catch(\Exception $e) {
        return $this->sendError([], $e->getMessage());
     }
    }


    public function update_details(Request $request)
    {
        try {

            $userDetails = Auth::user();
            if( $userDetails->user_type == "admin"){
                    $validator = Validator::make($request->all(), [
                        'id' => 'required|exists:users',
                    ]);
                if ($validator->fails()) {
                        return response()->json(['error'=>$validator->errors()], 422);
                    }
                    $user = User::find($request->input('id'));
                    $userBeforeUpdate = unserialize(serialize($user));
            }else{
                $user = User::find($userDetails->id);
                $userBeforeUpdate = unserialize(serialize($user));
            }

            // dd($request);
            if (request()->has('name')) {   $user->name=$request->input('name'); }
            if (request()->has('email')) {   $user->email=$request->input('email'); }
            if (request()->has('mobile')) {   $user->mobile=$request->input('mobile'); }
            if (request()->has('address')) {   $user->address=$request->input('address'); }

            // $user->save();  // Update the data
            if( $user->save()) {
                return $this->sendResponse($user, 'Appartment Updated Successfully');
            }
            else {
                return $this->sendError([], 'Appartment Updated Successfully');
            }

            return response()->json(['success' => $user], $this->successStatus);
         } catch(\Exception $e) {
            return $this->sendError([], $e->getMessage());
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
}
