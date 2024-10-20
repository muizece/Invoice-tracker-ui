import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceModalComponent } from './invoice-modal.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

describe('InvoiceModalComponent', () => {
  let component: InvoiceModalComponent;
  let fixture: ComponentFixture<InvoiceModalComponent>;

  let formBuilder: FormBuilder;
  let formGroup: FormGroup;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoiceModalComponent,
        ReactiveFormsModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoiceModalComponent);
    component = fixture.componentInstance;

    formBuilder = TestBed.inject(FormBuilder);

    formGroup = formBuilder.group({
      customerName: [''],
      email: [''],
      mobileNumber: [''],
      proofOfIdentity:[''],
    });

    component.invoiceForm = formGroup;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
