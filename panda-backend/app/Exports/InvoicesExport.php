<?php
namespace App\Exports;

use App\User;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class InvoicesExport implements WithMultipleSheets
{
    use Exportable;



    public function __construct()
    {

    }

    /**
     * @return array
     */
    public function sheets(): array
    {
        $apartment = User::where('user_type', 'appartment')->get()->toArray();
        $sheets = [];


        foreach ($apartment as $key => $value) {
            $sheets[] = new PaymentHistory($value['address'], $value['id']);
        }


        return $sheets;
    }
}
