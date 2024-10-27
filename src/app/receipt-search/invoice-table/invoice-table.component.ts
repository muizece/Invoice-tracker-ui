import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-invoice-table',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './invoice-table.component.html',
  styleUrl: './invoice-table.component.scss',
})
export class InvoiceTableComponent {
  @Input() filteredData: any[] = [];
  @Input() totalPagesArray: number[] = [];
  @Input() itemsPerPage = 10;
  @Input() totalPages = 0;
  @Input() currentPage = 1;
  @Input() message = '';
  @Input() hasSearched = false;
  @Input() totalRecords!:number;
  @Input() searchForm!:FormGroup;
  @Output() openModal = new EventEmitter<number>();
  @Output() previousPage = new EventEmitter<void>();
  @Output() goToPage = new EventEmitter<number>();
  @Output() nextPage = new EventEmitter<void>();
  @Output() openViewModal = new EventEmitter<any>();

viewRecord(record: any): void {
  this.openViewModal.emit(record);
}
}
