import { Component, OnInit } from '@angular/core';
import { SearchService } from '../../services/search/search.service';
import { Subscription } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  private _showSearchToolbarSubscription: Subscription;
  private _userIsLoggedSubscription: Subscription;
  showSearchToolbar: boolean;
  userIsLogged: boolean;

  constructor(
    private _searchService: SearchService,
    private _angularFireAuth: AngularFireAuth
  ) {
    this.showSearchToolbar = _searchService.showSearchToolbar.value
  }

  ngOnInit(): void {
    this._showSearchToolbarSubscription = this._searchService.showSearchToolbar.subscribe( newValue => {
      this.showSearchToolbar = newValue;
    })

    this._userIsLoggedSubscription = this._angularFireAuth.authState.subscribe( auth => {
      this.userIsLogged = auth ? true : false;
    })
  }

  ngOnDestroy() {
    this._showSearchToolbarSubscription.unsubscribe()
    this._userIsLoggedSubscription.unsubscribe()
  }

  get logoClass() {
    return this.userIsLogged ? "logo-home-page" : "logo-login-page"
  }

  get mainToolbarClass() {
    return this.userIsLogged ? "main-toolbar-home-page" : "main-toobar-login-page"
  }

}
