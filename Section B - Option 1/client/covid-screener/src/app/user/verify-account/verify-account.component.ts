import { Component, ViewChild, ElementRef, Input, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { VerifyAccountService } from './verify-account.service';
import { Toast, ToasterService } from 'angular2-toaster';
import { ErrorHandler } from 'src/app/utilities/error-handler/error-handler';

declare var $: any;

@Component({
    selector: 'app-verify-account',
    templateUrl: 'verify-account.component.html',
    styleUrls: ['verify-account.component.css']
})
export class VerifyAccountComponent implements OnDestroy {

    @ViewChild('verifyForm')
    public verifyForm: ElementRef

    @ViewChild('confirmPasswordInput')
    public confirmPasswordInput: ElementRef;

    @Input()
    public id: string;

    public isLoading: boolean;
    public newPassword: string;
    public confirmPassword: string;
    private state: boolean;

    constructor(private router: Router, private verifyAccountService: VerifyAccountService,
        private toasterService: ToasterService, private errorHandler: ErrorHandler, private activatedRoute: ActivatedRoute) {

        this.id = this.activatedRoute.snapshot.paramMap.get('id');
    }

    ngOnDestroy() {

        this.id = undefined;
        this.newPassword = undefined;
        this.confirmPassword = undefined;
        this.isLoading = undefined;
        this.confirmPasswordInput = undefined;
        this.verifyForm = undefined;
        this.router = undefined;
        this.verifyAccountService = undefined;
        this.toasterService = undefined;
        this.activatedRoute = undefined;
        this.errorHandler = undefined;
        this.state = undefined;

        $('#loader-verify-account').modal('dispose');
    }

    verifyAccount() {

        this.verifyForm.nativeElement.classList.add('was-validated');

        if (this.verifyForm.nativeElement.checkValidity() === true) {
            $('#loader-verify-account').modal('show').on('shown.bs.modal', () => {

                this.isLoading = true;

                this.verifyAccountService.verifyAccount(
                    this.id,
                    this.newPassword,
                    this.confirmPassword
                )
                    .then(data => {

                        if (data && data.code === 200) {

                            const toast: Toast = {

                                type: 'success',
                                title: 'Success',
                                body: 'Account verified successfully',
                                showCloseButton: true,
                                onHideCallback: () => {
                                    $('#loader-verify-account').modal('hide').on('hidden.bs.modal', () => {
                                        this.isLoading = false;
                                        this.router.navigate([''], { replaceUrl: true });

                                        $('#loader-verify-account').off();
                                    });
                                }
                            }

                            this.toasterService.pop(toast);
                        } else {
                            throw new Error(data);
                        }
                    })
                    .catch(err => {
                        $('#loader-verify-account').modal('hide').on('hidden.bs.modal', () => {
                            this.isLoading = false;
                            this.errorHandler.handleError(err, 'VerifyAccount');

                            $('#loader-verify-account').off();
                        });
                    });
            });
        } else {

            window.scrollTo({top: $('.was-validated .form-control:invalid').first().offset().top - 100});
          }
    }

    toggleNew() {
        if (this.state) {
          document.getElementById("newPassword").setAttribute("type", "password");
          document.getElementById("newEye").style.color = '#7a797e';
          this.state = false;
        }
        else {
          document.getElementById("newPassword").setAttribute("type", "text");
          document.getElementById("newEye").style.color = '#5887ef';
          this.state = true;
        }
      }

      toggleConfirm() {
        if (this.state) {
          document.getElementById("confirmPassword").setAttribute("type", "password");
          document.getElementById("confirmEye").style.color = '#7a797e';
          this.state = false;
        }
        else {
          document.getElementById("confirmPassword").setAttribute("type", "text");
          document.getElementById("confirmEye").style.color = '#5887ef';
          this.state = true;
        }
      }
}