import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ReceiptSearchComponent } from './receipt-search/receipt-search.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,ReceiptSearchComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'woqod-store-app';
}
