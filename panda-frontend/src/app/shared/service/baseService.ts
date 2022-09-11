import { Observable } from "rxjs";
import { HttpHeaders } from '@angular/common/http';
import { environment } from "src/environments/environment";



export class BaseService {

    public url = environment.url;

    httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Access-Control-Allow-Origin': '*'
          // 'Authorization': 'my-auth-token'
        })
      };

    constructor() {

      }



  }
