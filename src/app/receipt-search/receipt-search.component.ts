import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { InvoiceService } from '../service/InvoiceService';

@Component({
  selector: 'app-receipt-search',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule], // Include HttpClientModule here
  templateUrl: './receipt-search.component.html',
  styleUrls: ['./receipt-search.component.scss'],
  providers:[InvoiceService]
})
export class ReceiptSearchComponent implements OnInit {

  searchForm!: FormGroup;
  filteredData: any[] = [];
  stores = [
    { id: 1, name: 'Store 1' },
    { id: 2, name: 'Store 2' },
    { id: 3, name: 'Store 3' }
  ];

  constructor(private fb: FormBuilder, private invoiceService: InvoiceService) {}

  ngOnInit(): void {
    const today = new Date().toISOString().split('T')[0];

    this.searchForm = this.fb.group({
      storeId: [null, Validators.required],
      receiptNo: ['', Validators.required],
      fromDate: [today, Validators.required],
      toDate: [today, Validators.required]
    });

    this.searchForm.get('receiptNo')?.valueChanges.subscribe(() => this.validateDateRange());
    this.searchForm.get('fromDate')?.valueChanges.subscribe(() => this.validateDateRange());
    this.searchForm.get('toDate')?.valueChanges.subscribe(() => this.validateDateRange());
  }

  validateDateRange(): void {
    const fromDate = this.searchForm.get('fromDate')?.value;
    const toDate = this.searchForm.get('toDate')?.value;

    if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
      this.searchForm.get('toDate')?.setErrors({ invalidDate: true });
    }
  }

  onRefresh(): void {
    if (this.searchForm.valid) {
      const { receiptNo, storeId, fromDate, toDate } = this.searchForm.value;
      this.invoiceService.getInvoices(receiptNo, storeId, fromDate, toDate).subscribe(
        (data) => {
          this.filteredData = data;
        },
        (error) => {
          console.error('Error fetching invoices', error);
        }
      );
    }
  }

  onClear(): void {
    this.searchForm.reset();
  }
}
