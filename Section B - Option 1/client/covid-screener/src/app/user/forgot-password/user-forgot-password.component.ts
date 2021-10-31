import { Component, ViewChild, ElementRef, Input, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserForgotPasswordService } from './user-forgot-password.service';
import { Toast, ToasterService } from 'angular2-toaster';
import { ErrorHandler } from 'src/app/utilities/error-handler/error-handler';

declare var $: any;

@Component({
    selector: 'app-forgot-password',
    templateUrl: 'user-forgot-password.component.html',
    styleUrls: ['user-forgot-password.component.css']
})
export class UserForgotPasswordComponent implements OnDestroy {

    @ViewChild('forgotPasswordForm')
    public forgotPasswordForm: ElementRef

    @ViewChild('confirmPasswordInput')
    public confirmPasswordInput: ElementRef;

    @Input()
    public id: string;

    public isLoading: boolean;
    public newPassword: string;
    public confirmPassword: string;
    public emailAddress: string;
    private state: boolean;

    constructor(private router: Router, private forgotPasswordService: UserForgotPasswordService,
        private toasterService: ToasterService, private errorHandler: ErrorHandler, private activatedRoute: ActivatedRoute) {

        this.id = this.activatedRoute.snapshot.paramMap.get('id');
    }

    ngOnDestroy() {

        this.id = undefined;
        this.newPassword = undefined;
        this.confirmPassword = undefined;
        this.isLoading = undefined;
        this.confirmPasswordInput = undefined;
        this.forgotPasswordForm = undefined;
        this.emailAddress = undefined;
        this.router = undefined;
        this.forgotPasswordService = undefined;
        this.toasterService = undefined;
        this.activatedRoute = undefined;
        this.errorHandler = undefined;
        this.state = undefined;

        $('#loader-forgot-password').modal('dispose');
    }

    verifyAccount() {

        this.forgotPasswordForm.nativeElement.classList.add('was-validated');

        if (this.forgotPasswordForm.nativeElement.checkValidity() === true) {
            $('#loader-forgot-password').modal('show').on('shown.bs.modal', () => {

                this.isLoading = true;

                this.forgotPasswordService.forgotPassword(
                    this.id,
                    this.emailAddress,
                    this.newPassword,
                    this.confirmPassword
                )
                    .then(data => {

                        if (data && data.code === 200) {

                            const toast: Toast = {

                                type: 'success',
                                title: 'Success',
                                body: this.emailAddress ? 'Password reset email sent successfully' : 'Password reset successfully',
                                showCloseButton: true,
                                onHideCallback: () => {
                                    $('#loader-forgot-password').modal('hide').on('hidden.bs.modal', () => {
                                        this.isLoading = false;
                                        this.router.navigate(['/login'], { replaceUrl: true });

                                        $('#loader-forgot-password').off();
                                    });
                                }
                            }

                            this.toasterService.pop(toast);
                        } else {
                            throw new Error(data);
                        }
                    })
                    .catch(err => {
                        $('#loader-forgot-password').modal('hide').on('hidden.bs.modal', () => {
                            this.isLoading = false;
                            this.errorHandler.handleError(err, 'VerifyAccount');

                            $('#loader-forgot-password').off();
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