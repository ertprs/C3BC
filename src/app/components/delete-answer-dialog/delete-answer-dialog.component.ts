import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AnswerService } from 'src/app/shared/services/answer/answer.service';
import { AnswerDialogData } from 'src/app/shared/models/answer.model';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';

@Component({
  selector: 'app-delete-answer-dialog',
  templateUrl: './delete-answer-dialog.component.html',
  styleUrls: ['./delete-answer-dialog.component.css']
})
export class DeleteAnswerDialogComponent implements OnInit {

  constructor(
    private _dialog: MatDialogRef<DeleteAnswerDialogComponent>,
    private _answerService: AnswerService,
    private _notificationService: NotificationService,
    @Inject(MAT_DIALOG_DATA) private _data: AnswerDialogData
  ) {}

  ngOnInit(): void {
  }

  deleteAnswer() {
    this._answerService.deleteAnswer(this._data.answerID)
      .then(() => {
        this._notificationService.notify('Resposta apagada com sucesso.');
      })
      .catch(error => this._notificationService.notify(error));

    this._dialog.close();
  }
}
