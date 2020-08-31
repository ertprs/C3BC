import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/services/category/category.service';
import { Observable } from 'rxjs';
import { Category } from 'src/app/shared/models/category.model';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Answer, AnswerWithCategoriesName } from 'src/app/shared/models/answer.model';
import { AnswerService } from 'src/app/services/answer/answer.service';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-edit-answer',
  templateUrl: './edit-answer.component.html',
  styleUrls: ['./edit-answer.component.css']
})
export class EditAnswerComponent implements OnInit {
  answerFormGroup: FormGroup;
  categoriesObservable: Observable<Category[]>;
  answerWithCategoriesName: AnswerWithCategoriesName

  constructor(
    private _answerService: AnswerService,
    private _router: Router,
    categoryService: CategoryService,
    formBuilder: FormBuilder,
  ) {
    this.answerWithCategoriesName = _router.getCurrentNavigation().extras.state.answerWithCategoriesName

    this.answerFormGroup = formBuilder.group({
      name: [this.answerWithCategoriesName.name, Validators.required],
      categories: [ , Validators.required],
      content: [this.answerWithCategoriesName.content, Validators.required]
    })

    this.categoriesObservable = categoryService.readCategories().pipe(
      tap( categories => {
        // aqui, estamos filtrando somente as categorias as quais a resposta pertence, para depois adicionarmos como valores ao formControl categories
        const selectedCategories: Category[] = categories.filter( category => this.answerWithCategoriesName.categoriesName.includes(category.name) )
        
        this.answerFormGroup.controls['categories'].setValue(selectedCategories)
      })
    )
  }

  ngOnInit(): void {
  }

  editAnswer() {
    const updatedAnswer: Answer = {id: this.answerWithCategoriesName.id, ...this.answerFormGroup.value}

    this._answerService.updateAnswer(updatedAnswer)
    this._router.navigate(["/home"])
  }
}
