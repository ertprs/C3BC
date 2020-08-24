import { Component, OnInit } from '@angular/core';
import { StoredAnswer } from 'src/app/shared/models/answer.model';
import { Observable } from 'rxjs';
import { AnswerService } from 'src/app/services/answer/answer.service';
import { CategoryService } from 'src/app/services/category/category.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { storedCategoryWithAnswers } from 'src/app/shared/models/category.model';

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
  categoriesWithAnswersObservable: Observable<storedCategoryWithAnswers[]>;
  answerStep = 0;
  categoryStep = 0;

  constructor(
    answerService: AnswerService,
    categoryService: CategoryService
  ) {
    this.answersObservable = answerService.readAnswers();
    this.categoriesWithAnswersObservable = categoryService.readCategoriesWithAnswers();
    
    this.categoriesWithAnswersObservable.subscribe(res => console.log(res));
  }

  ngOnInit(): void {
  }

  setAnswerStep(index: number) {
    this.answerStep = index;
  }

  nextAnswer() {
    this.answerStep++;
  }

  prevAnswer() {
    this.answerStep--;
  }

  setCategoryStep(index: number) {
    this.categoryStep = index;
  }

  nextCategory() {
    this.categoryStep++;
  }

  prevCategory() {
    this.categoryStep--;
  }
}
