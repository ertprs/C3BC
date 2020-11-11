import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

export interface LoginCredentials {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public authState

  constructor(
    private _angularFireAuth: AngularFireAuth,
    private _router: Router,
    private _ngZone: NgZone
  ) {
    this.authState = this._angularFireAuth.authState

    this._angularFireAuth.onAuthStateChanged(this.redirect.bind(this));
  }

  signIn(credentials: LoginCredentials): Promise<firebase.auth.UserCredential>{
    return this._angularFireAuth.signInWithEmailAndPassword(
      credentials.email,
      credentials.password
    )
  }

  signOut(): Promise<void>{
    return this._angularFireAuth.signOut()
  }

  // como a mudança de rota poderá ser disparada por um evento externo ao código da aplicação, é necessário a execução da mudança de rota por meio do _ngZone.run
  redirect(currentUser) {
    this._ngZone.run(() => {
      if (currentUser)
        this._router.navigate(["/home"]);
      else
        this._router.navigate(["/login"]);
    });
  }
}
