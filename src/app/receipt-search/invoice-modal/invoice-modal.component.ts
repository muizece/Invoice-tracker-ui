import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-invoice-modal',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './invoice-modal.component.html',
  styleUrl: './invoice-modal.component.scss',
})
export class InvoiceModalComponent {
  @Input() invoiceForm!: FormGroup;
  @Input() showPassport!: boolean;
  @Input() showQid!: boolean;
  @Input() receiptNo!: string;
  @Input() invoiceDate!:string;
  @Output() close = new EventEmitter<void>();
  @Output() updateInvoice = new EventEmitter<void>();
  @Output() onProofOfIdentityChange = new EventEmitter<void>();
}
