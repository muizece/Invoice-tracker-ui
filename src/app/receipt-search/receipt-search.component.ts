import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-receipt-search',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './receipt-search.component.html',
  styleUrl: './receipt-search.component.scss'
})
export class ReceiptSearchComponent implements OnInit {

  searchForm!: FormGroup;

  stores = [
    { id: 1, name: 'Store 1' },
    { id: 2, name: 'Store 2' },
    { id: 3, name: 'Store 3' }
  ];

  mockData = [
    { receiptNo: 'R100', store: 1, date: '2023-10-12', amount: 500, status: 'Pending' },
    { receiptNo: 'R200', store: 2, date: '2023-09-10', amount: 1000, status: 'Completed' },
  ];

  filteredData: any[] = [];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    const today = new Date().toISOString().split('T')[0];

    this.searchForm = this.fb.group({
      storeId: [null, Validators.required],
      receiptNo: ['', Validators.required],
      fromDate: [today, Validators.required],
      toDate: [today, Validators.required]
    });

    this.searchForm.get('receiptNo')?.valueChanges.subscribe((value) => {
      if (value) {
        this.filterMockData(value);
      }
    });

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

  filterMockData(receiptNo: string): void {
    const storeId = this.searchForm.get('storeId')?.value;
    this.filteredData = this.mockData.filter(data =>
      data.receiptNo.toLowerCase().includes(receiptNo.toLowerCase()) && 
      data.store === storeId);
  }

  onRefresh() {
    if (this.searchForm.valid) {
      console.log(this.searchForm.value);
      this.filterMockData(this.searchForm.get('receiptNo')?.value);
    }
  }

  onClear() {
    this.searchForm.reset();
  }


}
