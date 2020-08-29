import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { StoredCategory } from 'src/app/shared/models/category.model';
import { Router } from '@angular/router';
import { CategoryService } from 'src/app/services/category/category.service';

@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.css']
})
export class CreateCategoryComponent implements OnInit {
  categoryFormGroup: FormGroup;
  categoriesObservable: Observable<StoredCategory[]>;

  constructor(
    private _categoryService: CategoryService,
    private _router: Router,
    formBuilder: FormBuilder
  ) {
    this.categoriesObservable = _categoryService.readCategories();

    this.categoryFormGroup = formBuilder.group({
      name: ["", Validators.required],
      parents: [ , ]
    })
  }

  ngOnInit(): void {
  }

  createCategory() {
    const newCategory: StoredCategory = this.categoryFormGroup.value

    this._categoryService.createCategory(newCategory)
    this._router.navigate(["/home"])
  }
}
