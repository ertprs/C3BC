import { Injectable, NgZone } from '@angular/core';
import { Subject } from 'rxjs';
import { NotificationService } from '../notification/notification.service';


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
  constructor(
    private _notificationService: NotificationService,
    private _ngZone: NgZone
  ) {
    this.isPageActionScript = window.innerHeight == 600
    this.isContentScript = !this.isPageActionScript

    chrome.runtime.onMessage.addListener(this.checkExtensionMessage.bind(this));
  }

  // aqui, definimos uma procedimento que irá pôr o tabGroup em seu estado inicial novamente
  checkExtensionMessage(message) {
    if(message.isNotification) {
      if ( (message.type === 'to_the_page_action' && this.isPageActionScript) || (message.type === 'to_the_current_tab' && this.isContentScript)) {
        this._ngZone.run(() => {
          this._notificationService.notify(message.content, 5);

          return;
        })
      }
    }

    if(message.type === 'from_the_background') {
      switch (message.info) {
        case "C3BC_opened":
          this.C3BCDialogJustOpened.next();
          break;
        case "C3BC_closed":
          this.C3BCDialogJustClosed.next();
      }

      return;
    }
  }

  sendMessage(message) {
    chrome.runtime.sendMessage({type: 'to_the_current_tab',...message});
  }

  insertAnswer(answer: string) {
    const origination = this.isContentScript ? 'content_script' : 'page_action';

    this.sendMessage({action: "add_answer", content: answer, origination});
  }
}
