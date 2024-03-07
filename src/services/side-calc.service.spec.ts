/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SideCalcService } from './side-calc.service';

describe('Service: SideCalc', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SideCalcService]
    });
  });

  it('should ...', inject([SideCalcService], (service: SideCalcService) => {
    expect(service).toBeTruthy();
  }));
});
