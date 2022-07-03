<?php
    namespace App\Http\Controllers\API;

    use Illuminate\Http\Request;
    use App\Http\Controllers\Controller as Controller;
    use App\User;
    use Illuminate\Support\Facades\Auth;

    class BaseController extends Controller
    {

        protected $successStatus = 200;
        protected $actionLogout = 'LOGOUT';

        /**
         * success response method.
         *
         * @return \Illuminate\Http\Response
         */
        public function sendResponse($result, $message) {
            $response = ['success' => true, 'data' => $result, 'message' => $message,];

            return response()->json($response, $this->successStatus);
        }

        /**
         * return error response.
         *
         * @return \Illuminate\Http\Response
         */
        public function sendError($error, $errorMessages = [], $action = '', $code = 404) {
            $response = ['success' => false, 'action' => $action, 'message' => $errorMessages, 'data' => $error];
            if(!empty($errorMessages)) {
                $response['data'] = $errorMessages;
            }

            return response()->json($response, $code);
        }
    }
