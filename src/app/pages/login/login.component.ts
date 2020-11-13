import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { LoginCredentials, AuthService } from '../../shared/services/auth/auth.service';
import { NotificationService } from '../../shared/services/notification/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginFormGroup: FormGroup

  constructor(
    private _authService: AuthService,
    private _notificationService: NotificationService,
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
      .then( () => this._notificationService.notify('Bem vindo!') )
      .catch(this.notifyError.bind(this))
  }

  notifyError(authError) {
    let message: string = "";
    let durationInSeconds: number = 3;

    switch (authError.code) {
      case 'auth/wrong-password':
        message = 'A senha está incorreta.';
        break;
      case 'auth/user-not-found':
        message = 'Não há registro de usuário correspondente a este email. O usuário pode ter sido excluído.'
        durationInSeconds = 5;
        break;
      case 'auth/network-request-failed':
        message = 'Ocorreu um erro de rede (como tempo limite, conexão interrompida ou host inacessível).';
        durationInSeconds = 5;
        break;
      case 'auth/too-many-requests':
        message = 'O acesso a esta conta foi temporariamente desativado devido a muitas tentativas de login malsucedidas. Você pode restaurá-lo imediatamente redefinindo sua senha ou pode tentar novamente mais tarde.';
        durationInSeconds = 7;
        break;
      case 'auth/user-disabled':
        message = 'Essa conta de usuário foi desabilitada.';
        durationInSeconds = 4;
        break;
      default:
        message = authError.message;
        durationInSeconds = 5;
    }

    this._notificationService.notify(message, durationInSeconds);
  }
}
