import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ScriptContextService {
  isPageActionScript: boolean;
  isContentScript: boolean;
  C3BCDialogJustOpened = new Subject();
  C3BCDialogJustClosed = new Subject();

  // teremos a altura de window como indicadora de que o script está rodando no page action ou no content script. Para que funcione, a altura do
  // page action terá que ser sempre igual a 600, enquanto que isContentScript deverá ser sempre diferente desse valor
  constructor() {
    this.isPageActionScript = window.innerHeight == 600
    this.isContentScript = !this.isPageActionScript

    chrome.runtime.onMessage.addListener(this.checkExtensionMessage.bind(this));
  }

  // aqui, definimos uma procedimento que irá pôr o tabGroup em seu estado inicial novamente
  checkExtensionMessage(message) {
    if(message.type !== 'fromTheBackground') return;

    switch (message.info) {
      case "C3BC_opened":
        this.C3BCDialogJustOpened.next();
        break;
      case "C3BC_closed":
        this.C3BCDialogJustClosed.next();
    }
  }

  sendMessage(message) {
    chrome.runtime.sendMessage({type: 'toTheCurrentTab',...message});
  }

  insertAnswer(answer: string) {
    this.sendMessage({action: "add_answer", content: answer});
  }
}
