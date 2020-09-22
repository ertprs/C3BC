import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/shared/services/category/category.service';
import { Observable } from 'rxjs';
import { Category } from 'src/app/shared/models/category.model';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Answer } from 'src/app/shared/models/answer.model';
import { AnswerService } from 'src/app/shared/services/answer/answer.service';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { QuillModule } from 'ngx-quill';

@Component({
  selector: 'app-edit-answer',
  templateUrl: './edit-answer.component.html',
  styleUrls: ['./edit-answer.component.css']
})
export class EditAnswerComponent implements OnInit {
  answerFormGroup: FormGroup;
  categoriesObservable: Observable<Category[]>;
  answer: Answer;
  richEditorConfig: QuillModule;
  useCustomInvalidClass: boolean;

  constructor(
    private _answerService: AnswerService,
    private _router: Router,
    categoryService: CategoryService,
    formBuilder: FormBuilder,
  ) {
    this.answer = _router.getCurrentNavigation().extras.state.answer

    this.answerFormGroup = formBuilder.group({
      name: [this.answer.name, Validators.required],
      categories: [ , Validators.required],
      content: [this.answer.content, Validators.required]
    })

    this.categoriesObservable = categoryService.readCategories().pipe(
      tap( categories => {
        // aqui, estamos filtrando somente as categorias as quais a resposta pertence, para depois adicionarmos como valores ao formControl categories
        const selectedCategories: Category[] = categories.filter( category => this.answer.categoryIDs.includes(category.id) )
        
        this.answerFormGroup.controls['categories'].setValue(selectedCategories)
      })
    )

    this.richEditorConfig = {
      toolbar: {
        container: [
          ['bold', 'italic', 'underline'],            // botões toggle
          ['link'],
          ['code-block'],
          // [{ 'indent': '-1'}, { 'indent': '+1' }],
          ['clean'],                                  // botão para remover formatação
        ]
      }
    }
  }

  ngOnInit(): void {
  }

  editAnswer() {
    const categoryIDs = this.answerFormGroup.value.categories?.map( answer => answer.id )
    const updatedAnswer: Answer = {id: this.answer.id, name: this.answerFormGroup.value.name, content: this.answerFormGroup.value.content,  categoryIDs}

    this._answerService.updateAnswer(updatedAnswer)
    this._router.navigate(["/home"])
  }

  onSelectionChanged = (event) =>{
    if(event.range == null){
      this.onBlur();
    }
  }

  onBlur = () =>{
    this.useCustomInvalidClass = true;
  }
}
