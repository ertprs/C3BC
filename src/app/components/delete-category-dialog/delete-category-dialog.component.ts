import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryService } from 'src/app/services/category/category.service';
import { CategoryDialogData } from 'src/app/shared/models/category.model';

@Component({
  selector: 'app-delete-category-dialog',
  templateUrl: './delete-category-dialog.component.html',
  styleUrls: ['./delete-category-dialog.component.css']
})
export class DeleteCategoryDialogComponent implements OnInit {

  constructor(
    private _dialogRef: MatDialogRef<DeleteCategoryDialogComponent>,
    private _categoryService: CategoryService,
    @Inject(MAT_DIALOG_DATA) private _data: CategoryDialogData
  ) {}

  ngOnInit(): void {
  }

  onNoClick() {
    this._dialogRef.close();
  }

  deleteCategory() {
    this._categoryService.deleteCategory(this._data.categoryName)
    this.onNoClick()
  }
}
