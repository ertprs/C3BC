import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteAnswerDialogComponent } from './delete-answer-dialog.component';

describe('DeleteAnswerDialogComponent', () => {
  let component: DeleteAnswerDialogComponent;
  let fixture: ComponentFixture<DeleteAnswerDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteAnswerDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteAnswerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
