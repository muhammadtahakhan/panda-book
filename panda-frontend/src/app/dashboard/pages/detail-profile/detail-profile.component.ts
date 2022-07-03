import { Component, HostListener, OnInit } from '@angular/core';


import * as moment from 'moment';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/shared/service/auth.service';
import { GlobalEventService } from 'src/app/shared/_helpers/global-event.service';

import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { debounceTime, delay, map, takeUntil } from 'rxjs/operators';

export const APP_DATE_FORMATS = {
    parse: {
        dateInput: 'input',
    },
    display: {
        dateInput: 'DD-MMM-yyyy',
        monthYearLabel: 'MMMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY'
    },
};

@Component({
  selector: 'app-detail-profile',
  templateUrl: './detail-profile.component.html',
  styleUrls: ['./detail-profile.component.css'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]},
    // { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } }
]
})
export class DetailProfileComponent implements OnInit {


  Identity = [
    {'value':"CNIC", 'viewValue':"CNIC"},
    {'value':"SNIC", 'viewValue':"SNIC"},
    {'value':"NICOP", 'viewValue':"NICOP"},
    {'value':"POC", 'viewValue':"POC"},
  ]

  residential_status = [
    {'value':"01" , 'viewValue':"Resident"},
    {'value':"02", 'viewValue':" Non-Resident"},
  ]

  relationship= [
    {'value':"01", 'viewValue':"Self"},
    {'value':"02", 'viewValue':"Father"},
    {'value':"03", 'viewValue':"Mother"},
    {'value':"04", 'viewValue':"Son"},
    {'value':"05", 'viewValue':"Daughter"},
    {'value':"06", 'viewValue':"Husband"},
    {'value':"07", 'viewValue':"Company"},
  ]

  annual_income= [
    {'value':"J05 ", 'viewValue':"1,000,001 - 2,500,000"},
    {'value':"J06", 'viewValue':"Above 2,500,000"},
    {'value':"J01", 'viewValue':"UP TO 100,000"},
    {'value':"J02", 'viewValue':"100,001 - 250,000"},
    {'value':"J03", 'viewValue':"250,001 - 500,000"},
    {'value':"J04", 'viewValue':"500,001 - 1,000,000"},

  ]



  account_type= [
    {'value':"NKA", 'viewValue':"Normal Account"},
    {'value':"SKA", 'viewValue':"Sahulat Account "}
  ]

  salutation= [
    {'value':"MR", 'viewValue':"MR"},
    {'value':"MRS", 'viewValue':"MRS"},
    {'value':"MS", 'viewValue':"MS"},
    {'value':"Blank", 'viewValue':"Blank"}
  ]

  filteredNationality: any = [];
  nationality= [
    {'value':"PAK", 'viewValue':"PAKISTAN"},
    {'value':"AS", 'viewValue':"AMERICAN SAMOA"},
    {'value':"GI", 'viewValue':"GIBRALTAR"},
    {'value':"TH", 'viewValue':"THAILAND"},
    {'value':"GE", 'viewValue':"GEORGIA"},
    {'value':"SY", 'viewValue':"SYRIAN ARAB REPUBLIC"},
    {'value':"SE", 'viewValue':"SWEDEN"},
    {'value':"SD", 'viewValue':"SUDAN"},
    {'value':"TN", 'viewValue':"TUNISIA"},
    {'value':"ER", 'viewValue':"ERITREA"},
    {'value':"SL", 'viewValue':"SIERRA LEONE"},
    {'value':"EC", 'viewValue':"ECUADOR"},
    {'value':"DO", 'viewValue':"DOMINICAN REPUBLIC"},
    {'value':"DJ", 'viewValue':"DJIBOUTI"},
    {'value':"CY", 'viewValue':"CYPRUS"},
    {'value':"CU", 'viewValue':"CUBA"},
    {'value':"RU", 'viewValue':"RUSSIAN FEDERATION"},
    {'value':"SB", 'viewValue':"SOLOMON ISLANDS"},
    {'value':"QA", 'viewValue':"QATAR"},
    {'value':"CR", 'viewValue':"COSTA RICA"},
    {'value':"PY", 'viewValue':"PARAGUAY"},
    {'value':"PE", 'viewValue':"PERU"},
    {'value':"OM", 'viewValue':"OMAN"},
    {'value':"PG", 'viewValue':"PAPUA NEW GUINEA"},
    {'value':"NI", 'viewValue':"NICARAGUA"},
    {'value':"AN", 'viewValue':"NETHERLANDS ANTILLES"},
    {'value':"NZ", 'viewValue':"NEW ZEALAND"},
    {'value':"KH", 'viewValue':"CAMBODIA"},
    {'value':"CM", 'viewValue':"CAMEROON"},
    {'value':"BG", 'viewValue':"BULGARIA"},
    {'value':"AF", 'viewValue':"AFGHANISTAN"},
    {'value':"DZ", 'viewValue':"ALGERIA"},
    {'value':"KI", 'viewValue':"KIRIBATI"},
    {'value':"KP", 'viewValue':"KOREA, NORTH"},
    {'value':"AO", 'viewValue':"ANGOLA"},
    {'value':"LV", 'viewValue':"LATVIA"},
    {'value':"KW", 'viewValue':"KUWAIT"},
    {'value':"LA", 'viewValue':"LAO PEOPLES DEMOCRATIC REPUBLIC"},
    {'value':"LB", 'viewValue':"LEBANON"},
    {'value':"LR", 'viewValue':"LIBERIA"},
    {'value':"LY", 'viewValue':"LIBYAN ARAB JAMAHIRIYA"},
    {'value':"LI", 'viewValue':"LIECHTENSTEIN"},
    {'value':"LT", 'viewValue':"LITHUANIA"},
    {'value':"AZ", 'viewValue':"AZERBAIJAN"},
    {'value':"BS", 'viewValue':"BAHAMAS"},
    {'value':"BH", 'viewValue':"BAHRAIN"},
    {'value':"MK", 'viewValue':"MACEDONIA"},
    {'value':"BD", 'viewValue':"BANGLADESH"},
    {'value':"MG", 'viewValue':"MADAGASCAR"},
    {'value':"MW", 'viewValue':"MALAWI"},
    {'value':"BB", 'viewValue':"BARBADOS"},
    {'value':"MY", 'viewValue':"MALAYSIA"},
    {'value':"BY", 'viewValue':"BELARU"},
    {'value':"MV", 'viewValue':"MALDIVES"},
    {'value':"MU", 'viewValue':"MAURITIUS"},
    {'value':"BT", 'viewValue':"BHUTAN"},
    {'value':"MD", 'viewValue':"MOLDOVA, REPUBLIC OF"},
    {'value':"BV", 'viewValue':"BOUVET ISLAND"},
    {'value':"MA", 'viewValue':"MOROCCO"},
    {'value':"NA", 'viewValue':"NAMIBIA"},
    {'value':"CN", 'viewValue':"CHINA"},
    {'value':"UA", 'viewValue':"UKRAINE"},
    {'value':"GT", 'viewValue':"GUATEMALA"},
    {'value':"GY", 'viewValue':"GUYANA"},
    {'value':"VE", 'viewValue':"VENEZUELA"},
    {'value':"ZM", 'viewValue':"ZAMBIA"},
    {'value':"JM", 'viewValue':"JAMAICA"},
    {'value':"IQ", 'viewValue':"IRAQ"},
    {'value':"JO", 'viewValue':"JORDAN"},
    {'value':"CX", 'viewValue':"CHRISTMAS ISLAND"},
    {'value':"TD", 'viewValue':"CHAD"},
    {'value':"BF", 'viewValue':"BURKINA FASO"},
    {'value':"BE", 'viewValue':"BELGIUM"},
    {'value':"AT", 'viewValue':"AUSTRIA"},
    {'value':"AU", 'viewValue':"AUSTRALIA"},
    {'value':"AG", 'viewValue':"ANTIGUA AND BARBUDA"},
    {'value':"BJ", 'viewValue':"BENIN"},
    {'value':"CA", 'viewValue':"CANADA"},
    {'value':"CF", 'viewValue':"CENTRAL AFRICAN REPUBLIC"},
    {'value':"GA", 'viewValue':"GABON"},
    {'value':"CC", 'viewValue':"COCOS KELLING ISLAND"},
    {'value':"CG", 'viewValue':"CONGO - REPUBLIC OF"},
    {'value':"CK", 'viewValue':"COOK ISLANDS"},
    {'value':"DM", 'viewValue':"DOMINICA"},
    {'value':"FO", 'viewValue':"FAROE ISLANDS"},
    {'value':"FI", 'viewValue':"FINLAND"},
    {'value':"MQ", 'viewValue':"MARTINIQUE"},
    {'value':"GR", 'viewValue':"GREECE"},
    {'value':"GU", 'viewValue':"GUAM"},
    {'value':"GW", 'viewValue':"GUINEA-BISSAU"},
    {'value':"NR", 'viewValue':"NAURU"},
    {'value':"PW", 'viewValue':"PALAU"},
    {'value':"VC", 'viewValue':"SAINT VI-GRENADINES"},
    {'value':"TW", 'viewValue':"TAIWAN"},
    {'value':"TK", 'viewValue':"TOKELAU"},
    {'value':"UG", 'viewValue':"UGANDA"},
    {'value':"GB", 'viewValue':"UNITED KINGDOM"},
    {'value':"NO", 'viewValue':"NORWAY"},
    {'value':"PH", 'viewValue':"PHILIPPINES"},
    {'value':"PN", 'viewValue':"PITCAIRN"},
    {'value':"PT", 'viewValue':"PORTUGAL"},
    {'value':"RO", 'viewValue':"ROMANIA"},
    {'value':"LC", 'viewValue':"SAINT LUCIA"},
    {'value':"SN", 'viewValue':"SENEGAL"},
    {'value':"CH", 'viewValue':"SWITZERLAND"},
    {'value':"YE", 'viewValue':"YEMEN"},
    {'value':"VG", 'viewValue':"VIRGIN ISLANDS - GB"},
    {'value':"AE", 'viewValue':"UNITED ARAB EMIRATES"},
    {'value':"TV", 'viewValue':"TUVALU"},
    {'value':"HN", 'viewValue':"HONDURAS"},
    {'value':"TT", 'viewValue':"TRINIDAD AND TOBAGO"},
    {'value':"FJ", 'viewValue':"FIJI"},
    {'value':"ET", 'viewValue':"ETHIOPIA"},
    {'value':"HT", 'viewValue':"HAITI"},
    {'value':"TO", 'viewValue':"TONGA"},
    {'value':"TJ", 'viewValue':"TAJIKISTAN"},
    {'value':"GS", 'viewValue':"SOUTH GEORGIA - SOUTH SANDWICH ISLANDS"},
    {'value':"SC", 'viewValue':"SEYCHELLES"},
    {'value':"SA", 'viewValue':"SAUDI ARABIA"},
    {'value':"ST", 'viewValue':"SAO TOME AND PRINCIPE"},
    {'value':"TP", 'viewValue':"EAST TIMOR"},
    {'value':"DK", 'viewValue':"DENMARK"},
    {'value':"CZ", 'viewValue':"CZECH REPUBLIC"},
    {'value':"RW", 'viewValue':"RWANDA"},
    {'value':"EG", 'viewValue':"EGYPT"},
    {'value':"PA", 'viewValue':"PANAMA"},
    {'value':"CL", 'viewValue':"CHILE"},
    {'value':"KY", 'viewValue':"CAYMAN ISLANDS"},
    {'value':"BI", 'viewValue':"BURUNDI"},
    {'value':"MM", 'viewValue':"MYANMAR"},
    {'value':"MZ", 'viewValue':"MOZAMBIQUE"},
    {'value':"AL", 'viewValue':"ALBANIA"},
    {'value':"KG", 'viewValue':"KYRGYZSTAN"},
    {'value':"AI", 'viewValue':"ANGUILLA"},
    {'value':"AR", 'viewValue':"ARGENTINA"},
    {'value':"AW", 'viewValue':"ARUBA"},
    {'value':"MO", 'viewValue':"MACAU"},
    {'value':"LS", 'viewValue':"LESOTHO"},
    {'value':"MT", 'viewValue':"MALTA"},
    {'value':"ML", 'viewValue':"MALI"},
    {'value':"MH", 'viewValue':"MARSHALL ISLANDS"},
    {'value':"BZ", 'viewValue':"BELIZE"},
    {'value':"BM", 'viewValue':"BERMUDA"},
    {'value':"BA", 'viewValue':"BOSNIA AND HERZEGOVINA"},
    {'value':"BW", 'viewValue':"BOTSWANA"},
    {'value':"MN", 'viewValue':"MONGOLIA"},
    {'value':"NP", 'viewValue':"NEPAL"},
    {'value':"TR", 'viewValue':"TURKEY"},
    {'value':"GN", 'viewValue':"GUINEA"},
    {'value':"KZ", 'viewValue':"KAZAKHSTAN"},
    {'value':"HK", 'viewValue':"HONG KONG"},
    {'value':"VN", 'viewValue':"VIETNAM"},
    {'value':"IL", 'viewValue':"ISRAEL"},
    {'value':"IR", 'viewValue':"IRAN ISLAMIC REPUBLIC OF IRAN"},
    {'value':"HU", 'viewValue':"HUNGARY"},
    {'value':"ZW", 'viewValue':"ZIMBABWE"},
    {'value':"VU", 'viewValue':"VANUATU"},
    {'value':"JP", 'viewValue':"JAPAN"},
    {'value':"AD", 'viewValue':"ANDORRA"},
    {'value':"IO", 'viewValue':"BRITISH INDIAN OCEAN TERRITORY"},
    {'value':"GL", 'viewValue':"GREENLAND"},
    {'value':"GP", 'viewValue':"GUADELOUPE"},
    {'value':"IN", 'viewValue':"INDIA"},
    {'value':"ID", 'viewValue':"INDONESIA"},
    {'value':"IE", 'viewValue':"IRELAND"},
    {'value':"MC", 'viewValue':"MONACO"},
    {'value':"FM", 'viewValue':"MICRONESIAFEDERATED"},
    {'value':"LU", 'viewValue':"LUXEMBOURG"},
    {'value':"IT", 'viewValue':"ITALY"},
    {'value':"DE", 'viewValue':"GERMANY"},
    {'value':"GD", 'viewValue':"GRENADA"},
    {'value':"TC", 'viewValue':"TURKS-CAICOS ISLANDS"},
    {'value':"UM", 'viewValue':"US MINOR OUTLYING"},
    {'value':"KE", 'viewValue':"KENYA"},
    {'value':"YU", 'viewValue':"YUGOSLAVIA"},
    {'value':"FK", 'viewValue':"FALKLAND ISLANDS MALVINAS"},
    {'value':"GH", 'viewValue':"GHANA"},
    {'value':"EE", 'viewValue':"ESTONIA"},
    {'value':"SZ", 'viewValue':"SWAZILAND"},
    {'value':"ZA", 'viewValue':"SOUTH AFRICA"},
    {'value':"HR", 'viewValue':"CROATIA HRVATSKA"},
    {'value':"SO", 'viewValue':"SOMALIA"},
    {'value':"CD", 'viewValue':"CONGO-BRAZZAVILLE"},
    {'value':"KM", 'viewValue':"COMOROS"},
    {'value':"PL", 'viewValue':"POLAND"},
    {'value':"NG", 'viewValue':"NIGERIA"},
    {'value':"CV", 'viewValue':"CAPE VERDE"},
    {'value':"NC", 'viewValue':"NEW CALEDONIA"},
    {'value':"AM", 'viewValue':"ARMENIA"},
    {'value':"MR", 'viewValue':"MAURITANIA"},
    {'value':"BO", 'viewValue':"BOLIVIA"},
    {'value':"BR", 'viewValue':"BRAZIL"},
    {'value':"BN", 'viewValue':"BRUNEI DARUSSALAM"},
    {'value':"SV", 'viewValue':"EL SALVADOR"},
    {'value':"SR", 'viewValue':"SURINAME"},
    {'value':"GM", 'viewValue':"GAMBIA"},
    {'value':"IS", 'viewValue':"ICELAND"},
    {'value':"CO", 'viewValue':"COLOMBIA"},
    {'value':"FR", 'viewValue':"FRANCE"},
    {'value':"YT", 'viewValue':"MAYOTTE"},
    {'value':"CI", 'viewValue':"IVORY COAST"},
    {'value':"NL", 'viewValue':"NETHERLANDS"},
    {'value':"RE", 'viewValue':"REUNION"},
    {'value':"KN", 'viewValue':"SAINT KITTS"},
    {'value':"NF", 'viewValue':"NORFOLK ISLAND"},
    {'value':"NU", 'viewValue':"NIUE"},
    {'value':"VA", 'viewValue':"VATICAN CITY STATE"},
    {'value':"VI", 'viewValue':"VIRGIN ISLANDS - US"},
    {'value':"SM", 'viewValue':"SAN MARINO"},
    {'value':"SI", 'viewValue':"SLOVENIA"},
    {'value':"WF", 'viewValue':"WALLIS-FUTUNA ISLAND"},
    {'value':"UZ", 'viewValue':"UZBEKISTAN"},
    {'value':"GF", 'viewValue':"FRENCH GUIANA"},
    {'value':"TF", 'viewValue':"FRENCH SOUTHERN TERR"},
    {'value':"PF", 'viewValue':"FRENCH POLYNESIA"},
    {'value':"GQ", 'viewValue':"EQUATORIAL GUINEA"},
    {'value':"MS", 'viewValue':"MONTSERRAT"},
    {'value':"HM", 'viewValue':"HEARDMCDONALD ISLAND"},
    {'value':"MX", 'viewValue':"MEXICO"},
    {'value':"NE", 'viewValue':"NIGER"},
    {'value':"SJ", 'viewValue':"SVALBARD-JAN MAYEN"},
    {'value':"EH", 'viewValue':"WESTERN SAHARA"},
    {'value':"MP", 'viewValue':"NORTH MARIANA ISLAND"},
    {'value':"PR", 'viewValue':"PUERTO RICO"},
    {'value':"WS", 'viewValue':"SAMOA"},
    {'value':"SG", 'viewValue':"SINGAPORE"},
    {'value':"ES", 'viewValue':"SPAIN"},
    {'value':"LK", 'viewValue':"SRI LANKA"},
    {'value':"TM", 'viewValue':"TURKMENISTAN"},
    {'value':"TG", 'viewValue':"TOGO"},
    {'value':"TZ", 'viewValue':"TANZANIA"},
    {'value':"KR", 'viewValue':"KOREA, SOUTH"},
    {'value':"US", 'viewValue':"UNITED STATES"},
    {'value':"UY", 'viewValue':"URUGUAY"},
    {'value':"SAT", 'viewValue':"SAMAO"}

  ]

