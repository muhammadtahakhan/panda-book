<?php
namespace App\Http\Controllers\API;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\User;
use Illuminate\Support\Facades\Auth;
use Validator;
use Illuminate\Support\Facades\Hash;
class UserController extends  BaseController
{
public $successStatus = 200;
/**
     * login api
     *
     * @return \Illuminate\Http\Response
     */
    public function login(){

        if(Auth::attempt(['email' => request('email'), 'password' => request('password')])){
            $user = Auth::user();
            foreach(User::find($user->id)->tokens as $token) {
                $token->revoke();
            }
            $success['token'] =  $user->createToken('MyApp')->accessToken;
            $success['user'] =  $user;
            return response()->json(['success' => $success], $this->successStatus);
        }
        else{
            return response()->json(['error'=>'Invalid Email or Password'], 422);
        }
    }
     /**
     * Logout user (Revoke the token)
     *
     * @return [string] message
     */


    public function logout(Request $request) {
        if(Auth::check()) {
            $request->user()->token()->revoke();
        }

        return response()->json(['message' => 'Successfully logged out']);
    }

    public function whoami(Request $request) {
        try{
            $user = Auth::user();
            return response()->json(['success' => $user], $this->successStatus);
        } catch(\Exception $e) {
            return response()->json(['message' => $e->getMessage()], $this->successStatus);
        }
    }

    public function statics(){
        try{
            $data['regitration'] = User::where('user_type', null)->count();
            $data['otp_generated'] = User::where('user_type', null)->where('opt_generated',1)->count();
            $data['otp_verified'] = User::where('user_type', null)->where('opt_verified',1)->count();
            $data['details_submitted'] = User::where('user_type', null)->where('submit_pmex_status',1)->count();

            return response()->json(['success' => true, 'data' => $data], $this->successStatus);
        }catch(\Exception $e){
            return response()->json(['message' => $e->getMessage()], $this->successStatus);
        }
    }

    public function list(Request $request){
        try {
            $pageSize  =  $request->query->get('page_size', 5);
            $pageIndex =  $request->query->get('page_index', 0);
            $search    =  $request->query->get('search');
            $filter    =  $request->query->get('filter');



            $data = User::orderBy('id', 'DESC')->where('user_type', null);
            switch ($filter) {
                case "otpgenerated":
                    $data = $data->where('opt_generated', 1);
                  break;
                case "otpverified":
                    $data = $data->where('opt_generated', 1)->where('opt_verified', 1);
                  break;
                case "detailssubmited":
                    $data = $data->where('opt_generated', 1)->where('opt_verified', 1)->where('submit_pmex_status', 1);
                  break;
                // default:
                // break;
              }
            if($search) {
                $data = $data->where(function($query) use($search){
                    $query = $query->where('email', 'LIKE', "%$search%");
                    $query = $query->orWhere('uin', 'LIKE', "%$search%");
                    $query = $query->orWhere('mobile', 'LIKE', "%$search%");
                    $query = $query->orWhere('iban', 'LIKE', "%$search%");
                    $query = $query->orWhere('father_husband_name', 'LIKE', "%$search%");
                    $query = $query->orWhere('mailing_address', 'LIKE', "%$search%");
                    $query = $query->orWhere('phone_office', 'LIKE', "%$search%");
                    $query = $query->orWhere('phone_residence', 'LIKE', "%$search%");
                    $query = $query->orWhere('fax', 'LIKE', "%$search%");
                    $query = $query->orWhere('permanent_address', 'LIKE', "%$search%");
                    $query = $query->orWhere('job_title', 'LIKE', "%$search%");
                });
            }
            $data = $data->paginate($pageSize, ['*'], 'page', $pageIndex);
            return $this->sendResponse($data, 'Users List');
        } catch(\Exception $e) {
            return $this->sendError($e->getMessage(), []);
        }
    }

