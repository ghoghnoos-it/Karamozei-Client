import { TestBed } from '@angular/core/testing';

import { Account } from './account.service';

describe('Account', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: Account = TestBed.get(Account);
    expect(service).toBeTruthy();
  });
});
