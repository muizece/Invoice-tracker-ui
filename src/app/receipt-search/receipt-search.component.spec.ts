import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptSearchComponent } from './receipt-search.component';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { InvoiceService } from '../services/InvoiceService';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';

describe('ReceiptSearchComponent', () => {
  let component: ReceiptSearchComponent;
  let fixture: ComponentFixture<ReceiptSearchComponent>;
  let toastrService: ToastrService;
  let invoiceService: InvoiceService;
  let mockInvoiceService: jasmine.SpyObj<InvoiceService>;

  beforeEach(async () => {

    mockInvoiceService = jasmine.createSpyObj('InvoiceService', ['getInvoiceDetails', 'getInvoiceById', 'updateInvoice']);

    await TestBed.configureTestingModule({
      imports: [ReceiptSearchComponent,
        ReactiveFormsModule,
        HttpClientTestingModule, 
        ToastrModule.forRoot(),
      ],
      providers: [
        { provide: InvoiceService, useValue: mockInvoiceService }, NgbModal, FormBuilder]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceiptSearchComponent);
    component = fixture.componentInstance;


    toastrService = TestBed.inject(ToastrService);
    invoiceService = TestBed.inject(InvoiceService);

    component.searchForm = component['fb'].group({
      storeId: [null],
      receiptNo: [''],
      fromDate: [''],
      toDate: ['']
    });

    component.invoiceForm = component['fb'].group({
      customerName: [''],
      email: [''],
      mobileNumber: [''],
      proofOfIdentity: [''],
      passport: [''],
      qid: [''],
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the searchForm on init', () => {
    component.ngOnInit();
    expect(component.searchForm).toBeTruthy();
    expect(component.searchForm.controls['storeId'].valid).toBeFalse(); // storeId is required
  });

  it('should refresh and fetch invoices when form is valid', () => {
    const mockData = {
      message: '',
      data: [{ id: 1, storeName: 'Test Store', receiptNo: 123}]
    };
    mockInvoiceService.getInvoiceDetails.and.returnValue(of(mockData));

    component.searchForm.patchValue({
      storeId: 1,
      receiptNo: '12345',
      fromDate: '2023-01-01',
      toDate: '2023-01-02',
    });

    component.onRefresh();
    expect(component.filteredData.length).toBe(0);
  });

  it('should clear the form and reset state', () => {
    component.onClear();
    expect(component.searchForm.get('storeId')?.value).toBeNull();
    expect(component.filteredData.length).toBe(0);
    expect(component.hasSearched).toBeFalse();
  });
});
