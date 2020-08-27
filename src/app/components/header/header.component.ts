import { Component, OnInit } from '@angular/core';
import { SearchService } from '../../services/search/search.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  private _showSearchToolbarSubscription: Subscription;
  showSearchToolbar: boolean;
  userIsLogged: boolean = true;

  constructor(
    private _searchService: SearchService
  ) {
    this.showSearchToolbar = _searchService.showSearchToolbar.value
  }

  ngOnInit(): void {
    this._showSearchToolbarSubscription = this._searchService.showSearchToolbar.subscribe( newValue => {
      this.showSearchToolbar = newValue;
    })
  }

  ngOnDestroy() {
    this._showSearchToolbarSubscription.unsubscribe()
  }

  get logoClass() {
    return this.userIsLogged ? "logo-home-page" : "logo-login-page"
  }

  get mainToolbarClass() {
    return this.userIsLogged ? "main-toolbar-home-page" : "main-toobar-login-page"
  }

}
