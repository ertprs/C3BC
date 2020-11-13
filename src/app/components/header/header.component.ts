import { Component, OnInit } from '@angular/core';
import { SearchService } from '../../shared/services/search/search.service';
import { Subscription } from 'rxjs';
import { ScriptContextService } from '../../shared/services/scriptContext/script-context.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { FormControl } from '@angular/forms';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  private _showSearchToolbarSubscription: Subscription;
  private _userIsLoggedSubscription: Subscription;
  tooltipShowDelay = new FormControl(1000);
  showSearchToolbar: boolean;
  userIsLogged: boolean = true;

  constructor(
    private _authService: AuthService,
    public _searchService: SearchService,
    private _notificationService: NotificationService,
    public scriptContext: ScriptContextService,
  ) {
    this.showSearchToolbar = _searchService.showSearchToolbar.value
  }

  ngOnInit(): void {
    this._showSearchToolbarSubscription = this._searchService.showSearchToolbar.subscribe( newValue => this.showSearchToolbar = newValue );

    this._userIsLoggedSubscription = this._authService.authState.subscribe( auth => this.userIsLogged = auth ? true : false );
  }

  ngOnDestroy() {
    this._showSearchToolbarSubscription.unsubscribe();
    this._userIsLoggedSubscription.unsubscribe();
  }

  get logoClass() {
    return this.userIsLogged ? "logo-home-page" : "logo-login-page"
  }

  get mainToolbarClass() {
    return this.userIsLogged ? "main-toolbar-home-page" : "main-toobar-login-page"
  }

  logout() {
    this._authService.signOut()
      .then( () => this._notificationService.notify('Usuário desconectado.') )
      .catch(error => this._notificationService.notify(error))
  }
}
