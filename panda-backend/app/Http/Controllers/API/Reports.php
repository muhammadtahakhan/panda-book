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
use App\Exports\InvoicesExport;
use Maatwebsite\Excel\Facades\Excel;

class Reports extends BaseController
{
    public function export()
    {
        $file = Excel::store(new UsersExport, 'public/exports/appartments.xlsx');
        return $this->sendResponse('exports/appartments.xlsx', 'Appartment Report Generated Successfully');
    }

    public function history()
    {
        $file = Excel::store(new InvoicesExport(), 'public/exports/history.xlsx');
        return $this->sendResponse('exports/history.xlsx', 'Appartment History Report Generated Successfully');
    }
}
