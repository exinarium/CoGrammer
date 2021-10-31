import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

@Injectable()
export class AdminGuard implements CanActivate {

    constructor(private router: Router) { }

    canActivate(): boolean {
        if (sessionStorage.getItem('user') === undefined || sessionStorage.getItem('user') === null || JSON.parse(sessionStorage.getItem('user')).isAdminUser !== true) {

            this.router.navigate(['/'], { replaceUrl: true });
            return false;
        }
        return true;
    }
}
