import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Answer } from 'src/app/shared/models/answer.model';
import { AnswerService } from 'src/app/services/answer/answer.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { DeleteAnswerDialogComponent } from '../delete-answer-dialog/delete-answer-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-answers-tab',
  templateUrl: './answers-tab.component.html',
  styleUrls: ['./answers-tab.component.css'],
  animations: [
    trigger('fade-in', [
      state('start', style({
        opacity: 0
      })),
      transition(':enter', [
        style({ opacity: '0' }),
        animate(400)
      ])
    ])
  ]
})
export class AnswersTabComponent implements OnInit {
  answersObservable: Observable<Answer[]>;
  step = 0;

  constructor(
    private _dialog: MatDialog,
    private _router: Router,
    answerService: AnswerService,
  ) {
    this.answersObservable = answerService.readAnswers();
  }

  ngOnInit(): void {
  }

  setStep(index: number) {
    this.step = index;
  }

  nextAnswer() {
    this.step++;
  }

  prevAnswer() {
    this.step--;
  }

  openDialog(answerID: string) {
    this._dialog.open(DeleteAnswerDialogComponent, {data: {answerID}});
  }

  navigateToEditAnswer(answer: Answer) {
    //Aqui, estamos navegando e mandando dados para a página chamada
    this._router.navigate(["/home/edit-answer"], {state: {answer}})
  }
}
