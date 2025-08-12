import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { IAuthorizedUser } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService  {

  constructor(private router:Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {

    let user:IAuthorizedUser = localStorage.getItem('mosToken') ? JSON.parse(localStorage.getItem('mosUser') || '') : null;
      if(!user) {
        this.router.navigate(['/auth/login'])
      } 
      
    return true
  }
}