  material_status= [
    {'value':"S", 'viewValue':"Single"},
    {'value':"M", 'viewValue':"Married"}

  ]

  filteredCountry: any = [];
  filteredOtherCountry: any = [];
  filteredPermanentCountry: any = [];

  country = [
    {'value':"PAK", 'viewValue':"PAKISTAN"},
{'value':"AS", 'viewValue':"AMERICAN SAMOA"},
{'value':"GI", 'viewValue':"GIBRALTAR"},
{'value':"TH", 'viewValue':"THAILAND"},
{'value':"GE", 'viewValue':"GEORGIA"},
{'value':"SY", 'viewValue':"SYRIAN ARAB REPUBLIC"},
{'value':"SE", 'viewValue':"SWEDEN"},
{'value':"SD", 'viewValue':"SUDAN"},
{'value':"TN", 'viewValue':"TUNISIA"},
{'value':"ER", 'viewValue':"ERITREA"},
{'value':"SL", 'viewValue':"SIERRA LEONE"},
{'value':"EC", 'viewValue':"ECUADOR"},
{'value':"DO", 'viewValue':"DOMINICAN REPUBLIC"},
{'value':"DJ", 'viewValue':"DJIBOUTI"},
{'value':"CY", 'viewValue':"CYPRUS"},
{'value':"CU", 'viewValue':"CUBA"},
{'value':"RU", 'viewValue':"RUSSIAN FEDERATION"},
{'value':"SB", 'viewValue':"SOLOMON ISLANDS"},
{'value':"QA", 'viewValue':"QATAR"},
{'value':"CR", 'viewValue':"COSTA RICA"},
{'value':"PY", 'viewValue':"PARAGUAY"},
{'value':"PE", 'viewValue':"PERU"},
{'value':"OM", 'viewValue':"OMAN"},
{'value':"PG", 'viewValue':"PAPUA NEW GUINEA"},
{'value':"NI", 'viewValue':"NICARAGUA"},
{'value':"AN", 'viewValue':"NETHERLANDS ANTILLES"},
{'value':"NZ", 'viewValue':"NEW ZEALAND"},
{'value':"KH", 'viewValue':"CAMBODIA"},
{'value':"CM", 'viewValue':"CAMEROON"},
{'value':"BG", 'viewValue':"BULGARIA"},
{'value':"AF", 'viewValue':"AFGHANISTAN"},
{'value':"DZ", 'viewValue':"ALGERIA"},
{'value':"KI", 'viewValue':"KIRIBATI"},
{'value':"KP", 'viewValue':"KOREA, NORTH"},
{'value':"AO", 'viewValue':"ANGOLA"},
{'value':"LV", 'viewValue':"LATVIA"},
{'value':"KW", 'viewValue':"KUWAIT"},
{'value':"LA", 'viewValue':"LAO PEOPLES DEMOCRATIC REPUBLIC"},
{'value':"LB", 'viewValue':"LEBANON"},
{'value':"LR", 'viewValue':"LIBERIA"},
{'value':"LY", 'viewValue':"LIBYAN ARAB JAMAHIRIYA"},
{'value':"LI", 'viewValue':"LIECHTENSTEIN"},
{'value':"LT", 'viewValue':"LITHUANIA"},
{'value':"AZ", 'viewValue':"AZERBAIJAN"},
{'value':"BS", 'viewValue':"BAHAMAS"},
{'value':"BH", 'viewValue':"BAHRAIN"},
{'value':"MK", 'viewValue':"MACEDONIA"},
{'value':"BD", 'viewValue':"BANGLADESH"},
{'value':"MG", 'viewValue':"MADAGASCAR"},
{'value':"MW", 'viewValue':"MALAWI"},
{'value':"BB", 'viewValue':"BARBADOS"},
{'value':"MY", 'viewValue':"MALAYSIA"},
{'value':"BY", 'viewValue':"BELARU"},
{'value':"MV", 'viewValue':"MALDIVES"},
{'value':"MU", 'viewValue':"MAURITIUS"},
{'value':"BT", 'viewValue':"BHUTAN"},
{'value':"MD", 'viewValue':"MOLDOVA, REPUBLIC OF"},
{'value':"BV", 'viewValue':"BOUVET ISLAND"},
{'value':"MA", 'viewValue':"MOROCCO"},
{'value':"NA", 'viewValue':"NAMIBIA"},
{'value':"CN", 'viewValue':"CHINA"},
{'value':"UA", 'viewValue':"UKRAINE"},
{'value':"GT", 'viewValue':"GUATEMALA"},
{'value':"GY", 'viewValue':"GUYANA"},
{'value':"VE", 'viewValue':"VENEZUELA"},
{'value':"ZM", 'viewValue':"ZAMBIA"},
{'value':"JM", 'viewValue':"JAMAICA"},
{'value':"IQ", 'viewValue':"IRAQ"},
{'value':"JO", 'viewValue':"JORDAN"},
{'value':"CX", 'viewValue':"CHRISTMAS ISLAND"},
{'value':"TD", 'viewValue':"CHAD"},
{'value':"BF", 'viewValue':"BURKINA FASO"},
{'value':"BE", 'viewValue':"BELGIUM"},
{'value':"AT", 'viewValue':"AUSTRIA"},
{'value':"AU", 'viewValue':"AUSTRALIA"},
{'value':"AG", 'viewValue':"ANTIGUA AND BARBUDA"},
{'value':"BJ", 'viewValue':"BENIN"},
{'value':"CA", 'viewValue':"CANADA"},
{'value':"CF", 'viewValue':"CENTRAL AFRICAN REPUBLIC"},
{'value':"GA", 'viewValue':"GABON"},
{'value':"CC", 'viewValue':"COCOS KELLING ISLAND"},
{'value':"CG", 'viewValue':"CONGO - REPUBLIC OF"},
{'value':"CK", 'viewValue':"COOK ISLANDS"},
{'value':"DM", 'viewValue':"DOMINICA"},
{'value':"FO", 'viewValue':"FAROE ISLANDS"},
{'value':"FI", 'viewValue':"FINLAND"},
{'value':"MQ", 'viewValue':"MARTINIQUE"},
{'value':"GR", 'viewValue':"GREECE"},
{'value':"GU", 'viewValue':"GUAM"},
{'value':"GW", 'viewValue':"GUINEA-BISSAU"},
{'value':"NR", 'viewValue':"NAURU"},
{'value':"PW", 'viewValue':"PALAU"},
{'value':"VC", 'viewValue':"SAINT VI-GRENADINES"},
{'value':"TW", 'viewValue':"TAIWAN"},
{'value':"TK", 'viewValue':"TOKELAU"},
{'value':"UG", 'viewValue':"UGANDA"},
{'value':"GB", 'viewValue':"UNITED KINGDOM"},
{'value':"NO", 'viewValue':"NORWAY"},
{'value':"PH", 'viewValue':"PHILIPPINES"},
{'value':"PN", 'viewValue':"PITCAIRN"},
{'value':"PT", 'viewValue':"PORTUGAL"},
{'value':"RO", 'viewValue':"ROMANIA"},
{'value':"LC", 'viewValue':"SAINT LUCIA"},
{'value':"SN", 'viewValue':"SENEGAL"},
{'value':"CH", 'viewValue':"SWITZERLAND"},
{'value':"YE", 'viewValue':"YEMEN"},
{'value':"VG", 'viewValue':"VIRGIN ISLANDS - GB"},
{'value':"AE", 'viewValue':"UNITED ARAB EMIRATES"},
{'value':"TV", 'viewValue':"TUVALU"},
{'value':"HN", 'viewValue':"HONDURAS"},
{'value':"TT", 'viewValue':"TRINIDAD AND TOBAGO"},
{'value':"FJ", 'viewValue':"FIJI"},
{'value':"ET", 'viewValue':"ETHIOPIA"},
{'value':"HT", 'viewValue':"HAITI"},
{'value':"TO", 'viewValue':"TONGA"},
{'value':"TJ", 'viewValue':"TAJIKISTAN"},
{'value':"GS", 'viewValue':"SOUTH GEORGIA - SOUTH SANDWICH ISLANDS"},
{'value':"SC", 'viewValue':"SEYCHELLES"},
{'value':"SA", 'viewValue':"SAUDI ARABIA"},
{'value':"ST", 'viewValue':"SAO TOME AND PRINCIPE"},
{'value':"TP", 'viewValue':"EAST TIMOR"},
{'value':"DK", 'viewValue':"DENMARK"},
{'value':"CZ", 'viewValue':"CZECH REPUBLIC"},
{'value':"RW", 'viewValue':"RWANDA"},
{'value':"EG", 'viewValue':"EGYPT"},
{'value':"PA", 'viewValue':"PANAMA"},
{'value':"CL", 'viewValue':"CHILE"},
{'value':"KY", 'viewValue':"CAYMAN ISLANDS"},
{'value':"BI", 'viewValue':"BURUNDI"},
{'value':"MM", 'viewValue':"MYANMAR"},
{'value':"MZ", 'viewValue':"MOZAMBIQUE"},
{'value':"AL", 'viewValue':"ALBANIA"},
{'value':"KG", 'viewValue':"KYRGYZSTAN"},
{'value':"AI", 'viewValue':"ANGUILLA"},
{'value':"AR", 'viewValue':"ARGENTINA"},
{'value':"AW", 'viewValue':"ARUBA"},
{'value':"MO", 'viewValue':"MACAU"},
{'value':"LS", 'viewValue':"LESOTHO"},
{'value':"MT", 'viewValue':"MALTA"},
{'value':"ML", 'viewValue':"MALI"},
{'value':"MH", 'viewValue':"MARSHALL ISLANDS"},
{'value':"BZ", 'viewValue':"BELIZE"},
{'value':"BM", 'viewValue':"BERMUDA"},
{'value':"BA", 'viewValue':"BOSNIA AND HERZEGOVINA"},
{'value':"BW", 'viewValue':"BOTSWANA"},
{'value':"MN", 'viewValue':"MONGOLIA"},
{'value':"NP", 'viewValue':"NEPAL"},
{'value':"TR", 'viewValue':"TURKEY"},
{'value':"GN", 'viewValue':"GUINEA"},
{'value':"KZ", 'viewValue':"KAZAKHSTAN"},
{'value':"HK", 'viewValue':"HONG KONG"},
{'value':"VN", 'viewValue':"VIETNAM"},
{'value':"IL", 'viewValue':"ISRAEL"},
{'value':"IR", 'viewValue':"IRAN ISLAMIC REPUBLIC OF IRAN"},
{'value':"HU", 'viewValue':"HUNGARY"},
{'value':"ZW", 'viewValue':"ZIMBABWE"},
{'value':"VU", 'viewValue':"VANUATU"},
{'value':"JP", 'viewValue':"JAPAN"},
{'value':"AD", 'viewValue':"ANDORRA"},
{'value':"IO", 'viewValue':"BRITISH INDIAN OCEAN TERRITORY"},
{'value':"GL", 'viewValue':"GREENLAND"},
{'value':"GP", 'viewValue':"GUADELOUPE"},
{'value':"IN", 'viewValue':"INDIA"},
{'value':"ID", 'viewValue':"INDONESIA"},
{'value':"IE", 'viewValue':"IRELAND"},
{'value':"MC", 'viewValue':"MONACO"},
{'value':"FM", 'viewValue':"MICRONESIAFEDERATED"},
{'value':"LU", 'viewValue':"LUXEMBOURG"},
{'value':"IT", 'viewValue':"ITALY"},
{'value':"DE", 'viewValue':"GERMANY"},
{'value':"GD", 'viewValue':"GRENADA"},
{'value':"TC", 'viewValue':"TURKS-CAICOS ISLANDS"},
{'value':"UM", 'viewValue':"US MINOR OUTLYING"},
{'value':"KE", 'viewValue':"KENYA"},
{'value':"YU", 'viewValue':"YUGOSLAVIA"},
{'value':"FK", 'viewValue':"FALKLAND ISLANDS MALVINAS"},
{'value':"GH", 'viewValue':"GHANA"},
{'value':"EE", 'viewValue':"ESTONIA"},
{'value':"SZ", 'viewValue':"SWAZILAND"},
{'value':"ZA", 'viewValue':"SOUTH AFRICA"},
{'value':"HR", 'viewValue':"CROATIA HRVATSKA"},
{'value':"SO", 'viewValue':"SOMALIA"},
{'value':"CD", 'viewValue':"CONGO-BRAZZAVILLE"},
{'value':"KM", 'viewValue':"COMOROS"},
{'value':"PL", 'viewValue':"POLAND"},
{'value':"NG", 'viewValue':"NIGERIA"},
{'value':"CV", 'viewValue':"CAPE VERDE"},
{'value':"NC", 'viewValue':"NEW CALEDONIA"},
{'value':"AM", 'viewValue':"ARMENIA"},
{'value':"MR", 'viewValue':"MAURITANIA"},
{'value':"BO", 'viewValue':"BOLIVIA"},
{'value':"BR", 'viewValue':"BRAZIL"},
{'value':"BN", 'viewValue':"BRUNEI DARUSSALAM"},
{'value':"SV", 'viewValue':"EL SALVADOR"},
{'value':"SR", 'viewValue':"SURINAME"},
{'value':"GM", 'viewValue':"GAMBIA"},
{'value':"IS", 'viewValue':"ICELAND"},
{'value':"CO", 'viewValue':"COLOMBIA"},
{'value':"FR", 'viewValue':"FRANCE"},
{'value':"YT", 'viewValue':"MAYOTTE"},
{'value':"CI", 'viewValue':"IVORY COAST"},
{'value':"NL", 'viewValue':"NETHERLANDS"},
{'value':"RE", 'viewValue':"REUNION"},
{'value':"KN", 'viewValue':"SAINT KITTS"},
{'value':"NF", 'viewValue':"NORFOLK ISLAND"},
{'value':"NU", 'viewValue':"NIUE"},
{'value':"VA", 'viewValue':"VATICAN CITY STATE"},
{'value':"VI", 'viewValue':"VIRGIN ISLANDS - US"},
{'value':"SM", 'viewValue':"SAN MARINO"},
{'value':"SI", 'viewValue':"SLOVENIA"},
{'value':"WF", 'viewValue':"WALLIS-FUTUNA ISLAND"},
{'value':"UZ", 'viewValue':"UZBEKISTAN"},
{'value':"GF", 'viewValue':"FRENCH GUIANA"},
{'value':"TF", 'viewValue':"FRENCH SOUTHERN TERR"},
{'value':"PF", 'viewValue':"FRENCH POLYNESIA"},
{'value':"GQ", 'viewValue':"EQUATORIAL GUINEA"},
{'value':"MS", 'viewValue':"MONTSERRAT"},
{'value':"HM", 'viewValue':"HEARDMCDONALD ISLAND"},
{'value':"MX", 'viewValue':"MEXICO"},
{'value':"NE", 'viewValue':"NIGER"},
{'value':"SJ", 'viewValue':"SVALBARD-JAN MAYEN"},
{'value':"EH", 'viewValue':"WESTERN SAHARA"},
{'value':"MP", 'viewValue':"NORTH MARIANA ISLAND"},
{'value':"PR", 'viewValue':"PUERTO RICO"},
{'value':"WS", 'viewValue':"SAMOA"},
{'value':"SG", 'viewValue':"SINGAPORE"},
{'value':"ES", 'viewValue':"SPAIN"},
{'value':"LK", 'viewValue':"SRI LANKA"},
{'value':"TM", 'viewValue':"TURKMENISTAN"},
{'value':"TG", 'viewValue':"TOGO"},
{'value':"TZ", 'viewValue':"TANZANIA"},
{'value':"KR", 'viewValue':"KOREA, SOUTH"},
{'value':"US", 'viewValue':"UNITED STATES"},
{'value':"UY", 'viewValue':"URUGUAY"},
{'value':"SAT", 'viewValue':"SAMAO"}

  ]

