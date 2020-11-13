import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryService } from 'src/app/shared/services/category/category.service';
import { CategoryDialogData } from 'src/app/shared/models/category.model';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';

@Component({
  selector: 'app-delete-category-dialog',
  templateUrl: './delete-category-dialog.component.html',
  styleUrls: ['./delete-category-dialog.component.css']
})
export class DeleteCategoryDialogComponent implements OnInit {

  constructor(
    private _dialog: MatDialogRef<DeleteCategoryDialogComponent>,
    private _categoryService: CategoryService,
    private _notificationService: NotificationService,
    @Inject(MAT_DIALOG_DATA) private _data: CategoryDialogData
  ) {}

  ngOnInit(): void {
  }

  deleteCategory() {
    this._categoryService.deleteCategory(this._data.categoryID)
      .then(() => {
        this._notificationService.notify('Categoria apagada com sucesso.');
      })
      .catch(error => this._notificationService.notify(error));

    this._dialog.close();
  }
}
