import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Md5 } from 'ts-md5'
import { encode } from 'punycode';
import { env } from 'process';
import { PaymentPlan } from './models/payment-plan';
import { SetupPaymentPlans } from './models/setup-payment-plans';
import { BillingService } from './billing.service';
import { ToasterService, Toast } from 'angular2-toaster';
import { ErrorHandler } from 'src/app/utilities/error-handler/error-handler';
import { AppComponent } from 'src/app/app.component';
import { Router } from '@angular/router';

declare var $: any;

@Component({
    selector: 'app-billing',
    templateUrl: './billing.component.html',
    styleUrls: ['./billing.component.css']
})
export class BillingComponent implements OnInit, OnDestroy {

    @ViewChild('payfastForm')
    public payfastForm: ElementRef;

    public merchantKey: string;
    public merchantId: string;
    public returnUrl: string;
    public cancelUrl: string;
    public itnUrl: string;

    public amount: number;
    public recurringAmount: number;
    public paymentName: string;
    public planNumber: number;

    public supportEmail: string;
    public billingDate: string;
    public frequency: number;
    public signature: string;
    public annualBilling: boolean = false;

    public paymentPlans: PaymentPlan[];

    public currentPlan: number;
    public organizationId: string;
    private passphrase: string;

    public plan: string;
    public changeToPlan: number;
    public currentPayments: any;
    public isDowngrading: boolean = false;
    public isCancelled: boolean = false;
    public downgradingPlan: number;

    public isLoading: boolean = true;

    constructor(private billingService: BillingService, private toasterService: ToasterService, private errorHandler: ErrorHandler, private router: Router) {

    }

    ngOnInit() {
        this.merchantId = environment.payfastMerchantId;
        this.merchantKey = environment.payfastMerchantKey;

        this.returnUrl = `${environment.protocol}://${environment.clientHost}:${environment.clientPort}/#/user/billing/complete`;
        this.cancelUrl = `${environment.protocol}://${environment.clientHost}:${environment.clientPort}/#/user/billing/failure`;
        this.itnUrl = `${environment.protocol}://${environment.host}/api/v1/payfast-itn/`;

        this.supportEmail = environment.supportEmail;
        this.currentPayments = JSON.parse(sessionStorage.getItem('user'))?.organization?.payments;
        this.isDowngrading = this.currentPayments?.paymentStatus === 'Downgrade';
        this.isCancelled = this.currentPayments?.paymentStatus === 'Cancelled';
        this.billingDate = new Date(this.currentPayments.nextBillingDate).toLocaleDateString();
        this.currentPlan = JSON.parse(sessionStorage.getItem('user'))?.organization?.paymentPlan;
        this.passphrase = environment.payfastPassphrase;
        this.organizationId = JSON.parse(sessionStorage.getItem('user'))?.organization._id;


        if (this.currentPlan !== 0) {
            this.downgradingPlan = this.currentPayments?.paymentPlan;
        } else {
            this.downgradingPlan = 0;
        }

        if (this.downgradingPlan === 0) this.plan = 'FREE';
        if (this.downgradingPlan === 1 || this.downgradingPlan === 5) this.plan = 'STARTER';
        if (this.downgradingPlan === 2 || this.downgradingPlan === 6) this.plan = 'PROFESSIONAL';
        if (this.downgradingPlan === 3 || this.downgradingPlan === 7) this.plan = 'ELITE';
        if (this.downgradingPlan === 4 || this.downgradingPlan === 8) this.plan = 'ULTIMATE';
        if (this.downgradingPlan > 8) this.plan = 'ENTERPISE'

        this.annualBilling = this.currentPlan === 5 || this.currentPlan === 6 || this.currentPlan === 7 || this.currentPlan === 8;
        this.paymentPlans = SetupPaymentPlans.paymentPlans(this.annualBilling);
    }

    ngOnDestroy() {

        this.payfastForm = undefined;
        this.merchantKey = undefined;
        this.merchantId = undefined;
        this.returnUrl = undefined;
        this.cancelUrl = undefined;
        this.itnUrl = undefined;

        this.amount = undefined;
        this.paymentName = undefined;
        this.planNumber = undefined;

        this.supportEmail = undefined;
        this.billingDate = undefined;
        this.frequency = undefined;
        this.signature = undefined;

        this.currentPlan = undefined;
        this.organizationId = undefined;
        this.passphrase = undefined;

        this.plan = undefined;
        this.changeToPlan = undefined;
        this.annualBilling = undefined;
        this.currentPayments = undefined;
        this.recurringAmount = undefined;

        this.isLoading = undefined;
        this.billingService = undefined;
        this.toasterService = undefined;
        this.errorHandler = undefined;
        this.router = undefined;
    }

    upgradePlan(id: number) {
        this.changeToPlan = id;
        $('#upgrade-plan').modal('show');
    }

