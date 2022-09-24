<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\Exportable;
use App\User;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;


class PaymentHistory implements FromQuery, WithHeadings, WithMapping, WithMultipleSheets
{
    use Exportable;
    public function query()
    {
        return User::where('user_type', 'appartment');
    }

    public function map($residency): array
    {
        return [
            $residency->email,
            $residency->name,
            $residency->address,
            $residency->balance,
        ];
    }

    public function headings(): array
    {
        return [
            'Email',
            'Name',
            'Address',
            'Balance'
        ];
    }
}
