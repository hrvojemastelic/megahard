import { TestBed } from '@angular/core/testing';

import { MainScreenService } from './main-screen.service';

describe('MainScreenService', () => {
  let service: MainScreenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MainScreenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
