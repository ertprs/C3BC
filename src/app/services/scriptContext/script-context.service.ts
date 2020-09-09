import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ScriptContextService {
  isBroswerActionScript: boolean;
  isContentScript: boolean;
  contentScriptJustClosed = new Subject();

  // teremos a altura de window como indicadora de que o script está rodando no browser action ou no content script. Para que funcione, a altura do
  // browser action terá que ser sempre igual a 600, enquanto que isContentScript deverá ser sempre diferente desse valor
  constructor() {
    this.isBroswerActionScript = window.innerHeight == 600
    this.isContentScript = !this.isBroswerActionScript

    // aqui, definimos uma procedimento que irá pôr o tabGroup em seu estado inicial novamente
    chrome.runtime.onMessage.addListener( (request) => {
      if (request.message == "resetar tabGroup"){
        this.contentScriptJustClosed.next()
      };
    });
  }
}
