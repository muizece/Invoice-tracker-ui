import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './search-form.component.html',
  styleUrl: './search-form.component.scss',
})
export class SearchFormComponent {
  @Input() searchForm!: FormGroup;
  @Output() refresh = new EventEmitter<void>();
  @Output() clear = new EventEmitter<void>();

  stores = [
    { id: 1, name: '118 - WOQOD PETROL STATION DUKHAN' },
    { id: 2, name: '119 - WOQOD AIR GAS STATION' },
    { id: 3, name: '120 - WOQOD DIESEL STATION' },
  ];
}
