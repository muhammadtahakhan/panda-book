<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFieldsForTanent extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('car')->nullable();
            $table->string('tenant_name')->nullable();
            $table->string('tenant_mobile')->nullable();
            $table->string('tenant_car')->nullable();
            $table->string('tenant_two_name')->nullable();
            $table->string('tenant_two_mobile')->nullable();
            $table->string('tenant_two_car')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {

        });
    }
}
