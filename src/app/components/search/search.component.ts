import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ScriptContextService } from 'src/app/shared/services/scriptContext/script-context.service';
import { SearchService } from 'src/app/shared/services/search/search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  private _C3BCDialogJustOpenedSubscription: Subscription;
  private _C3BCDialogJustClosedSubscription: Subscription;
  @ViewChild('search') searchInputElement: ElementRef;

  constructor(
    private _changeDetector: ChangeDetectorRef,
    public scriptContext: ScriptContextService,
    public searchService: SearchService,
  ) { }

  ngOnInit(): void {
    if(this.scriptContext.isContentScript)
      this._C3BCDialogJustClosedSubscription = this.scriptContext.C3BCDialogJustClosed.subscribe(this.cleanSearchText.bind(this));
  }

  ngAfterViewInit() {
    if(this.scriptContext.isContentScript)
      this._C3BCDialogJustOpenedSubscription = this.scriptContext.C3BCDialogJustOpened.subscribe(this.focusOnTheSearchInput.bind(this));
    else
      if(this.scriptContext.isPageActionScript) this.focusOnTheSearchInput.bind(this)();
  }

  ngOnDestroy() {
    this._C3BCDialogJustOpenedSubscription?.unsubscribe();
    this._C3BCDialogJustClosedSubscription?.unsubscribe();
  }

  focusOnTheSearchInput() {
    // Usar setTimeout evita problemas com detecção de mudanças. Essa técnica é documentada aqui: https://angular.io/guide/component-interaction#!#parent-to-view-child
    setTimeout(() => this.searchInputElement.nativeElement.focus(), 0);

    // como as mudanças podem partir de um outro contexto, é necessário que forcemos a detecção de mudanças, para que haja também atualização no template
    this._changeDetector.detectChanges();
  }

  cleanSearchText() {
    this.searchService.searchText = '';

    this._changeDetector.detectChanges();
  }
}
