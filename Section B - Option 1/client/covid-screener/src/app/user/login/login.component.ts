import { Component, OnDestroy, ViewChild, ElementRef, OnInit } from '@angular/core';
import { LoginService } from './login.service';
import { Router } from '@angular/router';
import { ErrorHandler } from 'src/app/utilities/error-handler/error-handler';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnDestroy, OnInit {

  public emailAddress: string;
  public password: string;
  isLoading = false;
  public state = false;

  constructor(private loginService: LoginService, private router: Router, private errorHandler: ErrorHandler) {

  }

  ngOnInit() {

    if(AppComponent.isLoggedIn) {
      this.router.navigate(['/contact/profile-list'], { replaceUrl: true });
    }
  }

  doLogin() {

    this.isLoading = true;
    this.loginService.login(this.emailAddress.trim(), this.password)
      .then(data => {
        if (data && data?.data && data?.data?.userModel && data?.data?.token) {
          sessionStorage.setItem('user', JSON.stringify(data?.data?.userModel));
          sessionStorage.setItem('token', data?.data?.token);
          this.isLoading = false;
          this.router.navigate(['/contact/profile-list'], { replaceUrl: true });
        } else {
          throw new Error('Invalid credentials');
        }
      })
      .catch(err => {
        this.errorHandler.handleError(err, 'LoginComponent');
        this.isLoading = false;
      });
  }

  forgotPassword() {

    this.router.navigate(['forgot-password'], { replaceUrl: true })
  }

  ngOnDestroy() {
    this.isLoading = undefined;
    this.emailAddress = undefined;
    this.password = undefined;
    this.loginService = undefined;
    this.router = undefined;
    this.state = undefined;
  }

  toggle() {
    if (this.state) {
      document.getElementById("password").setAttribute("type", "password");
      document.getElementById("eye").style.color = '#7a797e';
      this.state = false;
    }
    else {
      document.getElementById("password").setAttribute("type", "text");
      document.getElementById("eye").style.color = '#5887ef';
      this.state = true;
    }
  }
}
