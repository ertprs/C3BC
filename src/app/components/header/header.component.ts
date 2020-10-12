import { Component, OnInit } from '@angular/core';
import { SearchService } from '../../shared/services/search/search.service';
import { Subscription } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { ScriptContextService } from '../../shared/services/scriptContext/script-context.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  private _showSearchToolbarSubscription: Subscription;
  private _userIsLoggedSubscription: Subscription;
  showSearchToolbar: boolean;
  userIsLogged: boolean = true;

  constructor(
    private _angularFireAuth: AngularFireAuth,
    public scriptContext: ScriptContextService,
    public searchService: SearchService,
  ) {
    this.showSearchToolbar = searchService.showSearchToolbar.value
  }

  ngOnInit(): void {
    this._showSearchToolbarSubscription = this.searchService.showSearchToolbar.subscribe( newValue => {
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
