import { Component, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { ContactUsService } from './contact-us.service';
import { Router } from '@angular/router';
import { ErrorHandler } from '../error-handler/error-handler';

declare var $: any;

@Component({
    selector: 'contact-us',
    templateUrl: './contact-us.component.html',
    styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnDestroy {

    @ViewChild('contactForm')
    public contactForm: ElementRef;

    @ViewChild('recaptcha')
    public recaptcha: ElementRef;

    public isLoading: boolean;
    public name: string;
    public emailAddress: string;
    public subject: string;
    public message: string;
    private recaptchaKey: string;

    public messageSent: boolean;

    constructor(private contactUsService: ContactUsService, private router: Router, private errorHandler: ErrorHandler) {

        window['recaptchaSuccess'] = this.recaptchaSuccess.bind(this);
    }

    ngOnDestroy() {

        this.contactForm = undefined;
        this.isLoading = undefined;
        this.name = undefined;
        this.emailAddress = undefined;
        this.subject = undefined;
        this.message = undefined;
        this.messageSent = undefined;
        this.recaptcha = undefined;
        this.recaptchaKey = undefined;

        $('#loader-contact-us').modal('dispose');
    }

    sendMessage() {

        this.contactForm.nativeElement.classList.add('was-validated');

        if (!this.recaptchaKey || this.recaptchaKey === '') {
            this.recaptcha.nativeElement.classList.add('is-invalid');
        } else {

            this.recaptcha.nativeElement.classList.remove('is-invalid');

            if (this.contactForm.nativeElement.checkValidity() === true) {
                $('#loader-contact-us').modal('show').on('shown.bs.modal', () => {

                    this.isLoading = true;
                    this.contactUsService.sendMessage(this.name, this.emailAddress, this.subject, this.message, this.recaptchaKey)
                        .then(data => {

                            $('#loader-contact-us').modal('hide').on('hidden.bs.modal', () => {
                                this.isLoading = false;
                                $('#loader-contact-us').off();

                                this.completeMessage();
                            });
                        })
                        .catch(err => {
                            $('#loader-contact-us').modal('hide').on('hidden.bs.modal', () => {
                                this.isLoading = false;
                                this.errorHandler.handleError(err, 'ContactUs');

                                $('#loader-contact-us').off();
                            });
                        });
                });
            } else {

                window.scrollTo({ top: $('.was-validated .form-control:invalid').first().offset().top - 100 });
            }
        }
    }

    completeMessage() {

        this.messageSent = true;
        this.name = '';
        this.emailAddress = '';
        this.subject = '';
        this.message = '';

        this.contactForm.nativeElement.classList.remove('was-validated');
    }

    recaptchaSuccess(event: any) {
        this.recaptchaKey = event;
    }
}