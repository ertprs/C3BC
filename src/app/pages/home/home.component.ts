import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatTabGroup, MatTabChangeEvent } from '@angular/material/tabs';
import { SearchService } from 'src/app/shared/services/search/search.service';
import { ScriptContextService } from 'src/app/shared/services/scriptContext/script-context.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private _selectedTabChangeSubscription: Subscription;
  private _C3BCDialogJustClosedSubscription: Subscription;
  private _currentTabTextLabel: string;
  @ViewChild("tabGroup") tabGroup: MatTabGroup;
  selectedTab = new FormControl(0);

  constructor(
    private _searchService: SearchService,
    private _changeDetector: ChangeDetectorRef,
    public scriptContext: ScriptContextService
  ) {
    this._currentTabTextLabel = 'respostas';
  }

  ngOnInit(): void {
    this._searchService.enableSearchToolbar();
  }

  ngAfterViewInit() {
    this._selectedTabChangeSubscription = this.tabGroup.selectedTabChange.subscribe( (selectedTabChange: MatTabChangeEvent) => {
      this._currentTabTextLabel = selectedTabChange.tab.textLabel;
    })

    if(this.scriptContext.isContentScript) 
      this._C3BCDialogJustClosedSubscription = this.scriptContext.C3BCDialogJustClosed.subscribe(this.resetSelectedTab.bind(this))
  }

  ngOnDestroy() {
    this._searchService.disableSearchToolbar();
    this._selectedTabChangeSubscription.unsubscribe();
    this._C3BCDialogJustClosedSubscription?.unsubscribe()
  }

  get buttonMessage(): string {
    return `Adicionar ${this._currentTabTextLabel.slice(0, -1).toLowerCase()}`;
  }

  get currentTabRoute() {
    let route;

    switch(this._currentTabTextLabel.toLowerCase()) {
      case 'respostas':
        route = 'create-answer';
        break;
      case 'categorias':
        route = 'create-category';
    };

    return route;
  }

  resetSelectedTab() {
    const firstTab = 0;
    this.selectedTab.setValue(firstTab);

    // como as mudanças partem de um outro contexto, é necessário que forcemos a detecção de mudanças, para que haja também atualização no template
    this._changeDetector.detectChanges();
  }
}
