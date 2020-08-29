import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/services/category/category.service';
import { Observable } from 'rxjs';
import { StoredCategory } from 'src/app/shared/models/category.model';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Answer } from 'src/app/shared/models/answer.model';
import { AnswerService } from 'src/app/services/answer/answer.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-answer',
  templateUrl: './create-answer.component.html',
  styleUrls: ['./create-answer.component.css']
})
export class CreateAnswerComponent implements OnInit {
  answerFormGroup: FormGroup;
  categoriesObservable: Observable<StoredCategory[]>;

  constructor(
    private _answerService: AnswerService,
    private _router: Router,
    categoryService: CategoryService,
    formBuilder: FormBuilder
  ) {
    this.categoriesObservable = categoryService.readCategories();

    this.answerFormGroup = formBuilder.group({
      name: [ , Validators.required],
      categories: [ , [Validators.required]],
      content: [ , Validators.required]
    })
  }

  ngOnInit(): void {
  }

  createAnswer() {
    const newAnswer: Answer = this.answerFormGroup.value

    this._answerService.createAnswer(newAnswer)
    this._router.navigate(["/home"])
  }
}
