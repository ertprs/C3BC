import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/services/category/category.service';
import { Observable } from 'rxjs';
import { Category } from 'src/app/shared/models/category.model';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { tap, map } from 'rxjs/operators';

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.css']
})
export class EditCategoryComponent implements OnInit {
  categoryFormGroup: FormGroup;
  categoriesObservable: Observable<Category[]>;
  category: Category;

  constructor(
    private _categoryService: CategoryService,
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

  editCategory() {
    const parentIDs = this.categoryFormGroup.value.parents?.map( category => category.id )
    const updatedCategory: Category = {id: this.category.id, name: this.categoryFormGroup.value.name, parentIDs}

    this._categoryService.updateCategory(updatedCategory)
    this._router.navigate(["/home"])
  }
}