    public function changeUser(Request $request){

        try{
            $currentUser = Auth::user();

            $validator = Validator::make($request->all(), [
                'email' => 'required|email|exists:users',
            ]);
         if ($validator->fails()) {
                return response()->json(['error'=>$validator->errors()], 422);
            }

          $input = $request->all();
          $user = User::where('email', $input['email'])->first();
        //  $tt =  OauthAccessTokens::where('user_id', $user->id)->andWhere('revoked', 0)->all();
            foreach(User::find($user->id)->tokens as $token) {
             $token->delete();
            }
          $success['token'] =  $user->createToken('MyApp')->accessToken;
            return response()->json(['success' => $success], $this->successStatus);

        } catch(\Exception $e) {
            return response()->json(['message' => $e->getMessage()], $this->successStatus);
        }

    }

    /**
     * Register api
     *
     * @return \Illuminate\Http\Response
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'mobile' => 'required|unique:users',
            'email' => 'required|email|unique:users',
            'password' => 'required',
            'cpassword' => 'required|same:password',
        ]);
     if ($validator->fails()) {
            return response()->json(['error'=>$validator->errors()], 422);
        }
      $input = $request->all();
        $input['password'] = bcrypt($input['password']);
        if (request()->has('identification_type')) {  $input['identification_type'] = $request->input('identification_type'); }
        if (request()->has('residential_status')) {   $input['residential_status'] = $request->input('residential_status'); }
        if (request()->has('uin')) {                  $input['uin'] = $request->input('uin'); }
        if (request()->has('name')) {                 $input['name'] = $request->input('name'); }
        if (request()->has('issue_date')) {           $input['issue_date'] = $request->input('issue_date'); }
        if (request()->has('mobile')) {               $input['mobile'] = $request->input('mobile'); }
        if (request()->has('relationship')) {         $input['relationship'] = $request->input('relationship'); }
        if (request()->has('iban')) {                 $input['iban'] = $request->input('iban'); }
        if (request()->has('relative_uin')) {         $input['relative_uin'] = $request->input('relative_uin'); }
        $user = User::create($input);
        // $success['token'] =  $user->createToken('MyApp')->accessToken;
        $success['name'] =  $user->name;
        $success['mobile'] =  $user->mobile;
        // $this->postToCrm($user);
        // $this->sendVerificationEmail($user);
        return response()->json(['success'=>$success], $this->successStatus);
    }

    public function sendVerificationEmail($user){
        try {
            if($user->id > 0 && isset($user->email)){
                $user = User::where('id', $user->id)->first();
                $code = rand(10000,99999);
                $user->email_verification_code = $code;
                $user->email_verification_status = false;
                $user->user_hash = Hash::make($user->id);
                $user->save();
                \Mail::to($user->email)->send(new \App\Mail\verifyEmail($user));
            }
        } catch(\Exception $e) {

        }
    }

    public function verifyEmail(Request $request){
        try {
            $validator = Validator::make($request->all(), [

                'email_verification_code' => 'required|exists:users',
                'email' => 'required|email|exists:users',

            ]);
         if ($validator->fails()) {
                return response()->json(['error'=>$validator->errors()], 422);
            }

          $user = User::where('email_verification_code',  $request->input('email_verification_code'))->where('email', $request->input('email'))->first();
          $user->email_verification_status = true;
          $user->save();
          return response()->json(['success'=>$user], $this->successStatus);
        } catch(\Exception $e) {
            return response()->json(['message' => "OOPs some thing went wrong"], 500);
        }
    }

    public function postToCrm($user){

        $postData['full_name'] = $user->name;
        $postData['mobile_number'] = $user->mobile;
        $postData['email'] = $user->email;

        $curl = curl_init();
        $postData = \json_encode($postData);

        curl_setopt_array($curl, array(
          CURLOPT_URL => '103.155.145.160:8080/api/lead',
          CURLOPT_RETURNTRANSFER => true,
          CURLOPT_ENCODING => '',
          CURLOPT_MAXREDIRS => 10,
          CURLOPT_TIMEOUT => 0,
          CURLOPT_FOLLOWLOCATION => true,
          CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
          CURLOPT_USERPWD => env('CRM_USER').':'.env('CRM_PASS'),
          CURLOPT_CUSTOMREQUEST => 'POST',
          CURLOPT_POSTFIELDS => $postData,
          CURLOPT_HTTPHEADER => array(
            'Content-Type: application/json'
          ),
        ));

        $response = curl_exec($curl);

        curl_close($curl);



    }

    public function user_by_id($id){
        try {
            $user = User::find($id);
            return response()->json(['success' => true, 'data' => $user], $this->successStatus);
        } catch(\Exception $e) {
            return response()->json(['message' => $e->getMessage()], $this->successStatus);

        }

    }
    /**
     * details api
     *
     * @return \Illuminate\Http\Response
     */
    public function details()
    {
        $user = Auth::user();

        $data = array('name' => 'Peter Ordonez');
        $mail = Mail::send('muhammadtahakhan222@gmail.com', $data, function($message) {
            $message->to('peter@clarkoutsourcing.com', 'Sample Mail')->subject('Sample Mail');
            $message->from('info@infinityenergyorganisation.co.uk', 'Admin');
        });

        return response()->json($mail);

        // \Mail::to('muhammadtahakhan222@gmail.com')->send(new \App\Mail\NccplSubmitted($details));

        // dd("Email is Sent.");
        // return response()->json(['success' => $user], $this->successStatus);
    }

