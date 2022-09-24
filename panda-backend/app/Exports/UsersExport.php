<?php

namespace App\Exports;

use App\User;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;


class UsersExport implements FromQuery, WithHeadings, WithMapping
{

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
            'Residency',
            'Balance'
        ];
    }
}
