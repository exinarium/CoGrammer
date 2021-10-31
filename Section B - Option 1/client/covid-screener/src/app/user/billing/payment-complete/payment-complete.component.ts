import { AfterViewInit, OnDestroy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';

@Component({
    selector: 'app-payment-complete',
    templateUrl: './payment-complete.component.html',
    styleUrls: ['./payment-complete.component.css']
})
export class PaymentComplete implements AfterViewInit, OnDestroy {

    constructor(private router: Router) {

    }

    ngAfterViewInit() {

        setTimeout(() => {

            sessionStorage.clear();
            AppComponent.isLoggedIn = false;
            this.router.navigate([''], { replaceUrl: true });
        }, 5000)
    }

    ngOnDestroy() {

        this.router = undefined;
    }
}