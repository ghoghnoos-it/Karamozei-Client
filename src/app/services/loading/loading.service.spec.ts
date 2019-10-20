import { TestBed } from '@angular/core/testing';

import { Loading } from './loading.service';

describe('Loading', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: Loading = TestBed.get(Loading);
    expect(service).toBeTruthy();
  });
});