  province = [
    {'value':"01", 'viewValue':"FATA / FANA"},
    {'value':"02", 'viewValue':"SINDH"},
    {'value':"03", 'viewValue':"PUNJAB"},
    {'value':"04", 'viewValue':"KHYBER PAKHTUNKHWA"},
    {'value':"05", 'viewValue':"BALOCHISTAN"},
    {'value':"06", 'viewValue':"FEDERAL CAPITAL"},
    {'value':"07", 'viewValue':"A.J.K."}
  ]

  filteredCity: any = [];
  filteredOtherCity: any = [];
  filteredPermanentCity: any = [];
  filteredOtherPermanentCity: any = [];
  city_town_village= [
    {'value':"0001", 'viewValue':"BAGH"},
    {'value':"0002", 'viewValue':"BHIMBER"},
    {'value':"0003", 'viewValue':"DHUNGI"},
    {'value':"0004", 'viewValue':"KHUIRATTA"},
    {'value':"0005", 'viewValue':"KOTLI"},
    {'value':"0006", 'viewValue':"MANGLA"},
    {'value':"0007", 'viewValue':"MIRPUR"},
    {'value':"0008", 'viewValue':"MUZAFFARABAD"},
    {'value':"0009", 'viewValue':"PLANDRI"},
    {'value':"0010", 'viewValue':"PUNCH"},
    {'value':"0011", 'viewValue':"RAWALAKOT"},
    {'value':"0012", 'viewValue':"AMIR CHAH"},
    {'value':"0013", 'viewValue':"BAZDAR"},
    {'value':"0014", 'viewValue':"BELA"},
    {'value':"0015", 'viewValue':"BELLPAT"},
    {'value':"0016", 'viewValue':"BHAG"},
    {'value':"0017", 'viewValue':"BURJ"},
    {'value':"0018", 'viewValue':"CHAGAI"},
    {'value':"0019", 'viewValue':"CHAH SANDAN"},
    {'value':"0020", 'viewValue':"CHAKKU"},
    {'value':"0021", 'viewValue':"CHAMAN"},
    {'value':"0022", 'viewValue':"CHHATR"},
    {'value':"0023", 'viewValue':"DALBANDIN"},
    {'value':"0024", 'viewValue':"DERA BUGTI"},
    {'value':"0025", 'viewValue':"DHANA SAR"},
    {'value':"0026", 'viewValue':"DIWANA"},
    {'value':"0027", 'viewValue':"DUKI"},
    {'value':"0028", 'viewValue':"DUSHI"},
    {'value':"0029", 'viewValue':"DUZAB"},
    {'value':"0030", 'viewValue':"GAJAR"},
    {'value':"0031", 'viewValue':"GANDAVA"},
    {'value':"0032", 'viewValue':"GARHI KHAIRO"},
    {'value':"0033", 'viewValue':"GARRUCK"},
    {'value':"0034", 'viewValue':"GHAZLUNA"},
    {'value':"0035", 'viewValue':"GIRDAN"},
    {'value':"0036", 'viewValue':"GULISTAN"},
    {'value':"0037", 'viewValue':"GWADAR"},
    {'value':"0038", 'viewValue':"GWASH"},
    {'value':"0039", 'viewValue':"HAB CHAUKI"},
    {'value':"0040", 'viewValue':"HAMEEDABAD"},
    {'value':"0041", 'viewValue':"HARNAI"},
    {'value':"0042", 'viewValue':"HINGLAJ"},
    {'value':"0043", 'viewValue':"HOSHAB"},
    {'value':"0044", 'viewValue':"HUB"},
    {'value':"0045", 'viewValue':"ISPIKAN"},
    {'value':"0046", 'viewValue':"JAFFERABAD"},
    {'value':"0047", 'viewValue':"JHAL"},
    {'value':"0048", 'viewValue':"JHAL JHAO"},
    {'value':"0049", 'viewValue':"JHAL MAGSI"},
    {'value':"0050", 'viewValue':"JHATPAT"},
    {'value':"0051", 'viewValue':"JIWANI"},
    {'value':"0052", 'viewValue':"KALANDI"},
    {'value':"0053", 'viewValue':"KALAT"},
    {'value':"0054", 'viewValue':"KAMARAROD"},
    {'value':"0055", 'viewValue':"KANAK"},
    {'value':"0056", 'viewValue':"KANDI"},
    {'value':"0057", 'viewValue':"KANPUR"},
    {'value':"0058", 'viewValue':"KAPIP"},
    {'value':"0059", 'viewValue':"KAPPAR"},
    {'value':"0060", 'viewValue':"KARODI"},
    {'value':"0061", 'viewValue':"KATURI"},
    {'value':"0062", 'viewValue':"KHARAN"},
    {'value':"0063", 'viewValue':"KHUZDAR"},
    {'value':"0064", 'viewValue':"KIKKI"},
    {'value':"0065", 'viewValue':"KOHAN"},
    {'value':"0066", 'viewValue':"KOHLU"},
    {'value':"0067", 'viewValue':"KORAK"},
    {'value':"0068", 'viewValue':"LAHRI"},
    {'value':"0069", 'viewValue':"LASBELA"},
    {'value':"0070", 'viewValue':"LIARI"},
    {'value':"0071", 'viewValue':"LORALAI"},
    {'value':"0072", 'viewValue':"MACH"},
    {'value':"0073", 'viewValue':"MAND"},
    {'value':"0074", 'viewValue':"MANGUCHAR"},
    {'value':"0075", 'viewValue':"MASHKI CHAH"},
    {'value':"0076", 'viewValue':"MASLTI"},
    {'value':"0077", 'viewValue':"MASTUNG"},
    {'value':"0078", 'viewValue':"MEKHTAR"},
    {'value':"0079", 'viewValue':"MERUI"},
    {'value':"0080", 'viewValue':"MIANEZ"},
    {'value':"0081", 'viewValue':"MURGHA KIBZAI"},
    {'value':"0082", 'viewValue':"MUSA KHEL BAZAR"},
    {'value':"0083", 'viewValue':"NAGHA KALAT"},
    {'value':"0084", 'viewValue':"NAL"},
    {'value':"0085", 'viewValue':"NASEERABAD"},
    {'value':"0086", 'viewValue':"NAUROZ KALAT"},
    {'value':"0087", 'viewValue':"NUR GAMMA"},
    {'value':"0088", 'viewValue':"NUSHKI"},
    {'value':"0089", 'viewValue':"NUTTAL"},
    {'value':"0090", 'viewValue':"ORMARA"},
    {'value':"0091", 'viewValue':"PALANTUK"},
    {'value':"0092", 'viewValue':"PANJGUR"},
    {'value':"0093", 'viewValue':"PASNI"},
    {'value':"0094", 'viewValue':"PIHARAK"},
    {'value':"0095", 'viewValue':"PISHIN"},
    {'value':"0096", 'viewValue':"QAMRUDDIN KAREZ"},
    {'value':"0097", 'viewValue':"QILA ABDULLAH"},
    {'value':"0098", 'viewValue':"QILA LADGASHT"},
    {'value':"0099", 'viewValue':"QILA SAFED"},
    {'value':"0100", 'viewValue':"QILA SAIFULLAH"},
    {'value':"0101", 'viewValue':"QUETTA"},
    {'value':"0102", 'viewValue':"RAKHNI"},
    {'value':"0103", 'viewValue':"ROBAT THANA"},
    {'value':"0104", 'viewValue':"RODKHAN"},
    {'value':"0105", 'viewValue':"SAINDAK"},
    {'value':"0106", 'viewValue':"SANJAWI"},
    {'value':"0107", 'viewValue':"SARUNA"},
    {'value':"0108", 'viewValue':"SHABAZ KALAT"},
    {'value':"0109", 'viewValue':"SHAHPUR"},
    {'value':"0110", 'viewValue':"SHARAM JOGIZAI"},
    {'value':"0111", 'viewValue':"SHINGAR"},
    {'value':"0112", 'viewValue':"SHORAP"},
    {'value':"0113", 'viewValue':"SIBI"},
    {'value':"0114", 'viewValue':"SONMIANI"},
    {'value':"0115", 'viewValue':"SPEZAND"},
    {'value':"0116", 'viewValue':"SPINTANGI"},
    {'value':"0117", 'viewValue':"SUI"},
    {'value':"0118", 'viewValue':"SUNTSAR"},
    {'value':"0119", 'viewValue':"SURAB"},
    {'value':"0120", 'viewValue':"THALO"},
    {'value':"0121", 'viewValue':"TUMP"},
    {'value':"0122", 'viewValue':"TURBAT"},
    {'value':"0123", 'viewValue':"UMARAO"},
    {'value':"0124", 'viewValue':"UTHAL"},
    {'value':"0125", 'viewValue':"VITAKRI"},
    {'value':"0126", 'viewValue':"WADH"},
    {'value':"0127", 'viewValue':"WASHAP"},
    {'value':"0128", 'viewValue':"WASJUK"},
    {'value':"0129", 'viewValue':"YAKMACH"},
    {'value':"0130", 'viewValue':"ZHOB"},
    {'value':"0131", 'viewValue':"ZIARAT"},
    {'value':"0132", 'viewValue':"ISLAMABAD"},
    {'value':"0133", 'viewValue':"ABBOTTABAD"},
    {'value':"0134", 'viewValue':"ADEZAI"},
    {'value':"0135", 'viewValue':"AYUBIA"},
    {'value':"0136", 'viewValue':"BANDA DAUD SHAH"},
    {'value':"0137", 'viewValue':"BANNU"},
    {'value':"0138", 'viewValue':"BATAGRAM"},
    {'value':"0139", 'viewValue':"BIROTE"},
    {'value':"0140", 'viewValue':"BUNER"},
    {'value':"0141", 'viewValue':"CHAKDARA"},
    {'value':"0142", 'viewValue':"CHARSADDA"},
    {'value':"0143", 'viewValue':"CHITRAL"},
    {'value':"0144", 'viewValue':"DARGAI"},
    {'value':"0145", 'viewValue':"DARYA KHAN"},
    {'value':"0146", 'viewValue':"DERA ISMAIL KHAN"},
    {'value':"0147", 'viewValue':"DRASAN"},
    {'value':"0148", 'viewValue':"DROSH"},
    {'value':"0149", 'viewValue':"HANGU"},
    {'value':"0150", 'viewValue':"HARIPUR"},
    {'value':"0151", 'viewValue':"KALAM"},
    {'value':"0152", 'viewValue':"KARAK"},
    {'value':"0153", 'viewValue':"KHANASPUR"},
    {'value':"0154", 'viewValue':"KOHAT"},
    {'value':"0155", 'viewValue':"KOHISTAN"},
    {'value':"0156", 'viewValue':"LAKKI MARWAT"},
    {'value':"0157", 'viewValue':"LATAMBER"},
    {'value':"0158", 'viewValue':"LOWER DIR"},
    {'value':"0159", 'viewValue':"MADYAN"},
    {'value':"0160", 'viewValue':"MALAKAND"},
    {'value':"0161", 'viewValue':"MANSEHRA"},
    {'value':"0162", 'viewValue':"MARDAN"},
    {'value':"0163", 'viewValue':"MASTUJ"},
    {'value':"0164", 'viewValue':"MONGORA"},
    {'value':"0165", 'viewValue':"NOWSHERA"},
    {'value':"0166", 'viewValue':"PAHARPUR"},
    {'value':"0167", 'viewValue':"PESHAWAR"},
    {'value':"0168", 'viewValue':"SAIDU SHARIF"},
    {'value':"0169", 'viewValue':"SAKESAR"},
    {'value':"0170", 'viewValue':"SHANGLA"},
    {'value':"0171", 'viewValue':"SWABI"},
    {'value':"0172", 'viewValue':"SWAT"},
    {'value':"0173", 'viewValue':"TANGI"},
    {'value':"0174", 'viewValue':"TANK"},
    {'value':"0175", 'viewValue':"THALL"},
    {'value':"0176", 'viewValue':"TIMARGARA"},
    {'value':"0177", 'viewValue':"TORDHER"},
    {'value':"0178", 'viewValue':"UPPER DIR"},
    {'value':"0179", 'viewValue':"ASTOR"},
    {'value':"0180", 'viewValue':"BAJAUR"},
    {'value':"0181", 'viewValue':"BARAMULA"},
    {'value':"0182", 'viewValue':"DIR"},
    {'value':"0183", 'viewValue':"GILGIT"},
    {'value':"0184", 'viewValue':"HANGU"},
    {'value':"0185", 'viewValue':"KHYBER"},
    {'value':"0186", 'viewValue':"KURRAM"},
    {'value':"0187", 'viewValue':"MALAKAND"},
    {'value':"0188", 'viewValue':"MIRAM SHAH"},
    {'value':"0189", 'viewValue':"MOHMAND"},
    {'value':"0190", 'viewValue':"NAGAR"},
    {'value':"0191", 'viewValue':"NORTH WAZIRISTAN"},
    {'value':"0192", 'viewValue':"PARACHINAR"},
    {'value':"0193", 'viewValue':"PEACOCK"},
    {'value':"0194", 'viewValue':"SHANDUR"},
    {'value':"0195", 'viewValue':"SHANGRILA"},
    {'value':"0196", 'viewValue':"SKARDU"},
    {'value':"0197", 'viewValue':"SOUTH WAZIRISTAN"},
    {'value':"0198", 'viewValue':"WANA"},
    {'value':"0199", 'viewValue':"AHMED NAGER CHATH"},
    {'value':"0200", 'viewValue':"AHMEDPUR EAST"},
    {'value':"0201", 'viewValue':"ALI PUR"},
    {'value':"0202", 'viewValue':"ARIFWALA"},
    {'value':"0203", 'viewValue':"ATTOCK"},
    {'value':"0204", 'viewValue':"BAHAWALNAGAR"},
    {'value':"0205", 'viewValue':"BAHAWALPUR"},
    {'value':"0206", 'viewValue':"BASTI MALOOK"},
    {'value':"0207", 'viewValue':"BHAGALCHUR"},
    {'value':"0208", 'viewValue':"BHAIPHERU"},
    {'value':"0209", 'viewValue':"BHAKKAR"},
    {'value':"0210", 'viewValue':"BHALWAL"},
    {'value':"0211", 'viewValue':"BUREWALA"},
    {'value':"0212", 'viewValue':"CHAILIANWALA"},
    {'value':"0213", 'viewValue':"CHAKWAL"},
    {'value':"0214", 'viewValue':"CHICHAWATNI"},
    {'value':"0215", 'viewValue':"CHINIOT"},
    {'value':"0216", 'viewValue':"CHOWK AZAM"},
    {'value':"0217", 'viewValue':"CHOWK SARWAR SHAHEED"},
    {'value':"0218", 'viewValue':"DARYA KHAN"},
    {'value':"0219", 'viewValue':"DASKA"},
    {'value':"0220", 'viewValue':"DERA GHAZI KHAN"},
    {'value':"0221", 'viewValue':"DERAWAR FORT"},
    {'value':"0222", 'viewValue':"DHAULAR"},
    {'value':"0223", 'viewValue':"DINA CITY"},
    {'value':"0224", 'viewValue':"DINGA"},
    {'value':"0225", 'viewValue':"DIPALPUR"},
    {'value':"0226", 'viewValue':"FAISALABAD"},
    {'value':"0227", 'viewValue':"FATEH JANG"},
    {'value':"0228", 'viewValue':"GADAR"},
    {'value':"0229", 'viewValue':"GHAKHAR MANDI"},
    {'value':"0230", 'viewValue':"GUJAR KHAN"},
    {'value':"0231", 'viewValue':"GUJRANWALA"},
    {'value':"0232", 'viewValue':"GUJRAT"},
    {'value':"0233", 'viewValue':"HAFIZABAD"},
    {'value':"0234", 'viewValue':"HAROONABAD"},
    {'value':"0235", 'viewValue':"HASILPUR"},
    {'value':"0236", 'viewValue':"HAVELI LAKHA"},
    {'value':"0237", 'viewValue':"JAHANIA"},
    {'value':"0238", 'viewValue':"JALLA ARAAIN"},
    {'value':"0239", 'viewValue':"JAMPUR"},
    {'value':"0240", 'viewValue':"JAUHARABAD"},
    {'value':"0241", 'viewValue':"JHANG"},
    {'value':"0242", 'viewValue':"JHELUM"},
    {'value':"0243", 'viewValue':"KALABAGH"},
    {'value':"0244", 'viewValue':"KAMALIA"},
    {'value':"0245", 'viewValue':"KAMOKEY"},
    {'value':"0246", 'viewValue':"KAROR LAL ESAN"},
    {'value':"0247", 'viewValue':"KASUR"},
    {'value':"0248", 'viewValue':"KHANEWAL"},
    {'value':"0249", 'viewValue':"KHANPUR"},
    {'value':"0250", 'viewValue':"KHARIAN"},
    {'value':"0251", 'viewValue':"KHUSHAB"},
    {'value':"0252", 'viewValue':"KOT ADDU"},
    {'value':"0253", 'viewValue':"LAAR"},
    {'value':"0254", 'viewValue':"LAHORE"},
    {'value':"0255", 'viewValue':"LALAMUSA"},
    {'value':"0256", 'viewValue':"LAYYAH"},
    {'value':"0257", 'viewValue':"LODHRAN"},
    {'value':"0258", 'viewValue':"MAILSI"},
    {'value':"0259", 'viewValue':"MAKHDOOM AALI"},
    {'value':"0260", 'viewValue':"MAMOORI"},
    {'value':"0261", 'viewValue':"MANDI BAHAUDDIN"},
    {'value':"0262", 'viewValue':"MANDI WARBURTON"},
    {'value':"0263", 'viewValue':"MIAN CHANNU"},
    {'value':"0264", 'viewValue':"MIANWALI"},
    {'value':"0265", 'viewValue':"MINAWALA"},
    {'value':"0266", 'viewValue':"MULTAN"},
    {'value':"0267", 'viewValue':"MURIDKE"},
    {'value':"0268", 'viewValue':"MURREE"},
    {'value':"0269", 'viewValue':"MUZAFFARGARH"},
    {'value':"0270", 'viewValue':"NAROWAL"},
    {'value':"0271", 'viewValue':"OKARA"},
    {'value':"0272", 'viewValue':"PAK PATTAN"},
    {'value':"0273", 'viewValue':"PANJGUR"},
    {'value':"0274", 'viewValue':"PATTOKI"},
    {'value':"0275", 'viewValue':"PIRMAHAL"},
    {'value':"0276", 'viewValue':"QILA DIDAR SINGH"},
    {'value':"0277", 'viewValue':"RABWAH"},
    {'value':"0278", 'viewValue':"RAHIM YAR KHAN"},
    {'value':"0279", 'viewValue':"RAIWIND"},
    {'value':"0280", 'viewValue':"RAJAN PUR"},
    {'value':"0281", 'viewValue':"RAWALPINDI"},
    {'value':"0282", 'viewValue':"RENALA KHURD"},
    {'value':"0283", 'viewValue':"ROHRI"},
    {'value':"0284", 'viewValue':"SADIQABAD"},
    {'value':"0285", 'viewValue':"SAFDARABAD-DABANSING"},
    {'value':"0286", 'viewValue':"SAHIWAL"},
    {'value':"0287", 'viewValue':"SAMBERIAL"},
    {'value':"0288", 'viewValue':"SANGLA HILL"},
    {'value':"0289", 'viewValue':"SARAI ALAMGIR"},
    {'value':"0290", 'viewValue':"SARGODHA"},
    {'value':"0291", 'viewValue':"SHAFQAT SHAHED CHOWK"},
    {'value':"0292", 'viewValue':"SHAKARGARH"},
    {'value':"0293", 'viewValue':"SHARAQPUR"},
    {'value':"0294", 'viewValue':"SHEIKHUPURA"},
    {'value':"0295", 'viewValue':"SIALKOT"},
    {'value':"0296", 'viewValue':"SOHAWA"},
    {'value':"0297", 'viewValue':"SOOIANWALA"},
    {'value':"0298", 'viewValue':"SUNDAR"},
    {'value':"0299", 'viewValue':"TAKHTBAI"},
    {'value':"0300", 'viewValue':"TALAGANG"},
    {'value':"0301", 'viewValue':"TARBELA"},
    {'value':"0302", 'viewValue':"TAXILA"},
    {'value':"0303", 'viewValue':"TOBA TEK SINGH"},
    {'value':"0304", 'viewValue':"VEHARI"},
    {'value':"0305", 'viewValue':"WAH CANTT"},
    {'value':"0306", 'viewValue':"WAZIRABAD"},
    {'value':"0307", 'viewValue':"ALI BANDAR"},
    {'value':"0308", 'viewValue':"BADEN"},
    {'value':"0309", 'viewValue':"CHACHRO"},
    {'value':"0310", 'viewValue':"DADU"},
    {'value':"0311", 'viewValue':"DAHARKI"},
    {'value':"0312", 'viewValue':"DIGRI"},
    {'value':"0313", 'viewValue':"DIPLO"},
    {'value':"0314", 'viewValue':"DOKRI"},
    {'value':"0315", 'viewValue':"GADRA"},
    {'value':"0316", 'viewValue':"GHANIAN"},
    {'value':"0317", 'viewValue':"GHAUSPUR"},
    {'value':"0318", 'viewValue':"GHOTKI"},
    {'value':"0319", 'viewValue':"GOTH MACHI"},
    {'value':"0320", 'viewValue':"HALA (SINDH) HALA"},
    {'value':"0321", 'viewValue':"HYDERABAD"},
    {'value':"0322", 'viewValue':"ISLAMKOT"},
    {'value':"0323", 'viewValue':"JACOBABAD"},
    {'value':"0324", 'viewValue':"JAMESABAD"},
    {'value':"0325", 'viewValue':"JAMSHORO"},
    {'value':"0326", 'viewValue':"JANGHAR"},
    {'value':"0327", 'viewValue':"JATI"},
    {'value':"0328", 'viewValue':"JHUDO"},
    {'value':"0329", 'viewValue':"JUNGSHAHI"},
    {'value':"0330", 'viewValue':"KAMBER"},
    {'value':"0331", 'viewValue':"KANDIARO"},
    {'value':"0332", 'viewValue':"KARACHI"},
    {'value':"0333", 'viewValue':"KASHMOR"},
    {'value':"0334", 'viewValue':"KETI BANDAR"},
    {'value':"0335", 'viewValue':"KHAIRPUR"},
    {'value':"0336", 'viewValue':"KHOKHROPUR"},
    {'value':"0337", 'viewValue':"KHORA"},
    {'value':"0338", 'viewValue':"KLUPRO"},
    {'value':"0339", 'viewValue':"KOT SARAE"},
    {'value':"0340", 'viewValue':"KOTRI"},
    {'value':"0341", 'viewValue':"LARKANA"},
    {'value':"0342", 'viewValue':"LUND"},
    {'value':"0343", 'viewValue':"MATHI"},
    {'value':"0344", 'viewValue':"MATIARI"},
    {'value':"0345", 'viewValue':"MEHAR"},
    {'value':"0346", 'viewValue':"MIRPUR BATORO"},
    {'value':"0347", 'viewValue':"MIRPUR KHAS"},
    {'value':"0348", 'viewValue':"MIRPUR SAKRO"},
    {'value':"0349", 'viewValue':"MITHANI"},
    {'value':"0350", 'viewValue':"MITHI"},
    {'value':"0351", 'viewValue':"MORO"},
    {'value':"0352", 'viewValue':"NAGAR PARKAR"},
    {'value':"0353", 'viewValue':"NAOKOT"},
    {'value':"0354", 'viewValue':"NAUDERO"},
    {'value':"0355", 'viewValue':"NAUSHARA"},
    {'value':"0356", 'viewValue':"NAUSHERO FEROZE"},
    {'value':"0357", 'viewValue':"NAWABSHAH"},
    {'value':"0358", 'viewValue':"NAZIMABAD"},
    {'value':"0359", 'viewValue':"MOIN JO DARO"},
    {'value':"0360", 'viewValue':"PENDOO"},
    {'value':"0361", 'viewValue':"POKRAN"},
    {'value':"0362", 'viewValue':"QAMBAR"},
    {'value':"0363", 'viewValue':"QAZI AHMAD"},
    {'value':"0364", 'viewValue':"RANIPUR"},
    {'value':"0365", 'viewValue':"RATODERO"},
    {'value':"0366", 'viewValue':"ROHRI"},
    {'value':"0367", 'viewValue':"SAIDU SHARIF"},
    {'value':"0368", 'viewValue':"SAKRAND"},
    {'value':"0369", 'viewValue':"SANGHAR"},
    {'value':"0370", 'viewValue':"SHADADKHOT"},
    {'value':"0371", 'viewValue':"SHAHBANDAR"},
    {'value':"0372", 'viewValue':"SHAHDADPUR"},
    {'value':"0373", 'viewValue':"SHAHPUR CHAKAR"},
    {'value':"0374", 'viewValue':"SHIKARPUR"},
    {'value':"0375", 'viewValue':"SUJAWAL"},
    {'value':"0376", 'viewValue':"SUKKUR"},
    {'value':"0377", 'viewValue':"TANDO ADAM"},
    {'value':"0378", 'viewValue':"TANDO ALAH YAR"},
    {'value':"0379", 'viewValue':"TANDO BAGO"},
    {'value':"0380", 'viewValue':"TAR AHAMD RIND"},
    {'value':"0381", 'viewValue':"THARPARKAR"},
    {'value':"0382", 'viewValue':"THATTA"},
    {'value':"0383", 'viewValue':"TUJAL"},
    {'value':"0384", 'viewValue':"UMARKOT"},
    {'value':"0385", 'viewValue':"VEIRWARO"},
    {'value':"0386", 'viewValue':"WARAH"},
    {'value':"0387", 'viewValue':"MIRPUR MATHELO"},
    {'value':"0388", 'viewValue':"PANOAKIL"},
    {'value':"0389", 'viewValue':"NANKANA SAHIB"},
    {'value':"0390", 'viewValue':"GOJRA"},
    {'value':"0391", 'viewValue':"JARANWALA"},
    {'value':"0392", 'viewValue':"CHUNIA"},
    {'value':"0393", 'viewValue':"KANDHKOT"},
    {'value':"0394", 'viewValue':"KHAIRPUR MIRIS"},
    {'value':"0395", 'viewValue':"UBARO"},
    {'value':"0396", 'viewValue':"TANDO MUHAMMAD KHAN"},
    {'value':"0397", 'viewValue':"MATLI"},
    {'value':"0398", 'viewValue':"SUDHNOTI"},
    {'value':"0399", 'viewValue':"HASAN ABDAL"},
    {'value':"0400", 'viewValue':"HUNZA"},
    {'value':"401", 'viewValue':"TANDLIANWALA"},
    {'value':"0402", 'viewValue':"DADYAL"},
    {'value':"0403", 'viewValue':"NEELUM"},
    {'value':"0404", 'viewValue':"HATTIAN BALA"},


  ]
  filteredOccupation: any = [];
  filteredOtherOccupation: any = [];
  occupation= [
    {'value':"P001", 'viewValue':"AGRICULTURIST"},
    {'value':"P002", 'viewValue':"BUSINESS"},
    {'value':"P003", 'viewValue':"BUSINESS EXECUTIVE"},
    {'value':"P019", 'viewValue':"GOVT. / PUBLIC SECT"},
    {'value':"P005", 'viewValue':"HOUSE HOLD"},
    {'value':"P006", 'viewValue':"HOUSE WIFE"},
    {'value':"P007", 'viewValue':"INDUSTRIALIST"},
    {'value':"P012", 'viewValue':"PROFESSIONAL"},
    {'value':"P013", 'viewValue':"RETIRED PERSON"},
    {'value':"P014", 'viewValue':"SERVICE"},
    {'value':"P015", 'viewValue':"STUDENT"},
    {'value':"P999", 'viewValue':"OTHERS"},
  ]

