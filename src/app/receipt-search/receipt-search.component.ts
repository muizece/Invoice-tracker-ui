import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { InvoiceService } from '../services/InvoiceService';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SearchFormComponent } from './search-form/search-form.component';
import { InvoiceTableComponent } from './invoice-table/invoice-table.component';
import { InvoiceModalComponent } from './invoice-modal/invoice-modal.component';
import { catchError, debounceTime, of, tap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-receipt-search',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    HttpClientModule,
    SearchFormComponent,
    InvoiceTableComponent,
    InvoiceModalComponent,
  ],
  templateUrl: './receipt-search.component.html',
  styleUrls: ['./receipt-search.component.scss'],
  providers: [InvoiceService],
})
export class ReceiptSearchComponent implements OnInit {
  hasSearched = false;
  searchForm!: FormGroup;
  invoiceForm!: FormGroup;
  currentInvoiceId!: number;
  showPassport = false;
  showQid = false;
  filteredData: any[] = [];
  paginatedData: any[] = [];
  originalData: any[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 0;
  totalPagesArray: number[] = [];
  message: string = '';
  receiptNo!: string;
  invoiceDate!: string;
  totalRecords!:number;

  @ViewChild('invoiceModal') invoiceModal!: TemplateRef<any>;
  constructor(
    private fb: FormBuilder,
    private invoiceService: InvoiceService,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) {
    this.invoiceForm = this.fb.group({
      customerName: [''],
      email: [''],
      mobileNumber: [''],
      proofOfIdentity: ['', Validators.required],
      passport: [''],
      qid: [''],
    });
  }

  ngOnInit(): void {
    const today = new Date().toISOString().split('T')[0];

    this.searchForm = this.fb.group({
      storeId: [null, Validators.required],
      receiptNo: [''],
      fromDate: [today, Validators.required],
      toDate: [today, Validators.required],
    });

    this.searchForm
      .get('fromDate')
      ?.valueChanges.subscribe(() => this.validateDateRange());
    this.searchForm
      .get('toDate')
      ?.valueChanges.subscribe(() => this.validateDateRange());

    this.searchForm
      .get('receiptNo')
      ?.valueChanges.pipe(debounceTime(300))
      .subscribe(() => {
        this.filterReceiptNo();
      });

    this.onRefresh();
  }

  validateDateRange(): void {
    const fromDate = this.searchForm.get('fromDate')?.value;
    const toDate = this.searchForm.get('toDate')?.value;

    if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
      this.toastr.error(
        'From Date cannot be later than To Date.',
        'Invalid Date Range'
      );
    } else {
      this.searchForm.get('toDate')?.setErrors(null);
    }
  }

