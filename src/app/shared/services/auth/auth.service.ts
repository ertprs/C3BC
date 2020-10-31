import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

export interface LoginCredentials {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public authState
  
  constructor(private _angularFireAuth: AngularFireAuth) {
    this.authState = this._angularFireAuth.authState
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
