import { TestBed } from '@angular/core/testing';

import { GroceryStoreFormService } from './grocery-store-form.service';

describe('GroceryStoreFormService', () => {
  let service: GroceryStoreFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GroceryStoreFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
