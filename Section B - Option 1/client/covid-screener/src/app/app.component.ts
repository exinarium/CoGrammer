import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy, OnInit {

  title = '2020Screener';
  static isLoggedIn: boolean;
  static tutorialViewed: boolean;

  userId: string;
  isAdminUser: boolean;
  messageDismissed: boolean;
  paymentPlan: number = 0;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) { }

  logout() {
    sessionStorage.clear();
    AppComponent.isLoggedIn = false;
    this.router.navigate([''], { replaceUrl: true });
  }

  dismissMessage() {

    this.messageDismissed = true;
  }

  ngOnInit() {

    this.router.events.subscribe(event => {

      AppComponent.isLoggedIn = (sessionStorage.getItem('token') === undefined ||
        sessionStorage.getItem('token') === null ||
        sessionStorage.getItem('token') === '') ? false : true;

      AppComponent.tutorialViewed = (localStorage.getItem('tutorialViewed') === undefined ||
        localStorage.getItem('tutorialViewed') === null ||
        localStorage.getItem('tutorialViewed') === '') ? false : true;

      this.isAdminUser = (
        sessionStorage.getItem('user') === undefined ? false :
          sessionStorage.getItem('user') === null ? false :
            JSON.parse(sessionStorage.getItem('user')).isAdminUser);

      this.userId = (
        sessionStorage.getItem('user') === undefined ? '' :
          sessionStorage.getItem('user') === null ? '' :
            JSON.parse(sessionStorage.getItem('user'))._id);

      this.paymentPlan = (
        sessionStorage.getItem('user') === undefined ? 0 :
          sessionStorage.getItem('user') === null ? 0 :
            JSON.parse(sessionStorage.getItem('user'))?.paymentPlan?.planNumber);
    });
  }

  ngOnDestroy() {

    this.title = undefined;
    this.router = undefined;
  }

  get staticIsLoggedIn() {
    return AppComponent.isLoggedIn;
  }

  get staticTutorialViewed() {
    return AppComponent.tutorialViewed;
  }

  static showTutorial() {

    $('#tutorial-modal').modal('show');
  }

  static finishTutorial() {

    $('#tutorial-modal').modal('hide');
    AppComponent.tutorialViewed = true;
  }

  showTutorialScreen() {

    AppComponent.showTutorial();
  }

  finishTutorialScreen() {

    AppComponent.finishTutorial();
  }
}