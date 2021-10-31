import { AfterViewInit, OnDestroy, Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-payment-failure',
    templateUrl: './payment-failure.component.html',
    styleUrls: ['./payment-failure.component.css']
})
export class PaymentFailure implements AfterViewInit, OnDestroy {

    constructor(private router: Router) {

    }
    
    ngAfterViewInit() {

        setTimeout(() => {

            this.router.navigate(['/user/billing']);
        }, 5000);
    }

    ngOnDestroy() {

        this.router = undefined;
    }
}