import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private _showSearchToolbar = new BehaviorSubject<boolean>(false);
  public searchText: string;

  constructor() { }

  get showSearchToolbar() {
    return this._showSearchToolbar
  }

  enableSearchToolbar() {
    this._showSearchToolbar.next(true)
  }

  disableSearchToolbar() {
    this._showSearchToolbar.next(false)
  }
}
