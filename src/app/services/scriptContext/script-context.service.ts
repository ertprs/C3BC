import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class ScriptContextService {
  isBroswerActionScript: boolean;
  isContentScript: boolean;

  // teremos a altura de window como indicadora de que o script está rodando no browser action ou no content script. Para que funcione, a altura do
  // browser action terá que ser sempre igual a 600, enquanto que isContentScript deverá ser sempre diferente desse valor
  constructor() {
    this.isBroswerActionScript = window.innerHeight == 600
    this.isContentScript = !this.isBroswerActionScript
  }
}
