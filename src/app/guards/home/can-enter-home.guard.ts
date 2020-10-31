import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class CanEnterHomeGuard implements CanActivate {
  constructor(
    private _authService: AuthService,
    private _router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const isLogged: Observable<boolean> = this._authService.authState.pipe(
      map( auth => {
        if(!auth) {
          this._router.navigate(["/login"])
          return false
        }
        else {
          return true
        }
      })
    )

    return isLogged
  }
}
