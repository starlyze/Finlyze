import { TestBed } from '@angular/core/testing';

import { StockSearcherService } from './stock-searcher.service';

describe('StockSearcherService', () => {
  let service: StockSearcherService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StockSearcherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