    upgradePlanConfirmed() {
        $('#upgrade-plan').modal('hide');

        let paymentPlan = this.paymentPlans.find(x => x.id === this.changeToPlan);

        if (paymentPlan) {

            if (this.annualBilling && this.currentPlan !== 0) {

                let lastPaymentDate = new Date();
                let nextBillingDate = this.currentPayments?.nextBillingDate;

                let extraMonths = new Date(nextBillingDate).getMonth() - new Date(lastPaymentDate).getMonth();

                this.recurringAmount = paymentPlan.amount;

                if (extraMonths <= 0) {
                    this.amount = this.recurringAmount;
                } else {
                    this.amount = this.recurringAmount - (this.recurringAmount / 12 * extraMonths);
                }
            } else {

                this.recurringAmount = paymentPlan.amount;
                this.amount = paymentPlan.amount;
            }

            this.paymentName = paymentPlan.name;
            this.planNumber = paymentPlan.id;

            let newBillingDate = new Date();

            if (this.annualBilling) {
                newBillingDate.setFullYear(newBillingDate.getFullYear() + 1);
            } else {
                newBillingDate.setMonth(newBillingDate.getMonth() + 1);
            }

            this.billingDate = `${newBillingDate.getFullYear()}-${newBillingDate.getMonth() + 1 < 10 ? '0' + (newBillingDate.getMonth() + 1) : newBillingDate.getMonth() + 1}-${newBillingDate.getDate() < 10 ? '0' + newBillingDate.getDate() : newBillingDate.getDate()}`;
            this.frequency = this.annualBilling ? 6 : 3;

            let signatureString = `merchant_id=${(this.merchantId)}&merchant_key=${encodeURIComponent(this.merchantKey)}&return_url=${encodeURIComponent(this.returnUrl)}&cancel_url=${encodeURIComponent(this.cancelUrl)}&notify_url=${encodeURIComponent(this.itnUrl)}&amount=${encodeURIComponent(this.amount)}&item_name=${encodeURIComponent(this.paymentName)}&custom_int1=${encodeURIComponent(this.planNumber)}&custom_str1=${encodeURIComponent(this.organizationId)}&email_confirmation=1&confirmation_address=${encodeURIComponent(this.supportEmail)}&payment_method=cc&subscription_type=1&billing_date=${encodeURIComponent(this.billingDate)}&recurring_amount=${encodeURIComponent(this.recurringAmount)}&frequency=${encodeURIComponent(this.frequency)}&cycles=0&passphrase=${encodeURIComponent(this.passphrase)}`;
            this.signature = new Md5().appendStr(signatureString).end().toString();

            setTimeout(() => {
                this.payfastForm.nativeElement.submit();
            }, 1000);
        }
    }

    downgradePlan(id: number) {

        this.changeToPlan = id;
        $('#downgrade-plan').modal('show');
    }

    downgradePlanConfirmed() {
        $('#downgrade-plan').modal('hide').on('hidden.bs.modal', () => {
            ;

            let paymentPlan = this.paymentPlans.find(x => x.id === this.changeToPlan);

            this.recurringAmount = paymentPlan.amount;
            this.planNumber = paymentPlan.id;

            $('#loader-billing').modal('show').on('shown.bs.modal', () => {

                this.billingService.updateSubscription(this.planNumber, this.recurringAmount * 100)
                    .then(() => {

                        let toast: Toast = {
                            type: 'success',
                            title: 'Success',
                            body: 'Plan downgraded successfully',
                            showCloseButton: true,
                            onHideCallback: () => {
                                $('#loader-billing').modal('hide').on('hidden.bs.modal', () => {
                                    this.isLoading = false;
                                    $('#loader-billing').off();

                                    sessionStorage.clear();
                                    AppComponent.isLoggedIn = false;
                                    this.router.navigate([''], { replaceUrl: true });
                                });
                            }
                        }
                        this.toasterService.pop(toast);
                    });
            })
                .catch(err => {
                    $('#loader-billing').modal('hide').on('hidden.bs.modal', () => {
                        this.isLoading = false;
                        this.errorHandler.handleError(err, 'BillingComponent');

                        $('#loader-billing').off();
                    });
                });
        });
    }

    deleteOrganization() {
        $('#organization-delete').modal('show');
    }

    deleteOrganizationConfirm() {
        $('#organization-delete').modal('hide').on('hidden.bs.modal', () => {
            $('#organization-delete').off();

            $('#loader-billing').modal('show').on('shown.bs.modal', () => {

                if (this.currentPlan !== 0 || this.downgradingPlan !== 0) {
                    this.billingService.cancelSubscription()
                        .then(() => {

                            let toast: Toast = {
                                type: 'success',
                                title: 'Success',
                                body: 'Plan cancelled successfully',
                                showCloseButton: true,
                                onHideCallback: () => {
                                    $('#loader-billing').modal('hide').on('hidden.bs.modal', () => {
                                        this.isLoading = false;
                                        $('#loader-billing').off();

                                        sessionStorage.clear();
                                        AppComponent.isLoggedIn = false;
                                        this.router.navigate([''], { replaceUrl: true });
                                    });
                                }
                            }

                            this.toasterService.pop(toast);
                        })
                        .catch(err => {
                            $('#loader-billing').modal('hide').on('hidden.bs.modal', () => {
                                this.isLoading = false;
                                this.errorHandler.handleError(err, 'BillingComponent');

                                $('#loader-billing').off();
                            });
                        });
                } else {

                    this.billingService.deleteOrganization(this.organizationId)
                        .then(() => {

                            let toast: Toast = {
                                type: 'success',
                                title: 'Success',
                                body: 'Organization deleted successfully',
                                showCloseButton: true,
                                onHideCallback: () => {
                                    $('#loader-billing').modal('hide').on('hidden.bs.modal', () => {
                                        this.isLoading = false;
                                        $('#loader-billing').off();

                                        sessionStorage.clear();
                                        AppComponent.isLoggedIn = false;
                                        this.router.navigate([''], { replaceUrl: true });
                                    });
                                }
                            }

                            this.toasterService.pop(toast);
                        })
                        .catch(err => {
                            $('#loader-billing').modal('hide').on('hidden.bs.modal', () => {
                                this.isLoading = false;
                                this.errorHandler.handleError(err, 'BillingComponent');

                                $('#loader-billing').off();
                            });
                        });
                }
            });
        });
    }

    changeAnnualBilling() {

        this.paymentPlans = SetupPaymentPlans.paymentPlans(this.annualBilling);
    }
}