import {
  Component,
  ElementRef,
  ViewChild,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CandidateInteractionService } from './candidate-interaction.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToasterService, Toast } from 'angular2-toaster';
import { ErrorHandler } from 'src/app/utilities/error-handler/error-handler';
declare var $: any;

@Component({
  selector: 'app-candidate-interaction',
  templateUrl: './candidate-interaction.component.html',
  styleUrls: ['./candidate-interaction.component.css'],
})
export class CandidateInteractionComponent implements OnInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvas: ElementRef;
  @ViewChild('interactionForm')
  private interactionForm: ElementRef;
  @ViewChild('clientImageInput')
  private clientImageInput: ElementRef;

  isLoading = false;
  clientImage: any;
  meetingAddress: string;
  temperature: number;
  suspectedCovid19: boolean;
  symptomsCovid19: boolean;
  directContactCovid19: boolean;
  indirectContactCovid19: boolean;
  testedCovid19: boolean;
  travelledProvincially: boolean;
  travelledInternationally: boolean;
  autoImmuneDisease: boolean;
  additionalNotes: string;
  operation: string;
  confirmInformationCorrect: boolean;
  clientClassification: string;

  additionalMemberName1: string;
  additionalMemberIDNumber1: string;

  additionalMemberName2: string;
  additionalMemberIDNumber2: string;

  additionalMemberName3: string;
  additionalMemberIDNumber3: string;

  additionalMemberName4: string;
  additionalMemberIDNumber4: string;

  private id: string;
  private profileId: string;
  private version: number;

  constructor(
    private interactionService: CandidateInteractionService,
    private router: Router,
    private errorHandler: ErrorHandler,
    private toasterService: ToasterService,
    private activatedRoute: ActivatedRoute
  ) {

    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.profileId = this.activatedRoute.snapshot.paramMap.get('profileId');
  }

  ngOnInit() {

    this.suspectedCovid19 = false;
    this.symptomsCovid19 = false;
    this.directContactCovid19 = false;
    this.indirectContactCovid19 = false;
    this.testedCovid19 = false;
    this.travelledProvincially = false;
    this.travelledInternationally = false;
    this.autoImmuneDisease = false;
    this.confirmInformationCorrect = false;
    this.meetingAddress = '';
    this.clientImage = '';
    this.clientClassification = '';

    if (this.id) {
      $('#loader-interaction').modal('show').on('shown.bs.modal', () => {

        this.isLoading = true;
        this.operation = 'Edit';
        this.interactionService.lookupInteraction(this.id, this.profileId)
          .then(data => {

            if (data && data?.data) {

              data?.data?.forEach(element => {
                this.clientImage = element.clientImage;

                if (this.clientImage) {
                  const image = new Image();

                  image.onload = () => {
                    this.canvas.nativeElement.getContext('2d').drawImage(image, 0, 0);
                  };

                  image.src = this.clientImage;
                }

                this.meetingAddress = element.meetingAddress;
                this.temperature = element.temperature;
                this.suspectedCovid19 = element.suspectedCovid19;
                this.symptomsCovid19 = element.symptomsCovid19;
                this.directContactCovid19 = element.directContactCovid19;
                this.indirectContactCovid19 = element.indirectContactCovid19;
                this.testedCovid19 = element.testedCovid19;
                this.travelledProvincially = element.travelledProvincially;
                this.travelledInternationally = element.travelledInternationally;
                this.autoImmuneDisease = element.autoImmuneDisease;
                this.additionalNotes = element.additionalNotes;
                this.confirmInformationCorrect = element.confirmInformationCorrect;
                this.version = element.version;
                this.clientClassification = element.clientClassification;
                this.clientImageInput.nativeElement.value = "true";

                if (element.additionalGroupMembers) {

                  let count = 1;
                  element?.additionalGroupMembers?.forEach(arrayElement => {

                    switch (count) {

                      case 1: {
                        this.additionalMemberName1 = arrayElement.name;
                        this.additionalMemberIDNumber1 = arrayElement.idNumber;
                        break;
                      }
                      case 2: {
                        this.additionalMemberName2 = arrayElement.name;
                        this.additionalMemberIDNumber2 = arrayElement.idNumber;
                        break;
                      }
                      case 3: {
                        this.additionalMemberName3 = arrayElement.name;
                        this.additionalMemberIDNumber3 = arrayElement.idNumber;
                        break;
                      }
                      case 4: {
                        this.additionalMemberName4 = arrayElement.name;
                        this.additionalMemberIDNumber4 = arrayElement.idNumber;
                        break;
                      }
                    }

                    count++;
                  });
                }
              });
            }

            $('#loader-interaction').modal('hide').on('hidden.bs.modal', () => {
              this.isLoading = false;

              $('#loader-interaction').off();
              window.scrollTo(0, 0);
            });
          })
          .catch(err => {
            $('#loader-interaction').modal('hide').on('hidden.bs.modal', () => {
              this.errorHandler.handleError(err, 'CandidateInteraction');
              this.isLoading = false;

              $('#loader-interaction').off();
            });
          });
      });
    } else {
      this.operation = 'New';
      $('#loader-interaction').modal('show').on('shown.bs.modal', () => {

        this.isLoading = true;

        this.interactionService.lookuplist(this.profileId, '', 0, 1, true)
          .then(data => {

            if (data && data?.data) {

              if (data?.data?.length > 0) {
                const element = data?.data[0];

                this.suspectedCovid19 = element.suspectedCovid19;
                this.symptomsCovid19 = element.symptomsCovid19;
                this.directContactCovid19 = element.directContactCovid19;
                this.indirectContactCovid19 = element.indirectContactCovid19;
                this.testedCovid19 = element.testedCovid19;
                this.travelledProvincially = element.travelledProvincially;
                this.travelledInternationally = element.travelledInternationally;
                this.autoImmuneDisease = element.autoImmuneDisease;
                this.additionalNotes = element.additionalNotes;
                this.clientClassification = element.clientClassification;
              }
            }

            $('#loader-interaction').modal('hide').on('hidden.bs.modal', () => {
              this.isLoading = false;

              $('#loader-interaction').off();
              window.scrollTo(0, 0);

              if (data && data?.data) {
                $('#interaction-preload').modal('show')
              }
            });
          })
          .catch(err => {
            $('#loader-interaction').modal('hide').on('hidden.bs.modal', () => {
              this.errorHandler.handleError(err, 'CandidateInteraction');
              this.isLoading = false;

              $('#loader-interaction').off();
            });
          });
      });
    }
  }

  ngOnDestroy() {

    this.isLoading = undefined;
    this.clientImage = undefined;
    this.meetingAddress = undefined;
    this.temperature = undefined;
    this.suspectedCovid19 = undefined;
    this.symptomsCovid19 = undefined;
    this.directContactCovid19 = undefined;
    this.indirectContactCovid19 = undefined;
    this.testedCovid19 = undefined;
    this.travelledProvincially = undefined;
    this.travelledInternationally = undefined;
    this.autoImmuneDisease = undefined;
    this.additionalNotes = undefined;
    this.id = undefined;
    this.version = undefined;
    this.operation = undefined;
    this.canvas = undefined;
    this.additionalMemberName1 = undefined;
    this.additionalMemberIDNumber1 = undefined;
    this.additionalMemberName2 = undefined;
    this.additionalMemberIDNumber2 = undefined;
    this.additionalMemberName3 = undefined;
    this.additionalMemberIDNumber3 = undefined;
    this.additionalMemberName4 = undefined;
    this.additionalMemberIDNumber4 = undefined;
    this.confirmInformationCorrect = undefined;
    this.clientClassification = undefined;

    this.interactionService = undefined;
    this.router = undefined;
    this.errorHandler = undefined;
    this.toasterService = undefined;
    this.activatedRoute = undefined;
    this.profileId = undefined;
    this.interactionForm = undefined;
    this.clientImageInput = undefined;

    $('#loader-interaction').modal('dispose');
    $('#interaction-preload').modal('dispose');
    $('#interaction-cancel-confirm').modal('dispose');
  }

  saveInteraction() {

    this.interactionForm.nativeElement.classList.add('was-validated');

    if (this.interactionForm.nativeElement.checkValidity() === true) {
      $('#loader-interaction').modal('show').on('shown.bs.modal', () => {

        this.isLoading = true;
        const additionalGroupMembers = [];

        if (this.additionalMemberName1 && this.additionalMemberIDNumber1) {
          additionalGroupMembers.push({
            name: this.additionalMemberName1,
            idNumber: this.additionalMemberIDNumber1
          });
        }

        if (this.additionalMemberName2 && this.additionalMemberIDNumber2) {
          additionalGroupMembers.push({
            name: this.additionalMemberName2,
            idNumber: this.additionalMemberIDNumber2
          });
        }

        if (this.additionalMemberName3 && this.additionalMemberIDNumber3) {
          additionalGroupMembers.push({
            name: this.additionalMemberName3,
            idNumber: this.additionalMemberIDNumber3
          });
        }

        if (this.additionalMemberName4 && this.additionalMemberIDNumber4) {
          additionalGroupMembers.push({
            name: this.additionalMemberName4,
            idNumber: this.additionalMemberIDNumber4
          });
        }

        if (!this.id || this.id === '') {

          //If no ID we can create a new interaction
          this.interactionService.createInteraction(
            this.clientImage,
            this.meetingAddress,
            this.temperature,
            this.clientClassification,
            this.suspectedCovid19,
            this.symptomsCovid19,
            this.directContactCovid19,
            this.indirectContactCovid19,
            this.testedCovid19,
            this.travelledProvincially,
            this.travelledInternationally,
            this.autoImmuneDisease,
            this.additionalNotes,
            additionalGroupMembers,
            this.confirmInformationCorrect,
            this.profileId
          )
            .then(data => {

              if (data && data.code === 200) {

                const toast: Toast = {

                  type: 'success',
                  title: 'Success',
                  body: 'Interaction created successfully',
                  showCloseButton: true,
                  onHideCallback: () => {
                    $('#loader-interaction').modal('hide').on('hidden.bs.modal', () => {
                      this.isLoading = false;
                      this.router.navigate([`/contact/interaction-list/${this.profileId}`], { replaceUrl: true });

                      $('#loader-interaction').off();
                    });
                  }
                };

                this.toasterService.pop(toast);

              } else {
                throw new Error(data);
              }
            })
            .catch(err => {
              $('#loader-interaction').modal('hide').on('hidden.bs.modal', () => {
                this.errorHandler.handleError(err, 'CandidateInteraction');
                this.isLoading = false;

                $('#loader-interaction').off();
              });
            });
        } else {

          //Else this is an edit

          this.interactionService.editInteraction(
            this.id,
            this.clientImage,
            this.meetingAddress,
            this.temperature,
            this.clientClassification,
            this.suspectedCovid19,
            this.symptomsCovid19,
            this.directContactCovid19,
            this.indirectContactCovid19,
            this.testedCovid19,
            this.travelledProvincially,
            this.travelledInternationally,
            this.autoImmuneDisease,
            this.additionalNotes,
            additionalGroupMembers,
            this.confirmInformationCorrect,
            this.version,
            this.profileId
          )
            .then(data => {

              if (data && data.code === 200) {

                const toast: Toast = {

                  type: 'success',
                  title: 'Success',
                  body: 'Interaction updated successfully',
                  showCloseButton: true,
                  onHideCallback: () => {
                    $('#loader-interaction').modal('hide').on('hidden.bs.modal', () => {
                      this.isLoading = false;
                      this.router.navigate([`/contact/interaction-list/${this.profileId}`], { replaceUrl: true });

                      $('#loader-interaction').off();
                    });
                  }
                };

                this.toasterService.pop(toast);
              } else {
                throw new Error(data);
              }
            })
            .catch(err => {

              $('#loader-interaction').modal('hide').on('hidden.bs.modal', () => {
                this.isLoading = false;
                this.errorHandler.handleError(err, 'CandidateInteraction');

                $('#loader-interaction').off();
              });
            });
        }
      });
    } else {

      window.scrollTo({top: $('.was-validated .form-control:invalid').first().offset().top - 100});
    }
  }

  captureImage(event: any) {
    this.canvas.nativeElement.getContext('2d').drawImage(event, 0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    this.clientImage = this.canvas.nativeElement.toDataURL("image/png");
    this.clientImageInput.nativeElement.value = "true";

    //this.clientImage = this.canvas.nativeElement.getContext('2d').getImageData(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    $('#staticBackdrop').modal('toggle');
  }

  cancel() {
    $('#interaction-cancel-confirm').modal('hide').on('hidden.bs.modal', () => {
      $('#interaction-cancel-confirm').off();
      this.router.navigate([`/contact/interaction-list/${this.profileId}`], { replaceUrl: true });
    });
  }

  cancelConfirm() {

    $('#interaction-cancel-confirm').modal('show');
  }
}
