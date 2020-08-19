import { TestBed } from '@angular/core/testing';

import { CanEnterHomeGuard } from './can-enter-home.guard';

describe('CanEnterHomeGuard', () => {
  let guard: CanEnterHomeGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CanEnterHomeGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