    public function ping()
    {
        try {
            return response()->json(['success' => true], $this->successStatus);
        }catch(\Exception $e) {
            return response()->json(['message' => $e->getMessage()], $this->successStatus);

        }

    }

    /**
     * details api
     *
     * @return \Illuminate\Http\Response
     */
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
        if (request()->has('identification_type')) {   $user->identification_type=$request->input('identification_type'); }
        if (request()->has('residential_status')) {   $user->residential_status=$request->input('residential_status'); }
        if (request()->has('uin')) {   $user->uin=$request->input('uin'); }
        if (request()->has('name')) {   $user->name=$request->input('name'); }
        if (request()->has('email')) {   $user->email=$request->input('email'); }
        if (request()->has('issue_date')) {   $user->issue_date=$request->input('issue_date'); }
        if (request()->has('mobile')) {   $user->mobile=$request->input('mobile'); }
        if (request()->has('relationship')) {   $user->relationship=$request->input('relationship'); }
        if (request()->has('iban')) {   $user->iban=$request->input('iban'); }
        if (request()->has('relative_uin')) {   $user->relative_uin=$request->input('relative_uin'); }
        if (request()->has('account_type')) {   $user->account_type=$request->input('account_type'); }
        if (request()->has('salutation')) {   $user->salutation=$request->input('salutation'); }
        if (request()->has('father_husband_name')) {   $user->father_husband_name=$request->input('father_husband_name'); }
        if (request()->has('nationality')) {   $user->nationality=$request->input('nationality'); }
        if (request()->has('material_status')) {   $user->material_status=$request->input('material_status'); }
        if (request()->has('date_of_expiry')) {   $user->date_of_expiry=$request->input('date_of_expiry'); }
        if (request()->has('lifetime')) {   $user->lifetime=$request->input('lifetime'); }
        if (request()->has('date_of_birth')) {   $user->date_of_birth=$request->input('date_of_birth'); }
        if (request()->has('mailing_address')) {   $user->mailing_address=$request->input('mailing_address'); }
        if (request()->has('country')) {   $user->country=$request->input('country'); }
        if (request()->has('province')) {   $user->province=$request->input('province'); }
        if (request()->has('city_town_village')) {   $user->city_town_village=$request->input('city_town_village'); }
        if (request()->has('other_province_state')) {   $user->other_province_state=$request->input('other_province_state'); }
        if (request()->has('other_city_town_village')) {   $user->other_city_town_village=$request->input('other_city_town_village'); }
        if (request()->has('phone_office')) {   $user->phone_office=$request->input('phone_office'); }
        if (request()->has('phone_residence')) {   $user->phone_residence=$request->input('phone_residence'); }
        if (request()->has('fax')) {   $user->fax=$request->input('fax'); }
        if (request()->has('permanent_address')) {   $user->permanent_address=$request->input('permanent_address'); }
        if (request()->has('permanent_country')) {   $user->permanent_country=$request->input('permanent_country'); }
        if (request()->has('permanent_province')) {   $user->permanent_province=$request->input('permanent_province'); }
        if (request()->has('permanent_city_town')) {   $user->permanent_city_town=$request->input('permanent_city_town'); }
        if (request()->has('permanent_other_province')) {   $user->permanent_other_province=$request->input('permanent_other_province'); }
        if (request()->has('permanent_other_city_town')) {   $user->permanent_other_city_town=$request->input('permanent_other_city_town'); }
        if (request()->has('permanent_phone_office')) {   $user->permanent_phone_office=$request->input('permanent_phone_office'); }
        if (request()->has('permanent_phone_residence')) {   $user->permanent_phone_residence=$request->input('permanent_phone_residence'); }
        if (request()->has('permanent_fax')) {   $user->permanent_fax=$request->input('permanent_fax'); }
        if (request()->has('gross_annual_income')) {   $user->gross_annual_income=$request->input('gross_annual_income'); }
        if (request()->has('source_income')) {   $user->source_income=$request->input('source_income'); }
        if (request()->has('shareholder_category')) {   $user->shareholder_category=$request->input('shareholder_category'); }
        if (request()->has('occupation')) {   $user->occupation=$request->input('occupation'); }
        if (request()->has('other_occupation')) {   $user->other_occupation=$request->input('other_occupation'); }
        if (request()->has('job_title')) {   $user->job_title=$request->input('job_title'); }
        if (request()->has('department')) {   $user->department=$request->input('department'); }
        if (request()->has('employer_name')) {   $user->employer_name=$request->input('employer_name'); }
        if (request()->has('employer_address')) {   $user->employer_address=$request->input('employer_address'); }
        if (request()->has('relative_name')) {   $user->relative_name=$request->input('relative_name'); }
        if (request()->has('bank_name')) {   $user->bank_name=$request->input('bank_name'); }
        if (request()->has('opt_generated')) {   $user->opt_generated=$request->input('opt_generated'); }
        if (request()->has('opt_verified')) {   $user->opt_verified=$request->input('opt_verified'); }
        if (request()->has('opt_code')) {   $user->opt_code=$request->input('opt_code'); }
        if (request()->has('ProofofIBAN')) {   $user->ProofofIBAN=$request->input('ProofofIBAN');
              }else{ $user->ProofofIBAN=$request->input('ProofofIBAN'); }
        if (request()->has('proofofRelationship')) {   $user->proofofRelationship=$request->input('proofofRelationship');
              }else{ $user->proofofRelationship=$request->input('proofofRelationship'); }
        if (request()->has('SIGNATURE_PROOF')) {   $user->SIGNATURE_PROOF=$request->input('SIGNATURE_PROOF'); }
        if (request()->has('EMP_ADD_PROOF')) {   $user->EMP_ADD_PROOF=$request->input('EMP_ADD_PROOF'); }
        if (request()->has('submit_pmex_status')) {   $user->submit_pmex_status=$request->input('submit_pmex_status'); }
        if (request()->has('CNIC_FRONT')) {   $user->CNIC_FRONT=$request->input('CNIC_FRONT'); }
        if (request()->has('CNIC_BACK')) {   $user->CNIC_BACK=$request->input('CNIC_BACK'); }
        if (request()->has('ADD_PROOF')) {   $user->ADD_PROOF=$request->input('ADD_PROOF'); }
        if (request()->has('TAG_DOCUMENT')) {   $user->TAG_DOCUMENT=$request->input('TAG_DOCUMENT'); }
        if (request()->has('UKN')) {   $user->UKN=$request->input('UKN'); }

        // return response()->json(['success' => [$userBeforeUpdate->opt_generated, $user->opt_generated]], 500);
        // dd($request);
         $user->save();  // Update the data

         if( $userBeforeUpdate->opt_generated == null && $user->opt_generated == 1){
             $to = explode(';', env('INFORM_TO','info.pmex@kasb.com'));
            \Mail::to($to)->send(new \App\Mail\NccplSubmitted($user));
         }

        return response()->json(['success' => $user], $this->successStatus);
    } catch(\Exception $e) {
        return response()->json(['message' => $e->getMessage()], $this->successStatus);
        // return $this->sendError($e->getMessage(), []);
    }
    }
}
