import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { UserListService } from './user-list.service';
import { ErrorHandler } from 'src/app/utilities/error-handler/error-handler';

declare var $: any;

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent implements OnInit, OnDestroy {

  isLoading = false;
  userList: any[];
  start: number;
  limit: number;
  searchString: string;
  isAdminUser: boolean;

  private tempId: string;
  private intervalNumber: any;
  name: string;
  surname: string;

  constructor(private router: Router, private lookupService: UserListService, private errorHandler: ErrorHandler) {

  }

  ngOnInit() {

    this.isLoading = true;
    this.userList = [];
    this.start = 0;
    this.limit = 10;
    this.searchString = '';
    this.isAdminUser = JSON.parse(sessionStorage.getItem('user'))?.isAdminUser;
    this.tempId = '';
    this.name = '';
    this.surname = '';

    this.search(true);
  }

  ngOnDestroy() {

    this.isLoading = undefined;
    this.userList = undefined;
    this.start = undefined;
    this.limit = undefined;
    this.searchString = undefined;
    this.isAdminUser = undefined;
    this.router = undefined;
    this.lookupService = undefined;
    this.errorHandler = undefined;
    this.tempId = undefined;
    this.name = undefined;
    this.surname = undefined;
    this.intervalNumber = undefined;

    $('#loader-user-list').modal('dispose');
    $('#user-delete').modal('dispose');
    $('#user-undelete').modal('dispose');
  }

  newUser() {

    this.router.navigate(['/user/profile'], { replaceUrl: true });
  }

  loadMore() {

    this.search(false);
  }

  search(reset: boolean) {

    clearInterval(this.intervalNumber);

    if (reset) {
      this.userList = [];
      this.start = 0;
    }

    $('#loader-user-list').modal('show').on('shown.bs.modal', () => {
      this.isLoading = true;

      this.lookupService.lookuplist(this.searchString, this.start, this.limit)
        .then(data => {

          if (data && data?.data) {

            data?.data?.forEach(element => {

              if (element.isDeleted) {

                this.undeleteUserConfirm(element._id);
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

                this.userList.push(element);
              }

              this.start++;
            });
          }

          $('#loader-user-list').modal('hide').on('hidden.bs.modal', () => {
            this.isLoading = false;

            $('#loader-user-list').off();
          });
        })
        .catch(err => {
          $('#loader-user-list').modal('hide').on('hidden.bs.modal', () => {
            this.isLoading = false;
            this.errorHandler.handleError(err, 'UserList');

            $('#loader-user-list').off();
          });
        });
    });
  }

  editUser(id: string) {
    this.router.navigate([`/user/profile/${id}`], { replaceUrl: true });
  }

  deleteUser() {

    $('#user-delete').modal('hide').on('hidden.bs.modal', () => {

      if (this.tempId !== undefined && this.tempId !== '') {

        $('#user-delete').off();
        this.isLoading = true;
        this.userList = [];
        this.start = 0;

        $('#loader-user-list').modal('show').on('shown.bs.modal', () => {
          this.isLoading = true;
          this.lookupService.deleteUser(this.tempId)
            .then(data => {

              $('#loader-user-list').modal('hide').on('hidden.bs.modal', () => {
                this.isLoading = false;
                this.tempId = '';

                $('#loader-user-list').off();

                this.search(true);
              });
            })
            .catch(err => {
              $('#loader-user-list').modal('hide').on('hidden.bs.modal', () => {
                this.isLoading = false;
                this.tempId = '';
                this.errorHandler.handleError(err, 'UserListComponent');

                $('#loader-user-list').off();
              });
            });
        });
      }
    });
  }

  deleteUserConfirm(id: string, name: string) {

    this.tempId = id;
    this.name = name;
    $('#user-delete').modal('show');
  }

  undeleteUserConfirm(id: string) {

    this.tempId = id;
    $('#user-undelete').modal('show');
  }

  undeleteUser() {

    $('#user-undelete').modal('hide').on('hidden.bs.modal', () => {
      if (this.tempId !== undefined && this.tempId !== '') {

        $('#user-undelete').off();
        this.isLoading = true;
        this.userList = [];
        this.start = 0;

        $('#loader-user-list').modal('show').on('shown.bs.modal', () => {
          this.isLoading = true;
          this.lookupService.undeleteUser(this.tempId)
            .then(data => {

              $('#loader-user-list').modal('hide').on('hidden.bs.modal', () => {
                this.isLoading = false;
                this.tempId = '';

                $('#loader-user-list').off();

                this.search(true);
              });
            })
            .catch(err => {
              $('#loader-user-list').modal('hide').on('hidden.bs.modal', () => {
                this.isLoading = false;
                this.tempId = '';
                this.errorHandler.handleError(err, 'UserListComponent');

                $('#loader-user-list').off();
              });
            });
        });
      }
    });
  }
}
