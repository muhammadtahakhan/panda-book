<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Carbon\Carbon;
use App\User;
use App\models\PasswordReset;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Validator;
use Illuminate\Support\Facades\Mail;
use App\Mail\DemoEmail;
use App\Mail\ResetCodeEmail;

class PasswordResetController extends Controller
{
    /**
     * Create token password reset
     *
     * @param  [string] email
     * @return [string] message
     */
    public function create(Request $request)
    {
        try{
                $validator = Validator::make($request->all(), [

                    'mobile' => 'required',
                    'email' => 'required|email',

                ]);
            if ($validator->fails()) {
                    return response()->json(['error'=>$validator->errors()], 422);
                }


                $user = User::where('email', $request->email)->where('mobile', $request->mobile)->first();
                if (!$user)
                    return response()->json([
                        'message' => 'We cant find a user with that e-mail or mobile.'
                    ], 404);

                $passwordReset = PasswordReset::updateOrCreate(
                    ['email' => $user->email, 'mobile' => $user->mobile],
                    [
                        'email' => $user->email,
                        'mobile' => $user->mobile,
                        'token' => mt_rand(111111,999999)
                    ]
                );

                if ($user && $passwordReset){
                    // dd($passwordReset);
                    $this->sendsms($passwordReset->mobile, $passwordReset->email, $passwordReset->token);
                    // $this->send_code_on_email($passwordReset->email, $passwordReset->token);
                }
                return response()->json([
                    'message' => 'We have sended reset code!'
                ]);
        } catch(\Exception $e) {
            return $this->sendError($e->getMessage(), []);
        }
    }

    public function sendsms($mobile, $email, $code){
        try{
       $mobile_number = preg_replace('/^0/', '92', $mobile);
       $URL = "https://gateway.its.com.pk/api?";
       $data = 'action=sendmessage&username=KASBSecurities&password=K@SB$ecurities';
       $data .= "&recipient=$mobile_number&originator=";
       $data .= "&messagedata=$code";


       $curl = curl_init();

       curl_setopt_array($curl, array(
           CURLOPT_URL => $URL.$data,
           CURLOPT_RETURNTRANSFER => true,
           CURLOPT_ENCODING => '',
           CURLOPT_MAXREDIRS => 10,
           CURLOPT_TIMEOUT => 0,
           CURLOPT_FOLLOWLOCATION => true,
           CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
           CURLOPT_CUSTOMREQUEST => 'POST',
           CURLOPT_POSTFIELDS => $data,
           CURLOPT_HTTPHEADER => array(
           'Authorization: Bearer null',
           'Content-Type: application/x-www-form-urlencoded'
           ),
       ));

       $response = curl_exec($curl);
       curl_close($curl);


    } catch(\Exception $e) {
        return $this->sendError($e->getMessage(), []);
    }


    }

    public function send_code_on_email($email,$code){


                $details = [
                'title' => 'Mail from ItSolutionStuff.com',
                'body' => 'This is for testing email using smtp'
                ];

                Mail::to($email)->send(new ResetCodeEmail($details));

    }

    /**
     * Find token password reset
     *
     * @param  [string] $token
     * @return [string] message
     * @return [json] passwordReset object
     */
    public function find($token)
    {
        $passwordReset = PasswordReset::where('token', $token)
            ->first();
        if (!$passwordReset)
            return response()->json([
                'message' => 'This password reset token is invalid.'
            ], 404);
        if (Carbon::parse($passwordReset->updated_at)->addMinutes(720)->isPast()) {
            $passwordReset->delete();
            return response()->json([
                'message' => 'This password reset token is invalid.'
            ], 404);
        }
        return response()->json($passwordReset);
    }
     /**
     * Reset password
     *
     * @param  [string] email
     * @param  [string] mobile
     * @param  [string] password
     * @param  [string] password_confirmation
     * @param  [string] token
     * @return [string] message
     * @return [json] user object
     */
    public function reset(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email',
            'mobile' => 'required|',
            'password' => 'required|string|confirmed',
            'token' => 'required|string'
        ]);
     if ($validator->fails()) {
            return response()->json(['error'=>$validator->errors()], 422);
        }

        $passwordReset = PasswordReset::where([
            ['token', $request->token],
            ['mobile', $request->mobile],
            ['email', $request->email]
        ])->first();
        if (!$passwordReset)
            return response()->json([
                'message' => 'This password reset token is invalid.'
            ], 404);

        $user = User::where('email', $passwordReset->email)->where('mobile', $passwordReset->mobile)->first();
        if (!$user)
            return response()->json([
                'message' => 'We cant find a user with that e-mail and mobile.'
            ], 404);
        $user->password = bcrypt($request->password);
        $user->email_verification_status = true;
        $user->save();
        $passwordReset->delete();
        return response()->json([
            'message' => 'Password reset successfully'
        ]);
    }
}
