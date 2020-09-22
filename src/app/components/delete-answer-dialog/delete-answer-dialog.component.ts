import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AnswerService } from 'src/app/shared/services/answer/answer.service';
import { AnswerDialogData } from 'src/app/shared/models/answer.model';

@Component({
  selector: 'app-delete-answer-dialog',
  templateUrl: './delete-answer-dialog.component.html',
  styleUrls: ['./delete-answer-dialog.component.css']
})
export class DeleteAnswerDialogComponent implements OnInit {

  constructor(
    private _dialogRef: MatDialogRef<DeleteAnswerDialogComponent>,
    private _answerService: AnswerService,
    @Inject(MAT_DIALOG_DATA) private _data: AnswerDialogData
  ) {}

  ngOnInit(): void {
  }

  onNoClick() {
    this._dialogRef.close();
  }

  deleteAnswer() {
    this._answerService.deleteAnswer(this._data.answerID)
    this.onNoClick()
  }
}
