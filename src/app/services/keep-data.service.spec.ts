import { TestBed } from '@angular/core/testing';

import { KeepDataService } from './keep-data.service';

describe('KeepDataService', () => {
  let service: KeepDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KeepDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
