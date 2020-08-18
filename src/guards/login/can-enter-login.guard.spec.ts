import { TestBed } from '@angular/core/testing';

import { CanEnterLoginGuard } from './can-enter-login.guard';

describe('CanEnterLoginGuard', () => {
  let guard: CanEnterLoginGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CanEnterLoginGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
