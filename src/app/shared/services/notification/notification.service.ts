import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private _snackBar: MatSnackBar) {}

  notify(
    message: string,
    durationInSeconds?: number,
    verticalPosition?: MatSnackBarVerticalPosition,
    horizontalPosition?: MatSnackBarHorizontalPosition,
    action: string = 'X') {
      const defaultDurationInSeconds = 3;

      this._snackBar.open(message, action, {
        duration: (durationInSeconds || defaultDurationInSeconds) * 1000,
        verticalPosition: verticalPosition || 'bottom',
        horizontalPosition: horizontalPosition ||'start',
    });
  }
}