  filterReceiptNo(): void {
    const searchTerm = this.searchForm.get('receiptNo')?.value;

    if (searchTerm && searchTerm.trim() !== '') {
      this.filteredData = this.originalData.filter((invoice) =>
        invoice.receiptNo
          .toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    } else {
      this.filteredData = [...this.originalData];
    }
    this.calculateTotalPages();
  }
  onRefresh(): void {
    this.validateDateRange();
    if (this.searchForm.valid) {
      const formData = this.searchForm.value;
      formData.pageNumber = this.currentPage; 
      formData.pageSize = this.itemsPerPage;
      this.invoiceService.getInvoiceDetails(formData).subscribe(
        (data) => {
          if (data.message && data.data.length === 0) {
            this.filteredData = [];
            this.hasSearched = true;
            this.message = data.message;
            this.paginatedData = [];
          } else {
            this.originalData = data.data;
            this.filteredData = [...this.originalData];
            this.totalRecords=data.totalCount;
            this.hasSearched = true;
            this.calculateTotalPages();
            this.message = '';
          }
        },
        (error) => {
          console.error('Error fetching invoices', error);
        }
      );
    } else {
      if (!this.searchForm.get('storeId')?.value) {
        this.toastr.warning('Please select a Store ID.', 'Missing Input');
      }
    }
  }

  onClear() {
    this.searchForm.reset();
    this.filteredData = [];
    this.hasSearched = false;
    this.message = '';
    this.paginatedData = [];
    this.totalPages = 0;
    this.totalPagesArray = [];
  }

  onCloseModal() {
    this.modalService.dismissAll();
  }

  openModal(id: number) {
    this.currentInvoiceId = id;

    this.invoiceService.getInvoiceById(id).subscribe((invoice) => {
      this.invoiceForm.patchValue({
        id: invoice.id,
        storeName: invoice.storeName,
        receiptNo: invoice.receiptNo,
        totalAmount: invoice.totalAmount,
        invoiceDate: invoice.invoiceDate,
        mobileNumber: invoice.mobileNumber || '',
        proofOfIdentity: invoice.proofOfIdentity || 'passport',
        email: invoice.email || '',
        customerName: invoice.customerName || '',
        qid: invoice.qid || '',
        passport: invoice.passport || '',
      });

      this.receiptNo = invoice.receiptNo;
      this.invoiceDate = invoice.invoiceDate;

      this.setFieldState('customerName', invoice.customerName);
      this.setFieldState('email', invoice.email);
      this.setFieldState('mobileNumber', invoice.mobileNumber);
      this.setFieldState('proofOfIdentity', invoice.proofOfIdentity);

      this.onProofOfIdentityChange();

      this.modalService.open(this.invoiceModal);
    });
  }

  onProofOfIdentityChange(): void {
    const proofOfIdentity = this.invoiceForm.get('proofOfIdentity')?.value;

    const isPassport = proofOfIdentity === 'passport';
    const isQid = proofOfIdentity === 'qid';

    this.showPassport = isPassport;
    this.showQid = isQid;

    this.toggleFormControl('passport', isPassport);
    this.toggleFormControl('qid', isQid);
  }

  private toggleFormControl(controlName: string, condition: boolean): void {
    const control = this.invoiceForm.controls[controlName];
    if (condition && !control.value) {
      control.enable();
      if (controlName === 'passport') {
        control.setValidators([Validators.required, Validators.minLength(8)]); // Example validation for passport
      } else if (controlName === 'qid') {
        control.setValidators([Validators.required, Validators.minLength(6)]); // Example validation for QID
      }
      control.updateValueAndValidity();
    } else {
      control.disable();
    }
  }

  setFieldState(fieldName: string, value: any) {
    const control = this.invoiceForm.controls[fieldName];
    if (value) {
      this.invoiceForm.controls[fieldName].disable();
    } else {
      this.invoiceForm.controls[fieldName].enable();

      if (fieldName === 'customerName') {
        control.setValidators([Validators.required, Validators.minLength(2)]);
      } else if (fieldName === 'email') {
        control.setValidators([Validators.required, Validators.email]);
      } else if (fieldName === 'mobileNumber') {
        control.setValidators([
          Validators.required,
          Validators.pattern('^[0-9]{10}$') // 10-digit mobile number validation
        ]);
      }
      control.updateValueAndValidity();
    }
  }

  updateInvoice() {
    const formValues = this.invoiceForm.getRawValue();
    const updatedInvoice = {
      id: this.currentInvoiceId || 0,
      storeName: '',
      receiptNo: 0,
      totalAmount: 0,
      invoiceDate: new Date().toISOString(),
      mobileNumber:
        formValues.mobileNumber !== '' ? formValues.mobileNumber : 0,
      passport: formValues.passport || '',
      email: formValues.email || '',
      customerName: formValues.customerName || '',
      qid: formValues.qid !== '' ? formValues.qid : 0,
    };

    this.invoiceService
      .updateInvoice(this.currentInvoiceId, updatedInvoice)
      .pipe(
        tap((response) => {
          console.log('Invoice updated successfully', response);
          this.toastr.success('Invoice updated successfully!', 'Success');
          this.modalService.dismissAll();
          this.onRefresh();
        }),
        catchError((error) => {
          console.error('Error updating invoice', error);
          this.toastr.error('Failed to update invoice. Please try again.');
          return of(null);
        })
      )
      .subscribe();
  }

  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.totalRecords / this.itemsPerPage);
    this.totalPagesArray = Array(this.totalPages)
      .fill(0)
      .map((x, i) => i + 1);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.onRefresh();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.onRefresh();
    }
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.onRefresh();
  }
}
