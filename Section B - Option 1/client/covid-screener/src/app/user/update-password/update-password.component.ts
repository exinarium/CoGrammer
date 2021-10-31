import { Component, ViewChild, ElementRef, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UpdatePasswordService } from './update-password.service';
import { Toast, ToasterService } from 'angular2-toaster';
import { ErrorHandler } from 'src/app/utilities/error-handler/error-handler';

declare var $: any;

@Component({
    selector: 'app-update-password',
    templateUrl: 'update-password.component.html',
    styleUrls: ['update-password.component.css']
})
export class UpdatePasswordComponent implements OnDestroy {

    @ViewChild('updatePasswordForm')
    public updatePasswordForm: ElementRef

    @ViewChild('confirmPasswordInput')
    public confirmPasswordInput: ElementRef;

    @Output()
    public updatedPassword: EventEmitter<boolean> = new EventEmitter<boolean>();

    public isLoading: boolean;
    public currentPassword: string;
    public newPassword: string;
    public confirmPassword: string;
    private state: boolean;

    constructor(private router: Router, private updatePasswordService: UpdatePasswordService,
        private toasterService: ToasterService, private errorHandler: ErrorHandler, private activatedRoute: ActivatedRoute) {
    }

    ngOnDestroy() {

        this.newPassword = undefined;
        this.confirmPassword = undefined;
        this.isLoading = undefined;
        this.confirmPasswordInput = undefined;
        this.currentPassword = undefined;
        this.updatedPassword = undefined;
        this.updatePasswordForm = undefined;
        this.router = undefined;
        this.updatePasswordService = undefined;
        this.toasterService = undefined;
        this.activatedRoute = undefined;
        this.errorHandler = undefined;
        this.state = undefined;

        $('#loader-update-password').modal('dispose');
    }

    verifyAccount() {

        this.updatePasswordForm.nativeElement.classList.add('was-validated');

        if (this.updatePasswordForm.nativeElement.checkValidity() === true) {
            $('#loader-update-password').modal('show').on('shown.bs.modal', () => {

                this.isLoading = true;

                this.updatePasswordService.updatePassword(
                    this.currentPassword,
                    this.newPassword,
                    this.confirmPassword
                )
                    .then(data => {

                        if (data && data.code === 200) {

                            const toast: Toast = {

                                type: 'success',
                                title: 'Success',
                                body: 'Password updated successfully',
                                showCloseButton: true,
                                onHideCallback: () => {
                                    $('#loader-update-password').modal('hide').on('hidden.bs.modal', () => {
                                        this.isLoading = false;
                                        this.close();

                                        $('#loader-update-password').off();
                                    });
                                }
                            }

                            this.toasterService.pop(toast);
                        } else {
                            throw new Error(data);
                        }
                    })
                    .catch(err => {
                        $('#loader-update-password').modal('hide').on('hidden.bs.modal', () => {
                            this.isLoading = false;
                            this.errorHandler.handleError(err, 'UpdatePassword');

                            $('#loader-update-password').off();
                        });
                    });
            });
        } else {

            window.scrollTo({top: $('.was-validated .form-control:invalid').first().offset().top - 100});
          }
    }

    close() {

        this.updatePasswordForm.nativeElement.classList.remove('was-validated');
        this.currentPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
        this.updatedPassword.emit(true);
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

      toggleCurrent() {
        if (this.state) {
          document.getElementById("currentPassword").setAttribute("type", "password");
          document.getElementById("currentEye").style.color = '#7a797e';
          this.state = false;
        }
        else {
          document.getElementById("currentPassword").setAttribute("type", "text");
          document.getElementById("currentEye").style.color = '#5887ef';
          this.state = true;
        }
      }
}