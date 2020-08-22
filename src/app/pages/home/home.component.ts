import { Component, OnInit } from '@angular/core';
import { StoredAnswer } from 'src/app/shared/models/answer.model';
import { Observable } from 'rxjs';
import { AnswerService } from 'src/app/services/answer/answer.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
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
export class HomeComponent implements OnInit {
  answersObservable: Observable<StoredAnswer[]>;
  step = 0;
  panelOpenState = false;

  constructor(
    answerService: AnswerService
  ) {
    this.answersObservable = answerService.readAnswers();
  }

  ngOnInit(): void {
  }

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }
}