  /** control for the MatSelect filter keyword */
  public nationalityFilterCtrl: FormControl = new FormControl();

  public countryFilterCtrl: FormControl = new FormControl();
  public provinceFilterCtrl: FormControl = new FormControl();
  public cityFilterCtrl: FormControl = new FormControl();

  public otherCountryFilterCtrl: FormControl = new FormControl();
  public otherProvinceFilterCtrl: FormControl = new FormControl();
  public otherCityFilterCtrl: FormControl = new FormControl();

  public permanentCountryFilterCtrl: FormControl = new FormControl();
  public permanentProvinceFilterCtrl: FormControl = new FormControl();
  public permanentCityFilterCtrl: FormControl = new FormControl();
  public permanentOtherCityFilterCtrl: FormControl = new FormControl();


  public occupationFilterCtrl: FormControl = new FormControl();
  public otherOccupationFilterCtrl: FormControl = new FormControl();

  private _alive = true;
  returnUrl: string;
  rForm: FormGroup;
  auth: AuthService;

  constructor(private spinner: NgxSpinnerService, private _snackBar: MatSnackBar, private route: ActivatedRoute,private router: Router, private globalEvents: GlobalEventService, auth:AuthService,  private formBuilder: FormBuilder) {
    this.auth = auth;
    this.rForm = this.createFormGroupWithBuilder(this.formBuilder);

    this.rForm?.get('father_husband_name')?.valueChanges.subscribe({
          next:(res:string)=>{
                this.rForm.patchValue({'father_husband_name': res.toUpperCase() }, {emitEvent: false})
          }  });

    this.rForm?.get('lifetime')?.valueChanges.subscribe({
          next:(res:string)=>{ this.rForm.patchValue({'lifetime': res.toUpperCase() }, {emitEvent: false} ) }  });
    this.rForm?.get('mailing_address')?.valueChanges.subscribe({
          next:(res:string)=>{ this.rForm.patchValue({'mailing_address': res.toUpperCase() }, {emitEvent: false} ) }  });
    this.rForm?.get('permanent_address')?.valueChanges.subscribe({
          next:(res:string)=>{ this.rForm.patchValue({'permanent_address': res.toUpperCase() }, {emitEvent: false} ) }  });
    this.rForm?.get('source_income')?.valueChanges.subscribe({
          next:(res:string)=>{ this.rForm.patchValue({'source_income': res.toUpperCase() }, {emitEvent: false} ) }  });
    this.rForm?.get('shareholder_category')?.valueChanges.subscribe({
          next:(res:string)=>{ this.rForm.patchValue({'shareholder_category': res.toUpperCase() }, {emitEvent: false} ) }  });
    this.rForm?.get('job_title')?.valueChanges.subscribe({
          next:(res:string)=>{ this.rForm.patchValue({'job_title': res.toUpperCase() }, {emitEvent: false} ) }  });
    this.rForm?.get('department')?.valueChanges.subscribe({
          next:(res:string)=>{ this.rForm.patchValue({'department': res.toUpperCase() }, {emitEvent: false} ) }  });
    this.rForm?.get('employer_name')?.valueChanges.subscribe({
          next:(res:string)=>{ this.rForm.patchValue({'employer_name': res.toUpperCase() }, {emitEvent: false} ) }  });
    this.rForm?.get('employer_address')?.valueChanges.subscribe({
          next:(res:string)=>{ this.rForm.patchValue({'employer_address': res.toUpperCase() }, {emitEvent: false} ) }  });
    this.rForm?.get('relative_name')?.valueChanges.subscribe({
         next:(res:string)=>{ this.rForm.patchValue({'relative_name': res.toUpperCase() }, {emitEvent: false} ) }  });
    this.rForm?.get('bank_name')?.valueChanges.subscribe({
         next:(res:string)=>{ this.rForm.patchValue({'bank_name': res.toUpperCase() }, {emitEvent: false} ) }  });

         this.rForm?.get('CNIC_FRONT')?.valueChanges.subscribe({
          next:(res:string)=>{ this.rForm.patchValue({'CNIC_FRONT': res?.replace(/^data:image\/[a-z]+;base64,/, "") }, {emitEvent: false} ) }  });
          this.rForm?.get('CNIC_BACK')?.valueChanges.subscribe({
            next:(res:string)=>{ this.rForm.patchValue({'CNIC_BACK': res?.replace(/^data:image\/[a-z]+;base64,/, "") }, {emitEvent: false} ) }  });
            this.rForm?.get('ADD_PROOF')?.valueChanges.subscribe({
              next:(res:string)=>{ this.rForm.patchValue({'ADD_PROOF': res?.replace(/^data:image\/[a-z]+;base64,/, "") }, {emitEvent: false} ) }  });
              this.rForm?.get('EMP_ADD_PROOF')?.valueChanges.subscribe({
                next:(res:string)=>{ this.rForm.patchValue({'EMP_ADD_PROOF': res?.replace(/^data:image\/[a-z]+;base64,/, "") }, {emitEvent: false} ) }  });



        }



