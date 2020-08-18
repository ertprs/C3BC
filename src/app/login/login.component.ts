import { Component, OnInit } from '@angular/core';
import { LoginCredentials, LoginService } from '../services/login/login.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { KeepDataService } from '../services/keep-data/keep-data.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginFormGroup: FormGroup

  constructor(
    private _loginService: LoginService,
    private _router: Router,
    keepData: KeepDataService,
    formBuilder: FormBuilder
  ){
    // keepData.createAnswer({
    //   name: "           É é é            ",
    //   content: " É    Bla Bla Bla              ",
    //   category: "web"
    // })
    // .then( result => console.log(result))
    // .catch( error => console.log(error))

    // keepData.deleteAnswer("p6T4m9Oui6spmAkH4nKF")
    //   .catch( error => console.log(error))

    // keepData.updateAnswer({
    //     id: "j9ux4ZNRv5woRUYKE9yM",
    //     name: " O que        é IIFE     ",
    //     content: "                                                    Teste                 ",
    //     category: "web"
    //   })
    //   .catch( error => console.log(error))

    // keepData.searchByText("O que É ").subscribe(res => {
    //   res.forEach( doc => console.log(doc.name, doc.id) )
    // })

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
        this._router.navigate(["/home"])
        console.log(authData)
      })
      .catch( authError => {
        console.log(`Error: ${authError}`)
      })
  }
}
