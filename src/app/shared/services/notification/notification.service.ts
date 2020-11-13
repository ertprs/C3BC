import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private _snackBar: MatSnackBar) {}

  notify(message: string, durationInSeconds: number = 3, action: string = 'X') {
    this._snackBar.open(message, action, {
      duration: durationInSeconds * 1000,
    });
  }
}