  ngOnInit(): void {
    this.filterNationality();
    this.filterCountry();
    this.filterCity();
    this.filterOtherCity();
    this.filterPermanentCountry();
    this.filterPermanentCity();
    this.filterOtherPermanentCity();
    this.filterOccupation();
    this.filterOtherOccupation();
  }

  protected filterNationality() {

    this.filteredNationality = this.nationality;
    this.nationalityFilterCtrl.valueChanges.subscribe(() => {
    let search = this.nationalityFilterCtrl.value;
      if (search) {
         this.filteredNationality = this.nationality.filter(item=>item.viewValue.toLowerCase().indexOf(search.toLowerCase()) > -1);
      }else {  this.filteredNationality = this.nationality;   }

     });
 }

 protected filterCountry() {

  this.filteredCountry = this.country;
  this.countryFilterCtrl.valueChanges.subscribe(() => {
  let search = this.countryFilterCtrl.value;
    if (search) {
       this.filteredCountry = this.country.filter(item=>item.viewValue.toLowerCase().indexOf(search.toLowerCase()) > -1);
    }else {  this.filteredCountry = this.country;   }

   });
}

protected filterCity() {

  this.filteredCity = this.city_town_village;
  this.cityFilterCtrl.valueChanges.subscribe(() => {
  let search = this.cityFilterCtrl.value;
    if (search) {
       this.filteredCity = this.city_town_village.filter(item=>item.viewValue.toLowerCase().indexOf(search.toLowerCase()) > -1);
    }else {  this.filteredCity = this.city_town_village;   }

   });
}

protected filterOtherCity() {

  this.filteredOtherCity = this.city_town_village;
  this.otherCityFilterCtrl.valueChanges.subscribe(() => {
  let search = this.otherCityFilterCtrl.value;
    if (search) {
       this.filteredOtherCity = this.city_town_village.filter(item=>item.viewValue.toLowerCase().indexOf(search.toLowerCase()) > -1);
    }else {  this.filteredOtherCity = this.city_town_village;   }

   });
}

protected filterPermanentCountry() {

  this.filteredPermanentCountry= this.country;
  this.permanentCountryFilterCtrl.valueChanges.subscribe(() => {
  let search = this.permanentCountryFilterCtrl.value;
    if (search) {
       this.filteredPermanentCountry = this.country.filter(item=>item.viewValue.toLowerCase().indexOf(search.toLowerCase()) > -1);
    }else {  this.filteredPermanentCountry = this.country;   }

   });
}

protected filterPermanentCity() {

  this.filteredPermanentCity= this.city_town_village;
  this.permanentCityFilterCtrl.valueChanges.subscribe(() => {
  let search = this.permanentCityFilterCtrl.value;
    if (search) {
       this.filteredPermanentCity = this.city_town_village.filter(item=>item.viewValue.toLowerCase().indexOf(search.toLowerCase()) > -1);
    }else {  this.filteredPermanentCity = this.city_town_village;   }

   });
}

protected filterOtherPermanentCity() {

  this.filteredOtherPermanentCity= this.city_town_village;
  this.permanentOtherCityFilterCtrl.valueChanges.subscribe(() => {
  let search = this.permanentOtherCityFilterCtrl.value;
    if (search) {
       this.filteredOtherPermanentCity = this.city_town_village.filter(item=>item.viewValue.toLowerCase().indexOf(search.toLowerCase()) > -1);
    }else {  this.filteredOtherPermanentCity = this.city_town_village;   }

   });
}



