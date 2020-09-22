import { TestBed } from '@angular/core/testing';

import { ScriptContextService } from './script-context.service';

describe('ScriptContextService', () => {
  let service: ScriptContextService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScriptContextService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
