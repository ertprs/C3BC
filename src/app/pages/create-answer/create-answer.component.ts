import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/services/category/category.service';
import { Observable } from 'rxjs';
import { Category } from 'src/app/shared/models/category.model';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Answer } from 'src/app/shared/models/answer.model';
import { AnswerService } from 'src/app/services/answer/answer.service';
import { Router } from '@angular/router';
import { QuillModule } from 'ngx-quill';
import 'quill-emoji/dist/quill-emoji.js'

@Component({
  selector: 'app-create-answer',
  templateUrl: './create-answer.component.html',
  styleUrls: ['./create-answer.component.css']
})
export class CreateAnswerComponent implements OnInit {
  answerFormGroup: FormGroup;
  categoriesObservable: Observable<Category[]>;
  richEditorConfig: QuillModule;
  useCustomInvalidClass: boolean;

  constructor(
    private _answerService: AnswerService,
    private _router: Router,
    categoryService: CategoryService,
    formBuilder: FormBuilder
  ) {
    this.categoriesObservable = categoryService.readCategories();

    this.answerFormGroup = formBuilder.group({
      name: [ , Validators.required],
      categories: [ , Validators.required],
      content: [ , Validators.required]
    })

    this.richEditorConfig = {
      toolbar: {
        container: [
          ['bold', 'italic', 'underline'],            // botões toggle
          ['link'],
          ['code-block'],
          // [{ 'indent': '-1'}, { 'indent': '+1' }],
          ['clean'],                                  // botão para remover formatação
          ['emoji']
        ]
      },
      "emoji-shortname": true,
      "emoji-textarea": false,
      "emoji-toolbar": true,
    }
  }

  ngOnInit(): void {
  }

  createAnswer() {
    const categoriesID = this.answerFormGroup.value.categories?.map( category => category.id )
    const newAnswer: Omit<Answer, "id"> = { name: this.answerFormGroup.value.name, content: this.answerFormGroup.value.content, categoriesID }

    this._answerService.createAnswer(newAnswer)
    this._router.navigate(["/home"])
  }

  onSelectionChanged = (event) =>{
    // if(event.oldRange == null){
    //   this.onFocus();
    // }
    if(event.range == null){
      this.onBlur();
    }
  }

  // onContentChanged = (event) =>{
  //   console.log(event.html);
  // }

  onBlur = () =>{
    this.useCustomInvalidClass = true;
  }
}
