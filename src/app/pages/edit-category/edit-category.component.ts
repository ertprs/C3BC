import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/services/category/category.service';
import { Observable } from 'rxjs';
import { Category, CategoryWithParentsID } from 'src/app/shared/models/category.model';
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
  categoryWithParentsName: CategoryWithParentsID;

  constructor(
    private _categoryService: CategoryService,
    private _router: Router,
    formBuilder: FormBuilder,
  ) {
    this.categoryWithParentsName = _router.getCurrentNavigation().extras.state.categoryWithParentsName
    
    this.categoryFormGroup = formBuilder.group({
      name: [this.categoryWithParentsName.name, Validators.required],
      parents: [ , ]
    })
    
    this.categoriesObservable = _categoryService.readCategories().pipe(
      map( categories => categories.filter( category => this.categoryWithParentsName.id != category.id ) ),
      tap( categories => {
        if(this.categoryWithParentsName.parentsID){
          const selectedParents: Category[] = categories.filter( category => this.categoryWithParentsName.parentsID.includes(category.id) );
          
          this.categoryFormGroup.controls['parents'].setValue(selectedParents)
        }
      })
    )
  }

  ngOnInit(): void {
  }

  editCategory() {
    const updatedCategory: Category = {id: this.categoryWithParentsName.id, ...this.categoryFormGroup.value}

    this._categoryService.updateCategory(updatedCategory)
    this._router.navigate(["/home"])
  }
}
