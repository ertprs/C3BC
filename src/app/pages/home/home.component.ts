import { Component, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { MatTabGroup, MatTabChangeEvent } from '@angular/material/tabs';
import { SearchService } from 'src/app/services/search/search.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private _addButtonMessage = new BehaviorSubject<string>("Adicionar resposta");
  private _selectedTabChangeSubscription: Subscription;
  @ViewChild("tabGroup") tabGroup: MatTabGroup;

  constructor(
    private searchService: SearchService
  ) { }

  ngOnInit(): void {
    this.searchService.enableSearchToolbar()
  }

  ngAfterViewInit() {
    this._selectedTabChangeSubscription = this.tabGroup.selectedTabChange.subscribe( (selectedTabChange: MatTabChangeEvent) => {
      this.buttonMessage = selectedTabChange.tab.textLabel
    })
  }

  ngOnDestroy() {
    this.searchService.disableSearchToolbar()
    this._selectedTabChangeSubscription.unsubscribe()
  }

  get buttonMessage(): string {
    return this._addButtonMessage.value
  }

  set buttonMessage(tabName: string) {
    const newTabName = tabName.slice(0, -1).toLowerCase()

    this._addButtonMessage.next(`Adicionar ${newTabName}`)
  }
}
