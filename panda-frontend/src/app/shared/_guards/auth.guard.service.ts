import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { GlobalEventService } from '../_helpers/global-event.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(

    private globalEvents: GlobalEventService,
    private router: Router,
    private cookieService: CookieService,
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    const currentUser = this.cookieService.get("currentUserToken") || "";

    if (!currentUser) {

      // logged in so return true
      this.router.navigate(["/login"], {
        queryParams: { returnUrl: state.url }
      });
      this.globalEvents.broadcast("serverMsg", "please login.....");
      return false;
    } else {
      return true;
    }
  }


  // ----------------------------------------------------------------
  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot ): boolean {

  try {
     // temporary allow all child routes
     return true;
  } catch (error) {
    // this.location.back();
    return true;
  }




  }

}