  protected filterOccupation() {

    this.filteredOccupation = this.occupation;
    this.occupationFilterCtrl.valueChanges.subscribe(() => {
    let search = this.occupationFilterCtrl.value;
      if (search) {
         this.filteredOccupation = this.occupation.filter(item=>item.viewValue.toLowerCase().indexOf(search.toLowerCase()) > -1);
      }else {  this.filteredOccupation = this.occupation;   }

     });
 }

 protected filterOtherOccupation() {

  this.filteredOtherOccupation = this.occupation;
  this.otherOccupationFilterCtrl.valueChanges.subscribe(() => {
  let search = this.otherOccupationFilterCtrl.value;
    if (search) {
       this.filteredOtherOccupation = this.occupation.filter(item=>item.viewValue.toLowerCase().indexOf(search.toLowerCase()) > -1);
    }else {  this.filteredOtherOccupation = this.occupation;   }

   });
}

  ngOnDestroy(){
    this._alive = false;
  }


  public form_error = (controlName: string, errorName: string) =>{
    return this.rForm.controls[controlName].hasError(errorName);
  }




  createFormGroupWithBuilder(formBuilder: FormBuilder) {

    return formBuilder.group({
      userId: ["admin"],
      password: ["ccdkasbAccount"],
      IDENTIFICATION_TYPE: [{value:this.auth.currentUser?.identification_type, disabled: true}, Validators.compose([Validators.required])],
      RESIDENTIAL_STATUS: [{value:this.auth.currentUser?.residential_status, disabled: true}, Validators.compose([Validators.required])],
      UIN: [{value:this.auth.currentUser?.uin, disabled: true}, Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')])],
      NAME: [{value:this.auth.currentUser?.name, disabled: true}, Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')])],
      MOBILE_NO: [{value:this.auth.currentUser?.mobile, disabled: true}, Validators.compose([Validators.required])],
      ISSUE_DATE: [{value:this.auth.currentUser?.issue_date, disabled: true}, Validators.compose([Validators.required])],
      EMAIL: [{value:this.auth.currentUser?.email, disabled: true}, Validators.compose([Validators.required])],
      RELATIONSHIP: [{value:this.auth.currentUser?.relationship, disabled: true}, Validators.compose([Validators.required])],
      IBAN_NO: [{value:this.auth.currentUser?.iban, disabled: true}, Validators.compose([Validators.required])],
      Relative_UIN: [{value:this.auth.currentUser?.relative_uin, disabled: true}],
      ProofofIBAN: [{value:this.auth.currentUser?.ProofofIBAN, disabled: true}, Validators.compose([Validators.required])],
      proofofRelationship: [{value:this.auth.currentUser?.proofofRelationship, disabled: true}, Validators.compose([Validators.required])],

      account_type: [this.auth.currentUser?.account_type, Validators.compose([Validators.required])],
      salutation: [this.auth.currentUser?.salutation, Validators.compose([Validators.required])],
      father_husband_name: [this.auth.currentUser?.father_husband_name, Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$') ])],
      nationality: [this.auth.currentUser?.nationality, Validators.compose([Validators.required])],
      material_status: [this.auth.currentUser?.material_status, Validators.compose([Validators.required])],
      date_of_expiry: [this.auth.currentUser?.date_of_expiry, Validators.compose([Validators.required])],
      lifetime: [this.auth.currentUser?.lifetime, Validators.compose([ Validators.pattern('^[a-zA-Z0-9 ]+$') ])],
      date_of_birth: [this.auth.currentUser?.date_of_birth, Validators.compose([Validators.required])],
      mailing_address: [this.auth.currentUser?.mailing_address, Validators.compose([Validators.required])],
      country: [this.auth.currentUser?.country, Validators.compose([Validators.required])],
      province: [this.auth.currentUser?.province, Validators.compose([Validators.required])],
      city_town_village: [this.auth.currentUser?.city_town_village, Validators.compose([Validators.required])],
      other_province_state: [this.auth.currentUser?.other_province_state],
      other_city_town_village: [this.auth.currentUser?.other_city_town_village],
      phone_office: [this.auth.currentUser?.phone_office, Validators.compose([ Validators.pattern('^[a-zA-Z0-9 ]+$') ])],
      phone_residence: [this.auth.currentUser?.phone_residence, Validators.compose([ Validators.pattern('^[a-zA-Z0-9 ]+$') ])],
      fax: [this.auth.currentUser?.fax, Validators.compose([ Validators.pattern('^[a-zA-Z0-9 ]+$') ])],
      permanent_address: [this.auth.currentUser?.permanent_address, Validators.compose([ Validators.pattern('^[a-zA-Z0-9 ]+$') ])],
      permanent_country: [this.auth.currentUser?.permanent_country],
      permanent_province: [this.auth.currentUser?.permanent_province],
      permanent_city_town: [this.auth.currentUser?.permanent_city_town],
      permanent_other_province: [this.auth.currentUser?.permanent_other_province],
      permanent_other_city_town: [this.auth.currentUser?.permanent_other_city_town],
      permanent_phone_office: [this.auth.currentUser?.permanent_phone_office, Validators.compose([ Validators.pattern('^[a-zA-Z0-9 ]+$') ])],
      permanent_phone_residence: [this.auth.currentUser?.permanent_phone_residence, Validators.compose([ Validators.pattern('^[a-zA-Z0-9 ]+$') ])],
      permanent_fax: [this.auth.currentUser?.permanent_fax],
      gross_annual_income: [this.auth.currentUser?.gross_annual_income, Validators.compose([Validators.required])],
      source_income: [this.auth.currentUser?.source_income, Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')])],
      shareholder_category: [this.auth.currentUser?.shareholder_category, Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')])],
      occupation: [this.auth.currentUser?.occupation, Validators.compose([Validators.required])],
      other_occupation: [this.auth.currentUser?.other_occupation],
      job_title: [this.auth.currentUser?.job_title,  Validators.compose([ Validators.pattern('^[a-zA-Z0-9 ]+$') ])],
      department: [this.auth.currentUser?.department,  Validators.compose([ Validators.pattern('^[a-zA-Z0-9 ]+$') ])],
      employer_name: [this.auth.currentUser?.employer_name,  Validators.compose([ Validators.pattern('^[a-zA-Z0-9 ]+$') ])],
      employer_address: [this.auth.currentUser?.employer_address,  Validators.compose([ Validators.pattern('^[a-zA-Z0-9 ]+$') ])],
      relative_name: [this.auth.currentUser?.relative_name,  Validators.compose([ Validators.pattern('^[a-zA-Z0-9 ]+$') ])],
      bank_name: [this.auth.currentUser?.bank_name, Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')])],
      opt_code: [this.auth.currentUser?.opt_code],
      CNIC_FRONT: [this.auth.currentUser?.CNIC_FRONT],
      CNIC_BACK: [this.auth.currentUser?.CNIC_BACK],
      ADD_PROOF: [this.auth.currentUser?.ADD_PROOF],
      SIGNATURE_PROOF: [this.auth.currentUser?.SIGNATURE_PROOF],
      EMP_ADD_PROOF: [this.auth.currentUser?.EMP_ADD_PROOF],
      submit_pmex_status: [this.auth.currentUser?.submit_pmex_status],

    });
  }

  onSubmit(){
    let data = this.rForm.value;
    let user = { "userId":"admin"
    , "password":"ccdkasbAccount"
    ,"ACCOUNT_TYPE":data.account_type
    ,"UIN":this.auth.currentUser?.uin
    ,"SALUTATION":data.salutation
    ,"RELATIONSHIP":"F"
    ,"FATHER_HUSBAND_NAME":data.father_husband_name
    ,"NATIONALITY":data.nationality
    ,"MARITAL_STATUS":data.material_status
    ,"DATE_OF_EXPIRY":moment(data.date_of_expiry).format('DD-MMM-yyyy')
    ,"LIFETIME":data.lifetime
    ,"DATE_OF_BIRTH":moment(data.date_of_birth).format('DD-MMM-yyyy')
    ,"MAILING_ADDRESS":data.mailing_address
    ,"COUNTRY":data.country
    ,"PROVINCE_STATE":data.province
    ,"CITY_TOWN_VILLAGE":data.city_town_village
    ,"OTHERPROVINCE_STATE":data.other_province_state
    ,"OTHERCITY_TOWN_VILLAGE":data.other_city_town_village
    ,"TELEPHONE_OFFICE":data.phone_office
    ,"TELEPHONE_RESIDENCE":data.phone_residence
    ,"FAX":data.fax
    ,"PERMANENT_ADDRESS":data.permanent_address
    ,"PERMANENT_COUNTRY":data.permanent_country
    ,"PERMANENT_PROVINCE":data.province
    ,"PERMANENT_CITY_TOWN":data.permanent_city_town
    ,"PERMANENT_OTHERPROVINCE":data.permanent_other_province
    ,"PERMANENT_OTHERCITY_TOWN":data.permanent_other_city_town
    ,"PERMANENT_TELEPHONE_OFFICE":data.permanent_phone_office
    ,"PERMANENT_TELEPHONE_RESIDENCE":data.permanent_phone_residence
    ,"PERMANENT_CELL_NO":this.auth.currentUser.mobile
    ,"PERMANENT_EMAIL":this.auth.currentUser.email
    ,"PERMANENT_FAX":data.fax
    ,"GROSS_ANNUAL_INCOME":data.gross_annual_income
    ,"SOURCE_OF_INCOME":data.source_income
    ,"SHAREHOLDER_CATEGORY":data.shareholder_category
    ,"OCCUPATION":data.occupation
    ,"OTHER_OCCUPATION":data.other_occupation
    ,"JOB_TITLE":data.job_title
    ,"Department":data.department
    ,"EMPLOYER_NAME":data.employer_name
    ,"EMPLOYER_ADDRESS":data.employer_address
    ,"RELATIVE_NAME":""
    ,"BANK_NAME":data.bank_name
    ,"CNIC_FRONT":data.CNIC_FRONT?.replace(/^data:image\/[a-z]+;base64,/, "")
    ,"CNIC_BACK":data.CNIC_BACK?.replace(/^data:image\/[a-z]+;base64,/, "")
    ,"ADD_PROOF":data.ADD_PROOF?.replace(/^data:image\/[a-z]+;base64,/, "")
    ,"SIGNATURE_PROOF":""
    ,"EMP_ADD_PROOF":data.EMP_ADD_PROOF?.replace(/^data:image\/[a-z]+;base64,/, "")
    ,"Relative_UIN":""
    ,"optCode" :data.opt_code
    }
    console.log(user);
    try {
      // data.ISSUE_DATE = this.rForm.value.ISSUE_DATE.format('DD-MMM-yyyy');
      data.ISSUE_DATE = moment(data.ISSUE_DATE).format('DD-MMM-yyyy');
    } catch (error) {
      data.ISSUE_DATE = moment(data.ISSUE_DATE).format('DD-MMM-yyyy');
    }

    this.spinner.show();
    this.auth.submitData(user)

    .subscribe({
      next:(res:any)=>{
       let success = ['200 = Record Posted Sucsessfully', '227 = Record already exists for provided UIN.'];
       this.globalEvents.broadcast('serverMsg',res.errorDescription);
       if(success.includes(res.errorDescription)){
              this.updateUserData(1);
            }
       this.spinner.hide();

    },
      error:(error:any)=>{
        const validationErrors = error.error.error;

        this.spinner.hide();
        if(error.status === 422) {
          Object.keys(validationErrors).forEach(prop => {

            this.globalEvents.broadcast('serverMsg',validationErrors[prop]);
            const formControl = this.rForm.get(prop);
            if (formControl) {
              // activate the error message

              formControl.setErrors({
                serverError: validationErrors[prop]
              });
            }
          });
        }
      },
      complete:()=>{ this.spinner.hide(); }
    });


  }

  updateUserData(submit_pmex_status:any=null){

    if(submit_pmex_status){ this.rForm.get('submit_pmex_status')?.setValue(1); }
    else{ this.rForm.get('submit_pmex_status')?.setValue(null); }

    if(this.rForm.valid){

          this.spinner.show();
          let data = this.rForm.value;
          data['CNIC_FRONT'] = data.CNIC_FRONT ? data.CNIC_FRONT?.replace(/^data:image\/[a-z]+;base64,/, ""):null;
          data['CNIC_BACK']  =  data.CNIC_BACK ? data.CNIC_BACK?.replace(/^data:image\/[a-z]+;base64,/, ""):null;
          data['ADD_PROOF']  =  data.ADD_PROOF ? data.ADD_PROOF?.replace(/^data:image\/[a-z]+;base64,/, ""):null;
          data['EMP_ADD_PROOF']  =  data.EMP_ADD_PROOF ? data.EMP_ADD_PROOF?.replace(/^data:image\/[a-z]+;base64,/, ""):null;

          this.auth.updateUserData(data)
          .subscribe({
            next:(res:any)=>{

              this.spinner.hide();
              this.router.navigate(['dashboard']);

          },
            error:(error:any)=>{
              const validationErrors = error.error.error;

              this.spinner.hide();
              if(error.status === 422) {
                Object.keys(validationErrors).forEach(prop => {

                  this.globalEvents.broadcast('serverMsg',validationErrors[prop]);
                  const formControl = this.rForm.get(prop);
                  if (formControl) {
                    // activate the error message

                    formControl.setErrors({
                      serverError: validationErrors[prop]
                    });
                  }
                });
              }
            },
            complete:()=>{ this.spinner.hide(); }
          });
     }

  }

  handleImageUpload(fileToUpload:any,name:string) {
    // check for image to upload
    // this checks if the user has uploaded any file
    if (fileToUpload.target.files && fileToUpload.target.files[0]) {
      // calculate your image sizes allowed for upload
      const max_size = 600000;
      // the only MIME types allowed
      const allowed_types = ['image/png', 'image/jpeg','image/jpg'];
      // max image height allowed
      const max_height = 14200;
      //max image width allowed
      const max_width = 15600;

      // check the file uploaded by the user
      if (fileToUpload.target.files[0].size > max_size) {
        //show error
        let error = 'max image size allowed is ' + max_size / 1000 + 'kb';
        //show an error alert using the Toastr service.

        this.globalEvents.broadcast('serverMsg',error);
        return false;
      }
      // check for allowable types
      if (!allowed_types.includes(fileToUpload.target.files[0].type)) {
        // define the error message due to wrong MIME type
        let error = 'The allowed images are: ( JPEG | JPG | PNG )';
        // show an error alert for MIME
        this.globalEvents.broadcast('serverMsg',error);
        //return false since the MIME type is wrong
        return false;
      }
      // define a file reader constant
      const reader = new FileReader();
      // read the file on load
      reader.onload = (e: any) => {
        // create an instance of the Image()
        const image = new Image();
        // get the image source
        image.src = e.target.result;
        // @ts-ignore
        image.onload = (rs:any) => {
          // get the image height read
          const img_height = rs.currentTarget['height'];
          // get the image width read
          const img_width = rs.currentTarget['width'];
          // check if the dimensions meet the required height and width
          if (img_height > max_height && img_width > max_width) {
            // throw error due to unmatched dimensions
           let error =
              'Maximum dimensions allowed: ' +
              max_height +
              '*' +
              max_width +
              'px';
            return false;
          } else {
            // otherise get the base64 image
            this.rForm.get(name)?.setValue(e.target.result);
           console.log(this.rForm.value);
          }
        };
      };
      // reader as data url
      reader.readAsDataURL(fileToUpload.target.files[0]);

    }
    return true;
  }

  sameAsField(event:any, field:string, sameAs:string){

    this.rForm.get(field)?.setValue(this.rForm.value[sameAs]);
  }

}
