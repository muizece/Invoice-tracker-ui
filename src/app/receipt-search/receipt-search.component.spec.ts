import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptSearchComponent } from './receipt-search.component';

describe('ReceiptSearchComponent', () => {
  let component: ReceiptSearchComponent;
  let fixture: ComponentFixture<ReceiptSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReceiptSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceiptSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
