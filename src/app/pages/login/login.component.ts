import { Component, OnInit } from '@angular/core';
import { LoginCredentials, AuthService } from '../../shared/services/auth/auth.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginFormGroup: FormGroup

  constructor(
    private _authService: AuthService,
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

    this._authService.signIn(loginCredentials)
      .catch( authError => {
        console.log(`Error: ${authError}`)
      })
  }
}
