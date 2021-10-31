import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router) { }

    canActivate(): boolean {
        if (sessionStorage.getItem('token') === undefined || sessionStorage.getItem('token') === '') {

            this.router.navigate(['/'], { replaceUrl: true });
            return false;
        }
        return true;
    }
}
