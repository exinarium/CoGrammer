import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ErrorHandler } from 'src/app/utilities/error-handler/error-handler';
import { CandidateInteractionListService } from './interaction-list.service';
import { CandidateProfileService } from '../candidate-profile/candidate-profile.service';

declare var $: any;

@Component({
  selector: 'app-interaction-list',
  templateUrl: './interaction-list.component.html',
  styleUrls: ['./interaction-list.component.css'],
})
export class InteractionListComponent implements OnInit, OnDestroy {

  isLoading = false;
  interactionList: any[];
  start: number;
  limit: number;
  searchString: string;
  isAdminUser: boolean;
  showAll: boolean;
  profile: any;

  private profileId: string;
  private tempId: string;

  meetingAddress: string;

  constructor(
    private router: Router,
    private lookupService: CandidateInteractionListService,
    private errorHandler: ErrorHandler,
    private profileService: CandidateProfileService,
    private activatedRoute: ActivatedRoute) {

    this.profileId = this.activatedRoute.snapshot.paramMap.get('id');
  }

  ngOnInit() {

    this.isLoading = true;
    this.interactionList = [];
    this.start = 0;
    this.limit = 10;
    this.searchString = '';
    this.showAll = true;
    this.tempId = '';
    this.meetingAddress = '';
    this.isAdminUser = JSON.parse(sessionStorage.getItem('user'))?.isAdminUser;

    this.getProfile();
  }

  ngOnDestroy() {

    this.isLoading = undefined;
    this.interactionList = undefined;
    this.start = undefined;
    this.limit = undefined;
    this.searchString = undefined;
    this.isAdminUser = undefined;
    this.showAll = undefined;
    this.router = undefined;
    this.lookupService = undefined;
    this.errorHandler = undefined;
    this.profile = undefined;
    this.profileId = undefined;
    this.profileService = undefined;
    this.tempId = undefined;
    this.meetingAddress = undefined;

    $('#loader-interaction-list').modal('dispose');
    $('#interaction-delete').modal('dispose');
  }

  newInteraction() {

    this.router.navigate([`/contact/interaction/${this.profileId}`]), { replaceUrl: true };
  }

  loadMore() {

    this.search(false);
  }

  search(reset: boolean) {

    if (reset) {
      this.interactionList = [];
      this.start = 0;
    }

    $('#loader-interaction-list').modal('show').on('shown.bs.modal', () => {
      this.isLoading = true;
      this.lookupService.lookuplist(this.profileId, this.searchString, this.start, this.limit, this.showAll)
        .then(data => {

          if (data && data?.data) {

            data?.data?.forEach(element => {

              if (element.modifiedDate) {
                let current_datetime = new Date(element.modifiedDate);
                let formatted_date = current_datetime.getFullYear() + "-" +
                  ((current_datetime.getMonth() + 1) > 9 ? (current_datetime.getMonth() + 1) : "0" + (current_datetime.getMonth() + 1)) + "-" +
                  (current_datetime.getDate() > 9 ? current_datetime.getDate() : "0" + current_datetime.getDate()) + " " +
                  (current_datetime.getHours() > 9 ? current_datetime.getHours() : "0" + current_datetime.getHours()) + ":" +
                  (current_datetime.getMinutes() > 9 ? current_datetime.getMinutes() : "0" + current_datetime.getMinutes()) + ":" +
                  (current_datetime.getSeconds() > 9 ? current_datetime.getSeconds() : "0" + current_datetime.getSeconds());

                element.modifiedDate = formatted_date;
              };

              this.interactionList.push(element);
              this.start++;
            });
          }

          $('#loader-interaction-list').modal('hide').on('hidden.bs.modal', () => {
            this.isLoading = false;

            $('#loader-interaction-list').off();
          });
        })
        .catch(err => {
          $('#loader-interaction-list').modal('hide').on('hidden.bs.modal', () => {
            this.isLoading = false;
            this.errorHandler.handleError(err, 'CandidateInteractionList');

            $('#loader-interaction-list').off();
          });
        });
    });
  }

  filterChange() {
    this.search(true);
  }

  editInteraction(id: string) {
    this.router.navigate([`/contact/interaction/${this.profileId}/${id}`], { replaceUrl: true });
  }

  deleteInteraction() {

    $('#interaction-delete').modal('hide').on('hidden.bs.modal', () => {

      if (this.tempId !== undefined && this.tempId !== '') {

        $('#interaction-delete').off();
        this.isLoading = true;
        this.interactionList = [];
        this.start = 0;

        $('#loader-interaction-list').modal('show').on('shown.bs.modal', () => {
          this.isLoading = true;
          this.lookupService.deleteInteraction(this.tempId)
            .then(data => {

              $('#loader-interaction-list').modal('hide').on('hidden.bs.modal', () => {
                this.isLoading = false;
                this.tempId = '';

                $('#loader-interaction-list').off();

                this.search(true);
              });
            })
            .catch(err => {
              $('#loader-interaction-list').modal('hide').on('hidden.bs.modal', () => {
                this.isLoading = false;
                this.tempId = '';
                this.errorHandler.handleError(err, 'CandidateInteractionList');

                $('#loader-interaction-list').off();
              });
            });
        });
      }
    });
  }

  deleteInteractionConfirm(id: string, meetingAddress: string) {

    this.tempId = id;
    this.meetingAddress = meetingAddress;
    $('#interaction-delete').modal('show');
  }

  getProfile() {
    $('#loader-interaction-list').modal('show').on('shown.bs.modal', () => {
      this.isLoading = true;
      this.profileService.lookupProfile(this.profileId)
        .then(data => {

          if (data && data?.data) {

            data?.data?.forEach(element => {

              if (element.modifiedDate) {
                let current_datetime = new Date(element.modifiedDate);
                let formatted_date = current_datetime.getFullYear() + "-" +
                  ((current_datetime.getMonth() + 1) > 9 ? (current_datetime.getMonth() + 1) : "0" + (current_datetime.getMonth() + 1)) + "-" +
                  (current_datetime.getDate() > 9 ? current_datetime.getDate() : "0" + current_datetime.getDate()) + " " +
                  (current_datetime.getHours() > 9 ? current_datetime.getHours() : "0" + current_datetime.getHours()) + ":" +
                  (current_datetime.getMinutes() > 9 ? current_datetime.getMinutes() : "0" + current_datetime.getMinutes()) + ":" +
                  (current_datetime.getSeconds() > 9 ? current_datetime.getSeconds() : "0" + current_datetime.getSeconds());

                element.modifiedDate = formatted_date;
              }

              this.profile = element;
            });
          }

          $('#loader-interaction-list').modal('hide').on('hidden.bs.modal', () => {
            this.isLoading = false;
            $('#loader-interaction-list').off();


            this.search(true);
          });
        })
        .catch(err => {
          $('#loader-interaction-list').modal('hide').on('hidden.bs.modal', () => {
            this.isLoading = false;
            this.errorHandler.handleError(err, 'CandidateInteractionList');

            $('#loader-interaction-list').off();
          });
        });
    });
  }
}
