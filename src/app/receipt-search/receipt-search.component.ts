import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { InvoiceService } from '../service/InvoiceService';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-receipt-search',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './receipt-search.component.html',
  styleUrls: ['./receipt-search.component.scss'],
  providers: [InvoiceService],
})
export class ReceiptSearchComponent implements OnInit {
  hasSearched = false;
  searchForm!: FormGroup;
  invoiceForm: FormGroup;
  currentInvoiceId!: number;
  showPassport = false;
  showQid = false;
  filteredData: any[] = [];
  paginatedData: any[] = [];
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 0;
  totalPagesArray: number[] = [];
  message: string = '';
  stores = [
    { id: 1, name: '118 - WOQOD PETROL STATION DUKHAN' },
    { id: 2, name: '119 - WOQOD AIR GAS STATION' },
    { id: 3, name: '120 - WOQOD DIESEL STATION' },
  ];

  @ViewChild('invoiceModal') invoiceModal!: TemplateRef<any>;
  constructor(
    private fb: FormBuilder,
    private invoiceService: InvoiceService,
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
      receiptNo: ['', Validators.required],
      fromDate: [today, Validators.required],
      toDate: [today, Validators.required],
    });

    this.searchForm
      .get('fromDate')
      ?.valueChanges.subscribe(() => this.validateDateRange());
    this.searchForm
      .get('toDate')
      ?.valueChanges.subscribe(() => this.validateDateRange());
  }

  validateDateRange(): void {
    const fromDate = this.searchForm.get('fromDate')?.value;
    const toDate = this.searchForm.get('toDate')?.value;

    if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
      this.searchForm.get('toDate')?.setErrors({ invalidRange: true });
    } else {
      this.searchForm.get('toDate')?.setErrors(null);
    }
  }
  onRefresh(): void {
    if (this.searchForm.valid) {
      const formData = this.searchForm.value;

      this.invoiceService.getInvoiceDetails(formData).subscribe(
        (data) => {
          if (data.message && data.data.length === 0) {
            this.filteredData = [];
            this.hasSearched = true;
            this.message = data.message;
          } else {
            this.filteredData = data;
            this.hasSearched = true;
            this.calculateTotalPages();
            this.paginateData();
            this.message = '';
          }
        },
        (error) => {
          console.error('Error fetching invoices', error);
        }
      );
    } else {
      alert('Enter Store id and reciept no');
    }
  }

  onClear() {
    this.searchForm.reset();
    this.filteredData = [];
    this.hasSearched = false;
    this.paginatedData = [];
    this.totalPages = 0;
    this.totalPagesArray = [];
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
    this.showPassport = proofOfIdentity === 'passport';
    this.showQid = proofOfIdentity === 'qid';

    if (this.showPassport) {
      if (this.invoiceForm.controls['passport'].value) {
        this.invoiceForm.controls['passport'].disable();
      } else {
        this.invoiceForm.controls['passport'].enable();
      }
      this.invoiceForm.controls['qid'].disable();
    } else if (this.showQid) {
      if (this.invoiceForm.controls['qid'].value) {
        this.invoiceForm.controls['qid'].disable();
      } else {
        this.invoiceForm.controls['qid'].enable();
      }
      this.invoiceForm.controls['passport'].disable();
    }
  }

  setFieldState(fieldName: string, value: any) {
    if (value) {
      this.invoiceForm.controls[fieldName].disable();
    } else {
      this.invoiceForm.controls[fieldName].enable();
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
      .subscribe(
        (response) => {
          console.log('Invoice updated successfully', response);
          this.modalService.dismissAll();
          this.onRefresh();
        },
        (error) => {
          console.error('Error updating invoice', error);
        }
      );
  }

  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.filteredData.length / this.itemsPerPage);
    this.totalPagesArray = Array(this.totalPages)
      .fill(0)
      .map((x, i) => i + 1);
  }

  paginateData(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedData = this.filteredData.slice(startIndex, endIndex);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.paginateData();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginateData();
    }
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.paginateData();
  }
}
