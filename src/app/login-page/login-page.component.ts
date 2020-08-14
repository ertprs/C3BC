import { Component, OnInit } from '@angular/core';
import { LoginCredentials, LoginService } from '../services/login.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  loginFormGroup: FormGroup

  constructor(
    private _loginService: LoginService,
    private _router: Router,
    formBuilder: FormBuilder
  ){
    this.loginFormGroup = formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
    })
  }

  ngOnInit() {
  }

  login() {
    const loginCredentials: LoginCredentials = this.loginFormGroup.value;

    this._loginService.login(loginCredentials)
      .then( authData => {
        this._router.navigate(["/"])
        console.log(authData)
      })
      .catch( authError => {
        console.log(authError)
      })
  }
}
