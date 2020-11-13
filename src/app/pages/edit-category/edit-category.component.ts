import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CategoryService } from 'src/app/shared/services/category/category.service';
import { Observable } from 'rxjs';
import { Category } from 'src/app/shared/models/category.model';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { tap, map } from 'rxjs/operators';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.css']
})
export class EditCategoryComponent implements OnInit {
  categoryFormGroup: FormGroup;
  categoriesObservable: Observable<Category[]>;
  category: Category;
  @ViewChild('categoryName') categoryNameInputElement: ElementRef;

  constructor(
    private _categoryService: CategoryService,
    private _notificationService: NotificationService,
    private _router: Router,
    formBuilder: FormBuilder,
  ) {
    this.category = _router.getCurrentNavigation().extras.state.category;

    this.categoryFormGroup = formBuilder.group({
      name: [this.category.name, Validators.required],
      parents: [ , ]
    })

    this.categoriesObservable = _categoryService.readCategories().pipe(
      map( categories => categories.filter( category => this.category.id != category.id ) ),
      tap( categories => {
        if(this.category.parentIDs){
          const selectedParents: Category[] = categories.filter( category => this.category.parentIDs.includes(category.id) );

          this.categoryFormGroup.controls['parents'].setValue(selectedParents);
        }
      })
    );
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    // Usar setTimeout evita problemas com detecção de mudanças. Essa técnica é documentada aqui: https://angular.io/guide/component-interaction#!#parent-to-view-child
    setTimeout(() => this.categoryNameInputElement.nativeElement.focus(), 0);
  }

  editCategory() {
    const parentIDs = this.categoryFormGroup.value.parents?.map( category => category.id )
    const updatedCategory: Category = {id: this.category.id, name: this.categoryFormGroup.value.name, parentIDs}

    this._categoryService.updateCategory(updatedCategory)
      .then(() => {
        this._router.navigate(["/home"]);
        this._notificationService.notify('Categoria alterada com sucesso.')
      })
      .catch(error => this._notificationService.notify(error, 7, 'top'));
  }
}
