import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnswersTabComponent } from './answers-tab.component';

describe('AnswersTabComponent', () => {
  let component: AnswersTabComponent;
  let fixture: ComponentFixture<AnswersTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnswersTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnswersTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
