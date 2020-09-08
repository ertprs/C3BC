import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/services/category/category.service';
import { Observable } from 'rxjs';
import { Category, CategoryWithAnswers } from 'src/app/shared/models/category.model';
import { MatDialog } from '@angular/material/dialog';
import { take, tap } from 'rxjs/operators';
import { DeleteCategoryDialogComponent } from '../delete-category-dialog/delete-category-dialog.component';
import { Router } from '@angular/router';
import { ScriptContextService } from 'src/app/services/scriptContext/script-context.service';

@Component({
  selector: 'app-categories-tab',
  templateUrl: './categories-tab.component.html',
  styleUrls: ['./categories-tab.component.css']
})
export class CategoriesTabComponent implements OnInit {
  categoriesWithAnswersObservable: Observable<Observable<CategoryWithAnswers>[]>
  step = 0;

  constructor(
    private _dialog: MatDialog,
    private _router: Router,
    public scriptContext: ScriptContextService,
    categoryService: CategoryService
  ) {
    this.categoriesWithAnswersObservable = categoryService.readCategoriesWithAnswers();
  }

  ngOnInit(): void {
  }

  setStep(index: number) {
    this.step = index;
  }

  nextCategory() {
    this.step++;
  }

  prevCategory() {
    this.step--;
  }

  // provisório
  openDialog(categoryObservable: Observable<CategoryWithAnswers>) {
    categoryObservable.pipe(
      take(1),
      tap( (category: CategoryWithAnswers) => {
        this._dialog.open(DeleteCategoryDialogComponent, {data: {categoryID: category.id}});
      })
    ).subscribe()
  }

  navigateToEditCategory(categoryObservable: Observable<Category>) {
    categoryObservable.pipe(take(1)).subscribe( category => {
      this._router.navigate(["/home/edit-category"], {state: {category}})
    })
  }
}
