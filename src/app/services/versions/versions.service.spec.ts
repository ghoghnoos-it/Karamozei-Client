import { TestBed } from '@angular/core/testing';

import { Versions } from './versions.service';

describe('Versions', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: Versions = TestBed.get(Versions);
    expect(service).toBeTruthy();
  });
});
