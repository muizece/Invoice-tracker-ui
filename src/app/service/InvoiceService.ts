import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  private apiUrl = 'https://localhost:7029/api/Invoice';
  
  constructor(private http: HttpClient) {}

  getInvoices(receiptNo: number, storeId: number, fromDate: string, toDate: string): Observable<any> {
    let params = new HttpParams()
      .set('receiptNo', receiptNo.toString())
      .set('storeId', storeId.toString())
      .set('fromDate', fromDate)
      .set('toDate', toDate);
    
    return this.http.get(this.apiUrl, { params });
  }
}
