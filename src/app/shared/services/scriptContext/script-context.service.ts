import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ScriptContextService {
  isBroswerActionScript: boolean;
  isContentScript: boolean;
  C3BCDialogJustOpened = new Subject();
  C3BCDialogJustClosed = new Subject();

  // teremos a altura de window como indicadora de que o script está rodando no browser action ou no content script. Para que funcione, a altura do
  // browser action terá que ser sempre igual a 600, enquanto que isContentScript deverá ser sempre diferente desse valor
  constructor() {
    this.isBroswerActionScript = window.innerHeight == 600
    this.isContentScript = !this.isBroswerActionScript

    chrome.runtime.onMessage.addListener(this.checkExtensionMessage.bind(this));
  }

  // aqui, definimos uma procedimento que irá pôr o tabGroup em seu estado inicial novamente
  checkExtensionMessage({message}) {
    switch (message) {
      case "C3BC_OPEN":
        this.C3BCDialogJustOpened.next();
        break;
      case "C3BC_CLOSED":
        this.C3BCDialogJustClosed.next();
    }
  }

  insertAnswer(answerContent: string) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {answerContent}, function(response) {
        console.log(response.farewell);
      });
    });
  }
}
