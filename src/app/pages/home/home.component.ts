import { Component, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MatTabGroup, MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private _addButtonMessage = new BehaviorSubject<string>("Adicionar resposta")
  @ViewChild("tabGroup") tabGroup: MatTabGroup;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.tabGroup.selectedTabChange.subscribe( (selectedTabChange: MatTabChangeEvent) => this.buttonMessage = selectedTabChange.tab.textLabel)
  }

  get buttonMessage(): string {
    return this._addButtonMessage.value
  }

  set buttonMessage(tabName: string) {
    const newTabName = tabName.slice(0, -1).toLowerCase()

    this._addButtonMessage.next(`Adicionar ${newTabName}`)
  }
}
