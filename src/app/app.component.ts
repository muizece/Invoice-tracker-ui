import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ReceiptSearchComponent } from './receipt-search/receipt-search.component';
import { SearchFormComponent } from './receipt-search/search-form/search-form.component';
import { InvoiceModalComponent } from './receipt-search/invoice-modal/invoice-modal.component';
import { InvoiceTableComponent } from './receipt-search/invoice-table/invoice-table.component';
import { ToastrModule } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,ReceiptSearchComponent,SearchFormComponent,InvoiceModalComponent,InvoiceTableComponent,ToastrModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'woqod-store-app';
}
