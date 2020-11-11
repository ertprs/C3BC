import { Injectable } from '@angular/core';
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
    private _router: Router
  ) {
    this.authState = this._angularFireAuth.authState

    this._angularFireAuth.onAuthStateChanged(user => {
      if (!user)
        this._router.navigate(["/login"]);
      else
        this._router.navigate(["/home"]);
    });
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
}
