/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { WarehouserService } from './warehouse.service';

describe('Service: Warehouser', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WarehouserService]
    });
  });

  it('should ...', inject([WarehouserService], (service: WarehouserService) => {
    expect(service).toBeTruthy();
  }));
});
