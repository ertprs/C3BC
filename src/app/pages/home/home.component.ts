import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatTabGroup, MatTabChangeEvent } from '@angular/material/tabs';
import { SearchService } from 'src/app/services/search/search.service';
import { ScriptContextService } from 'src/app/services/scriptContext/script-context.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private _selectedTabChangeSubscription: Subscription;
  private _currentTabTextLabel: string;
  @ViewChild("tabGroup") tabGroup: MatTabGroup;

  constructor(
    private searchService: SearchService,
    public scriptContext: ScriptContextService
  ) {
    this._currentTabTextLabel = 'respostas'
  }

  ngOnInit(): void {
    this.searchService.enableSearchToolbar();
  }

  ngAfterViewInit() {
    this._selectedTabChangeSubscription = this.tabGroup.selectedTabChange.subscribe( (selectedTabChange: MatTabChangeEvent) => {
      this._currentTabTextLabel = selectedTabChange.tab.textLabel;
    })
  }

  ngOnDestroy() {
    this.searchService.disableSearchToolbar();
    this._selectedTabChangeSubscription.unsubscribe();
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
}
