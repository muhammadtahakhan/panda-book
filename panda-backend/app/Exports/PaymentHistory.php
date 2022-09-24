<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\Exportable;
use App\User;
use App\models\Payment;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use Maatwebsite\Excel\Concerns\WithTitle;


class PaymentHistory implements FromQuery, WithHeadings, WithMapping, WithTitle
{

    private $apartment;
    private $id;

    public function __construct(string $apartment, int $id)
    {
        $this->apartment  = $apartment;
        $this->id  = $id;
    }


    public function query()
    {
        return Payment::where('party_id',  $this->id);
    }

    public function map($residency): array
    {
        return [
            $residency->paid_amount,
            $residency->payment_category,
            $residency->payment_type,
            $residency->description,
            $residency->cheque_number,
        ];
    }

    public function headings(): array
    {
        return [
            'Amount',
            'Category',
            'Type',
            'Month For',
            'Cheque Number'
        ];
    }
     /**
     * @return string
     */
    public function title(): string
    {
        return $this->apartment;
    }
}
