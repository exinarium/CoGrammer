import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { CandidateProfileListService } from './candidate-list.service';
import { ErrorHandler } from 'src/app/utilities/error-handler/error-handler';
import { AppComponent } from 'src/app/app.component';

declare var $: any;

@Component({
  selector: 'app-candidate-list',
  templateUrl: './candidate-list.component.html',
  styleUrls: ['./candidate-list.component.css'],
})
export class CandidateListComponent implements OnInit, OnDestroy {

  @ViewChild('noProfile')

  isLoading = false;
  candidateList: any[];
  start: number;
  limit: number;
  searchString: string;
  isAdminUser: boolean;
  showAll: boolean;

  private tempId: string;
  private intervalNumber: any;
  name: string;
  surname: string;

  constructor(private router: Router, private lookupService: CandidateProfileListService, private errorHandler: ErrorHandler) {

  }

  ngOnInit() {

    this.isLoading = true;
    this.candidateList = [];
    this.start = 0;
    this.limit = 10;
    this.searchString = '';
    this.showAll = true;
    this.isAdminUser = JSON.parse(sessionStorage.getItem('user'))?.isAdminUser;
    this.tempId = '';
    this.name = '';
    this.surname = '';

    this.search(true);
  }

  ngOnDestroy() {

    this.isLoading = undefined;
    this.candidateList = undefined;
    this.start = undefined;
    this.limit = undefined;
    this.searchString = undefined;
    this.isAdminUser = undefined;
    this.showAll = undefined;
    this.router = undefined;
    this.lookupService = undefined;
    this.errorHandler = undefined;
    this.tempId = undefined;
    this.name = undefined;
    this.surname = undefined;
    this.intervalNumber = undefined;

    $('#loader-profile-list').modal('dispose');
    $('#profile-delete').modal('dispose');
    $('#profile-undelete').modal('dispose');
  }

  newProfile() {

    this.router.navigate(['/contact/profile'], { replaceUrl: true });
  }

  loadMore() {

    this.search(false);
  }

  search(reset: boolean) {

    clearInterval(this.intervalNumber);

    if (reset) {
      this.candidateList = [];
      this.start = 0;
    }

    $('#loader-profile-list').modal('show').on('shown.bs.modal', () => {
      this.isLoading = true;

      this.lookupService.lookuplist(this.searchString, this.start, this.limit, this.showAll)
        .then(data => {

          if (data && data?.data) {

            data?.data?.forEach(element => {

              if (element.isDeleted) {

                this.undeleteProfileConfirm(element._id);
              } else {

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

                this.candidateList.push(element);
              }

              this.start++;
            });
          }

          $('#loader-profile-list').modal('hide').on('hidden.bs.modal', () => {
            this.isLoading = false;

            $('#loader-profile-list').off();

            if (AppComponent.isLoggedIn && !AppComponent.tutorialViewed) {
              AppComponent.showTutorial();
            }
          });
        })
        .catch(err => {
          $('#loader-profile-list').modal('hide').on('hidden.bs.modal', () => {
            this.isLoading = false;
            this.errorHandler.handleError(err, 'CandidateProfileList');

            $('#loader-profile-list').off();
          });
        });
    });
  }

  viewInteractions(id: any) {
    this.router.navigate([`/contact/interaction-list/${id}`], { replaceUrl: true });
  }

  filterChange() {
    this.search(true);
  }

  editProfile(id: string) {
    this.router.navigate([`/contact/profile/${id}`], { replaceUrl: true });
  }

  deleteProfile() {

    $('#profile-delete').modal('hide').on('hidden.bs.modal', () => {

      if (this.tempId !== undefined && this.tempId !== '') {

        $('#profile-delete').off();
        this.isLoading = true;
        this.candidateList = [];
        this.start = 0;

        $('#loader-profile-list').modal('show').on('shown.bs.modal', () => {
          this.isLoading = true;
          this.lookupService.deleteProfile(this.tempId)
            .then(data => {

              $('#loader-profile-list').modal('hide').on('hidden.bs.modal', () => {
                this.isLoading = false;
                this.tempId = '';

                $('#loader-profile-list').off();

                this.search(true);
              });
            })
            .catch(err => {
              $('#loader-profile-list').modal('hide').on('hidden.bs.modal', () => {
                this.isLoading = false;
                this.tempId = '';
                this.errorHandler.handleError(err, 'CandidateProfileList');

                $('#loader-profile-list').off();
              });
            });
        });
      }
    });
  }

  deleteProfileConfirm(id: string, name: string, surname: string) {

    this.tempId = id;
    this.name = name;
    this.surname = surname;
    $('#profile-delete').modal('show');
  }

  undeleteProfileConfirm(id: string) {

    this.tempId = id;
    $('#profile-undelete').modal('show');
  }

  undeleteProfile() {

    $('#profile-undelete').modal('hide').on('hidden.bs.modal', () => {
      if (this.tempId !== undefined && this.tempId !== '') {

        $('#profile-undelete').off();
        this.isLoading = true;
        this.candidateList = [];
        this.start = 0;

        $('#loader-profile-list').modal('show').on('shown.bs.modal', () => {
          this.isLoading = true;
          this.lookupService.undeleteProfile(this.tempId)
            .then(data => {

              $('#loader-profile-list').modal('hide').on('hidden.bs.modal', () => {
                this.isLoading = false;
                this.tempId = '';

                $('#loader-profile-list').off();

                this.search(true);
              });
            })
            .catch(err => {
              $('#loader-profile-list').modal('hide').on('hidden.bs.modal', () => {
                this.isLoading = false;
                this.tempId = '';
                this.errorHandler.handleError(err, 'CandidateProfileList');

                $('#loader-profile-list').off();
              });
            });
        });
      }
    });
  }
}
