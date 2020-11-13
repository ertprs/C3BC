import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Category } from 'src/app/shared/models/category.model';
import { Router } from '@angular/router';
import { CategoryService } from 'src/app/shared/services/category/category.service';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';

@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.css']
})
export class CreateCategoryComponent implements OnInit {
  categoryFormGroup: FormGroup;
  categoriesObservable: Observable<Category[]>;
  @ViewChild('categoryName') categoryNameInputElement: ElementRef;

  constructor(
    private _categoryService: CategoryService,
    private _notificationService: NotificationService,
    private _router: Router,
    formBuilder: FormBuilder
  ) {
    this.categoriesObservable = _categoryService.readCategories();

    this.categoryFormGroup = formBuilder.group({
      name: [ , Validators.required],
      parents: [ , ]
    })
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    // Usar setTimeout evita problemas com detecção de mudanças. Essa técnica é documentada aqui: https://angular.io/guide/component-interaction#!#parent-to-view-child
    setTimeout(() => this.categoryNameInputElement.nativeElement.focus(), 0);
  }

  createCategory() {
    const parentIDs = this.categoryFormGroup.value.parents?.map( category => category.id )
    const newCategory: Omit<Category, "id"> = { name: this.categoryFormGroup.value.name, parentIDs: parentIDs }

    this._categoryService.createCategory(newCategory)
      .then(() => {
        this._router.navigate(["/home"]);
        this._notificationService.notify('Categoria adicionada com sucesso.')
      })
      .catch(error => this._notificationService.notify(error, 7, 'top'));
  }
}
