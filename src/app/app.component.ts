import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'C3BC';
  userIsLogged: boolean = true;
  showSearchToolbar: boolean = false;

  get logoClass() {
    return this.userIsLogged ? "logo-home-page" : "logo-login-page"
  }

  get mainToolbarClass() {
    return this.userIsLogged ? "main-toolbar-home-page" : "main-toobar-login-page"
  }
}
