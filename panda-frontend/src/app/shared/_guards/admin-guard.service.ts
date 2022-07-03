import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../service/auth.service';
import { GlobalEventService } from '../_helpers/global-event.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuardService {

  constructor(
    private auth:AuthService,
    private globalEvents: GlobalEventService,
    private router: Router,
    private cookieService: CookieService,) { }

    canActivate(route: ActivatedRoute, state: RouterStateSnapshot) {

      console.log("ActivatedRouteSnapshot === >", this.auth.currentUser?.user_type);
      if (this.auth.currentUser?.user_type == 'admin' && route.routeConfig?.path == 'admin') {
         return true;
      } else {
        this.router.navigate(["/login"], {
          queryParams: { returnUrl: state.url }
        });
        this.globalEvents.broadcast("serverMsg", "please login as Admin");
        return false;
      }
    }
}
