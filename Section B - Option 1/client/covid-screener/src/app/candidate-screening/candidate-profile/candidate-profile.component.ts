import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CandidateProfileService } from './candidate-profile.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ErrorHandler } from 'src/app/utilities/error-handler/error-handler';
import { Toast, ToasterService } from 'angular2-toaster';

declare var $: any;

@Component({
  selector: 'app-candidate-profile',
  templateUrl: './candidate-profile.component.html',
  styleUrls: ['./candidate-profile.component.css'],
})
export class CandidateProfileComponent implements OnInit, OnDestroy {

  @ViewChild('candidateForm')
  private candidateForm: ElementRef;

  isLoading = false;
  firstName: string;
  lastName: string;
  idNumber: string;
  telephoneNumber: string;
  emailAddress: string;
  physicalAddress: string;
  marketingConsent: boolean;
  covid19Consent: boolean;
  operation: string;

  private id: string;
  private version: number;

  constructor(
    private profileService: CandidateProfileService,
    private router: Router,
    private errorHandler: ErrorHandler,
    private toasterService: ToasterService,
    private activatedRoute: ActivatedRoute) {

    this.id = this.activatedRoute.snapshot.paramMap.get('id');
  }

  saveProfile() {

    this.candidateForm.nativeElement.classList.add('was-validated');

    if (this.candidateForm.nativeElement.checkValidity() === true) {
      $('#loader-candidate-profile').modal('show').on('shown.bs.modal', () => {

        this.isLoading = true;

        if (!this.id || this.id === '') {

          //If no ID we can create a new profile
          this.profileService.createProfile(
            this.firstName,
            this.lastName,
            this.idNumber,
            this.telephoneNumber,
            this.emailAddress,
            this.physicalAddress,
            this.covid19Consent,
            this.marketingConsent
          )
            .then(data => {

              if (data && data.code === 200 && data.data) {

                let element = data?.data;

                if (element.covid19Consent) {

                  $('#loader-candidate-profile').modal('hide').on('hidden.bs.modal', () => {
                    this.isLoading = false;
                    $('#loader-candidate-profile').off();

                    this.newInteractionConfirm(element._id);
                  });
                } else {
                  const toast: Toast = {

                    type: 'success',
                    title: 'Success',
                    body: 'Profile created successfully',
                    showCloseButton: true,
                    onHideCallback: () => {
                      $('#loader-candidate-profile').modal('hide').on('hidden.bs.modal', () => {
                        this.isLoading = false;
                        this.router.navigate(['/contact/profile-list'], { replaceUrl: true });

                        $('#loader-candidate-profile').off();
                      });
                    }
                  }

                  this.toasterService.pop(toast);
                }
              } else {
                throw new Error(data);
              }
            })
            .catch(err => {
              $('#loader-candidate-profile').modal('hide').on('hidden.bs.modal', () => {
                this.isLoading = false;
                this.errorHandler.handleError(err, 'CandidateProfile');

                $('#loader-candidate-profile').off();
              });
            });
        } else {

          //Else this is an edit
          this.profileService.editProfile(
            this.id,
            this.firstName,
            this.lastName,
            this.idNumber,
            this.telephoneNumber,
            this.emailAddress,
            this.physicalAddress,
            this.covid19Consent,
            this.marketingConsent,
            this.version
          )
            .then(data => {

              if (data && data.code === 200) {

                const toast: Toast = {

                  type: 'success',
                  title: 'Success',
                  body: 'Profile updated successfully',
                  showCloseButton: true,
                  onHideCallback: () => {
                    $('#loader-candidate-profile').modal('hide').on('hidden.bs.modal', () => {
                      this.isLoading = false;
                      this.router.navigate(['/contact/profile-list'], { replaceUrl: true });

                      $('#loader-candidate-profile').off();
                    });
                  }
                };

                this.toasterService.pop(toast);
              } else {
                throw new Error(data);
              }
            })
            .catch(err => {

              $('#loader-candidate-profile').modal('hide').on('hidden.bs.modal', () => {
                this.isLoading = false;
                this.errorHandler.handleError(err, 'CandidateProfile');

                $('#loader-candidate-profile').off();
              });
            });
        }
      });
    } else {

      window.scrollTo({top: $('.was-validated .form-control:invalid').first().offset().top - 100});
    }
  }

  ngOnInit() {

    this.covid19Consent = false;
    this.marketingConsent = false;

    if (this.id) {
      $('#loader-candidate-profile').modal('show').on('shown.bs.modal', () => {

        this.isLoading = true;
        this.operation = 'Edit';
        this.profileService.lookupProfile(this.id)
          .then(data => {

            if (data && data?.data) {

              data?.data?.forEach(element => {
                this.firstName = element.firstName;
                this.lastName = element.lastName;
                this.idNumber = element.idNumber;
                this.telephoneNumber = element.telephoneNumber;
                this.emailAddress = element.emailAddress;
                this.covid19Consent = element.covid19Consent;
                this.marketingConsent = element.marketingConsent;
                this.version = element.version;
                this.physicalAddress = element.physicalAddress
              });
            }

            $('#loader-candidate-profile').modal('hide').on('hidden.bs.modal', () => {
              this.isLoading = false;

              $('#loader-candidate-profile').off();
            });
          })
          .catch(err => {
            $('#loader-candidate-profile').modal('hide').on('hidden.bs.modal', () => {
              this.isLoading = false;
              this.errorHandler.handleError(err, 'CandidateProfile');
              $('#loader-candidate-profile').off();
            });
          });
      });
    } else {
      this.operation = 'New';
    }
  }

  ngOnDestroy() {

    this.isLoading = undefined;
    this.firstName = undefined;
    this.lastName = undefined;
    this.idNumber = undefined;
    this.telephoneNumber = undefined;
    this.emailAddress = undefined;
    this.marketingConsent = undefined;
    this.covid19Consent = undefined;
    this.id = undefined;
    this.version = undefined;
    this.operation = undefined;
    this.physicalAddress = undefined;

    this.profileService = undefined;
    this.router = undefined;
    this.errorHandler = undefined;
    this.toasterService = undefined;
    this.activatedRoute = undefined;

    $('#loader-candidate-profile').modal('dispose');
    $('#create-interaction').modal('dispose');
    $('#profile-cancel-confirm').modal('dispose');
  }

  newInteractionConfirm(id: string) {
    this.id = id;
    $('#create-interaction').modal('show');
  }

  newInteraction(confirm: boolean) {

    if (confirm) {
      $('#create-interaction').modal('hide').on('hidden.bs.modal', () => {
        $('#create-interaction').off();
        this.router.navigate([`/contact/interaction/${this.id}`], { replaceUrl: true });
      });
    }
    else {
      this.id = '';
      $('#create-interaction').modal('hide').on('hidden.bs.modal', () => {
        $('#create-interaction').off();
        this.router.navigate([`/contact/profile-list`], { replaceUrl: true });
      });
    }
  }

  cancel() {
    $('#profile-cancel-confirm').modal('hide').on('hidden.bs.modal', () => {
      $('#profile-cancel-confirm').off();
      this.router.navigate([`/contact/profile-list`], { replaceUrl: true });
    });
  }

  cancelConfirm() {

    $('#profile-cancel-confirm').modal('show');
  }
}
