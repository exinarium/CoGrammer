import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { UserProfileService } from './user-profile.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ErrorHandler } from 'src/app/utilities/error-handler/error-handler';
import { Toast, ToasterService } from 'angular2-toaster';

declare var $: any;

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit, OnDestroy {

  @ViewChild('userForm')
  private userForm: ElementRef;

  isLoading = false;
  fullName: string;
  emailAddress: string;
  isAdminUser: boolean;
  editorAdminUser: boolean;
  loggedInEmail: string;
  activeCampaignTag: string;

  operation: string;

  private id: string;
  private version: number;

  constructor(
    private profileService: UserProfileService,
    private router: Router,
    private errorHandler: ErrorHandler,
    private toasterService: ToasterService,
    private activatedRoute: ActivatedRoute) {

    this.id = this.activatedRoute.snapshot.paramMap.get('id');

    this.editorAdminUser = (
      sessionStorage.getItem('user') === undefined ? false :
        sessionStorage.getItem('user') === null ? false :
          JSON.parse(sessionStorage.getItem('user')).isAdminUser);

    this.loggedInEmail = (
      sessionStorage.getItem('user') === undefined ? '' :
        sessionStorage.getItem('user') === null ? '' :
          JSON.parse(sessionStorage.getItem('user')).email);
  }

  saveProfile() {

    this.userForm.nativeElement.classList.add('was-validated');

    if (this.userForm.nativeElement.checkValidity() === true) {
      $('#loader-user-profile').modal('show').on('shown.bs.modal', () => {

        this.isLoading = true;

        if (!this.id || this.id === '') {

          //If no ID we can create a new profile
          this.profileService.createProfile(
            this.fullName,
            this.emailAddress,
            this.isAdminUser,
            this.activeCampaignTag
          )
            .then(data => {

              if (data && data.code === 200 && data.data) {

                let element = data?.data;

                const toast: Toast = {

                  type: 'success',
                  title: 'Success',
                  body: 'User profile created successfully',
                  showCloseButton: true,
                  onHideCallback: () => {
                    $('#loader-user-profile').modal('hide').on('hidden.bs.modal', () => {
                      this.isLoading = false;

                      if (this.editorAdminUser) {
                        this.router.navigate(['/user/team'], { replaceUrl: true });
                      } else {
                        this.router.navigate(['/contact/profile-list'], { replaceUrl: true });
                      }

                      $('#loader-user-profile').off();
                    });
                  }
                }

                this.toasterService.pop(toast);
              } else {
                throw new Error(data);
              }
            })
            .catch(err => {
              $('#loader-user-profile').modal('hide').on('hidden.bs.modal', () => {
                this.isLoading = false;
                this.errorHandler.handleError(err, 'UserProfile');

                $('#loader-user-profile').off();
              });
            });
        } else {

          //Else this is an edit
          this.profileService.editProfile(
            this.id,
            this.fullName,
            this.emailAddress,
            this.isAdminUser,
            this.version,
            this.activeCampaignTag
          )
            .then(data => {

              if (data && data.code === 200) {

                const toast: Toast = {

                  type: 'success',
                  title: 'Success',
                  body: 'User profile updated successfully',
                  showCloseButton: true,
                  onHideCallback: () => {
                    $('#loader-user-profile').modal('hide').on('hidden.bs.modal', () => {
                      this.isLoading = false;

                      if (this.editorAdminUser) {
                        this.router.navigate(['/user/team'], { replaceUrl: true });
                      } else {
                        this.router.navigate(['/contact/profile-list'], { replaceUrl: true });
                      }

                      $('#loader-user-profile').off();
                    });
                  }
                };

                this.toasterService.pop(toast);
              } else {
                throw new Error(data);
              }
            })
            .catch(err => {

              $('#loader-user-profile').modal('hide').on('hidden.bs.modal', () => {
                this.isLoading = false;
                this.errorHandler.handleError(err, 'UserProfile');

                $('#loader-user-profile').off();
              });
            });
        }
      });
    } else {

      window.scrollTo({ top: $('.was-validated .form-control:invalid').first().offset().top - 100 });
    }
  }

  ngOnInit() {

    this.fullName = '';
    this.emailAddress = '';
    this.isAdminUser = false;

    if (this.id) {
      $('#loader-user-profile').modal('show').on('shown.bs.modal', () => {

        this.isLoading = true;
        this.operation = 'Edit';
        this.profileService.lookupProfile(this.id)
          .then(data => {

            if (data && data?.data) {

              data?.data?.forEach(element => {
                this.fullName = element.name;
                this.emailAddress = element.email;
                this.isAdminUser = element.isAdminUser;
                this.version = element.version;
                this.activeCampaignTag = element.activeCampaignTagName;
              });
            }

            $('#loader-user-profile').modal('hide').on('hidden.bs.modal', () => {
              this.isLoading = false;

              $('#loader-user-profile').off();
            });
          })
          .catch(err => {
            $('#loader-user-profile').modal('hide').on('hidden.bs.modal', () => {
              this.isLoading = false;
              this.errorHandler.handleError(err, 'UserProfile');
              $('#loader-user-profile').off();
            });
          });
      });
    } else {
      this.operation = 'New';
    }
  }

  ngOnDestroy() {

    this.isLoading = undefined;
    this.fullName = undefined;
    this.isAdminUser = undefined;
    this.emailAddress = undefined;
    this.id = undefined;
    this.version = undefined;
    this.operation = undefined;
    this.profileService = undefined;
    this.router = undefined;
    this.errorHandler = undefined;
    this.toasterService = undefined;
    this.activatedRoute = undefined;
    this.loggedInEmail = undefined;
    this.activeCampaignTag = undefined;

    $('#loader-user-profile').modal('dispose');
    $('#user-profile-cancel-confirm').modal('dispose');
    $('#update-password').modal('dispose');
  }

  cancel() {
    $('#user-profile-cancel-confirm').modal('hide').on('hidden.bs.modal', () => {
      $('#user-profile-cancel-confirm').off();

      if (this.editorAdminUser) {
        this.router.navigate(['/user/team'], { replaceUrl: true });
      } else {
        this.router.navigate(['/contact/profile-list'], { replaceUrl: true });
      }
    });
  }

  cancelConfirm() {

    $('#user-profile-cancel-confirm').modal('show');
  }

  updatePassword() {
    $('#update-password').modal('show');
  }

  closeUpdatePassword() {
    $('#update-password').modal('hide');
  }
}
